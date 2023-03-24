import { useMutation } from "@tanstack/react-query"
import { useContract, useContractWrite, useSDK, useStorageUpload } from "@thirdweb-dev/react"
import { PublicationMainFocus, useCreatePostTypedDataMutation } from "../graphql/generated"
import useLensUser from "./auth/useLensUser"
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@chakra-ui/react"
import {
    LENS_MUMBAI_CONTRACT_ABI,
    LENS_MUMBAI_CONTRACT_ADDRESS,
    LENS_SANDBOX_CONTRACT_ADDRESS,
    SEMAPHORE_ZK3_CONTRACT_ADDRESS,
    SEMAPHORE_ZK3_CONTRACT_ABI
} from "../const/contracts"
import useLogin from "./auth/useLogin"
import { useEffect, useContext } from "react"
import ZK3Context from "../context/ZK3Context"
import useZK3Proof from "./useZK3Proof"
import { keccak256 } from "ethers/lib/utils"
import { BigNumber, ethers } from "ethers"

interface circle {
    id: string
    members: string[]
    name: string
    description: string
    contentURI: string
}

type CreatePostArgs = {
    image: File | null
    title: string
    description: string
    content: string
    selectedProof: circle | undefined
}

const PINATA_JWT = process.env.PINATA_JWT

export function useCreatePost() {
    const { mutateAsync: requestTypedData } = useCreatePostTypedDataMutation()
    const { mutateAsync: uploadToIpfs } = useStorageUpload()
    const { profileQuery } = useLensUser()
    const sdk = useSDK()
    const { mutateAsync: loginUser } = useLogin()
    const { _identity } = useContext(ZK3Context)
    const { generateFullProof } = useZK3Proof()
    const { contract: lensHubContract, isLoading, error } = useContract(LENS_SANDBOX_CONTRACT_ADDRESS)
    const { mutateAsync, isLoading: isTxLoading, error: txError } = useContractWrite(lensHubContract, "post")
    const toast = useToast()

    async function uploadJSONToIPFS(val: string) {
        // upload to ipfs.io
        const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "post",
            body: val,
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${PINATA_JWT}`
            }
        })
        const { IpfsHash } = await res.json()
        const contentURI = `ipfs://${IpfsHash}`
        console.log("contentURI: ", contentURI)
        return contentURI
        // return res.json()
    }

    async function createPost({ image, title, description, content, selectedProof }: CreatePostArgs) {
        console.log("createPost", image, title, description, content, selectedProof)
        // 0. Login
        await loginUser()

        if (!(content && content.length > 0 && _identity && selectedProof)) {
            return
        }
        console.log("setting proof args", _identity, selectedProof, content)
        const { proof, group } = (await generateFullProof(_identity, selectedProof, content))!
        console.log("proof", proof)
        console.log("group", group)
        // 0. Upload the image to IPFS
        // const imageIpfsUrl = (await uploadToIpfs({ data: [image] }))[0]

        // console.log("imageIpfsUrl", imageIpfsUrl)

        // 0B) Upload the actual content to IPFS
        // This is going to be a Object which contains the image field as well
        const postMetadata = {
            version: "2.0.0",
            mainContentFocus: PublicationMainFocus.TextOnly,
            metadata_id: uuidv4(),
            description: description,
            locale: "en-US",
            content: content,
            external_url: null,
            // image: imageIpfsUrl,
            // imageMimeType: null,
            name: title,
            attributes: <any>[],
            tags: []
        }

        // Add ZK3 Proof metadata | this metadata will be used by front-ends (lenster) to display badge data accurately without having to check the proof

        if (selectedProof) {
            console.log("adding circle description to metadata: ", selectedProof.description)
            postMetadata.attributes.push({
                traitType: "zk3Circle",
                value: selectedProof.description
            })
        }

        // const postMetadataIpfsUrl = await uploadToIpfs(JSON.stringify(postMetadata))
        const postMetadataIpfsUrl = (await uploadToIpfs({ data: [postMetadata] }))[0]

        console.log("postMetadataIpfsUrl", postMetadataIpfsUrl)

        const referenceModule = "0x69482d8265CE6EEF4a2E00591E801D03A755521E"
        const hashedPostBody = BigNumber.from(keccak256(Buffer.from(content)))
        const referenceModuleInitData = ethers.utils.AbiCoder.prototype.encode(
            ["bool", "bool", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
            [
                false,
                false,
                hashedPostBody,
                proof?.nullifierHash,
                selectedProof.id.toString(),
                proof?.externalNullifier,
                proof?.proof
            ]
        )

        console.log("referenceModuleInitData", referenceModuleInitData)
        console.log("referenceModule", referenceModule)
        console.log("externalNullifier", proof?.externalNullifier)
        // 1. Ask Lens to give us the typed data
        const typedData = await requestTypedData({
            request: {
                collectModule: {
                    freeCollectModule: {
                        followerOnly: false
                    }
                },
                referenceModule: {
                    followerOnlyReferenceModule: false,
                    unknownReferenceModule: {
                        contractAddress: referenceModule,
                        data: referenceModuleInitData
                    }
                },
                contentURI: postMetadataIpfsUrl,
                profileId: profileQuery.data?.defaultProfile?.id
            }
        })

        const { domain, types, value } = typedData.createPostTypedData.typedData
        console.log("typedData", typedData)

        if (!sdk) return
        // value.referenceModule = referenceModule
        // value.referenceModuleInitData = referenceModuleInitData
        // 2. Sign the typed data
        // const signature = await signTypedDataWithOmmittedTypename(sdk, domain, types, value)

        // const { v, r, s } = splitSignature(signature.signature)

        // 3. Use the signed typed data to send the transaction to the smart contract
        const lensHubContract = await sdk.getContractFromAbi(LENS_SANDBOX_CONTRACT_ADDRESS, LENS_MUMBAI_CONTRACT_ABI)
        const semaphoreZk3Contract = await sdk.getContractFromAbi(
            SEMAPHORE_ZK3_CONTRACT_ADDRESS,
            SEMAPHORE_ZK3_CONTRACT_ABI
        )
        // Destructure the stuff we need out of the typedData.value field
        const { collectModule, collectModuleInitData, contentURI, deadline, profileId } =
            typedData.createPostTypedData.typedData.value
        // const collectModule = "0x11C45Cbc6fDa2dbe435C0079a2ccF9c4c7051595" // FreeCollectModule
        console.log("collectModule", collectModule)
        const rootOnChain = await semaphoreZk3Contract.call("getMerkleTreeRoot", BigNumber.from(selectedProof.id))
        console.log("rootOnChain", rootOnChain.toString())
        // check if roots match
        if (rootOnChain.toString() !== group.root.toString()) {
            console.log("localRoot", group.root.toString())
            console.log("roots don't match")
            return
        }
        const isValid = await semaphoreZk3Contract.call(
            "isValidProof",
            hashedPostBody,
            proof?.nullifierHash,
            BigNumber.from(selectedProof.id),
            proof?.externalNullifier,
            proof?.proof
        )
        console.log("isValid", isValid)
        const result = await lensHubContract.call("post", {
            profileId: profileQuery.data?.defaultProfile?.id,
            contentURI: postMetadataIpfsUrl,
            collectModule,
            collectModuleInitData: collectModuleInitData,
            referenceModule: referenceModule, // add address of LensZK3ReferenceModule here
            referenceModuleInitData: referenceModuleInitData // add ABI encoded proof here
        })
        console.log("result", result)
        toast({
            title: `Lens Post Created!`,
            description: `https://mumbai.polygonscan.com/tx/${result.receipt.transactionHash}`,
            status: 'success',
            duration: 100000,
            isClosable: true,
          })

        // uint256 profileId;
        // string contentURI;
        // address collectModule;
        // bytes collectModuleInitData;
        // address referenceModule;
        // bytes referenceModuleInitData;
    }

    return useMutation(createPost)
}
