import { useMutation } from "@tanstack/react-query"
import { useContract, useContractWrite, useSDK, useStorageUpload } from "@thirdweb-dev/react"
import { PublicationMainFocus, useCreatePostTypedDataMutation } from "../graphql/generated"
import useLensUser from "./auth/useLensUser"
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers"
import { v4 as uuidv4 } from "uuid"
import {
    LENS_MUMBAI_CONTRACT_ABI,
    LENS_MUMBAI_CONTRACT_ADDRESS,
    LENS_SANDBOX_CONTRACT_ADDRESS
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

    async function uploadJSONToIPFS(val: string) {
        // upload to ipfs.io
        const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "post",
            body: val,
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMWMwYmU5ZC1jY2E4LTQwMTEtOTI1Yy00NDRmZjg2NDUyZWYiLCJlbWFpbCI6InlhaHlhQG1vbmVtZXRyaWNzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3M2ZkM2I5NWQ4NzNlOTY3MTRmMSIsInNjb3BlZEtleVNlY3JldCI6IjNmMTY0YTQ4YWY0MjI4NGU2ZGY1MTljZjE1ZjhiZTc1NDQyOTQ0NjBkMTFlNjI2NzMxYzJhMjM1Mzk5ZDY2NGYiLCJpYXQiOjE2NzkzMzUyMzl9.Ytx6tk95t3_Spl0JrleMZ7agGL1B7joSeLJGK_ws1Bg`
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
        const proof = await generateFullProof(_identity, selectedProof, content)

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
            console.log("adding circleId to metadata: ", selectedProof.id)
            postMetadata.attributes.push({
                traitType: "zk3Circle",
                value: selectedProof.id.toString()
            })
        }

        const postMetadataIpfsUrl = await uploadJSONToIPFS(JSON.stringify(postMetadata))

        console.log("postMetadataIpfsUrl", postMetadataIpfsUrl)

        const referenceModule = "0x69482d8265CE6EEF4a2E00591E801D03A755521E"
        const hashedPostBody = keccak256(Buffer.from(content))
        const referenceModuleInitData = ethers.utils.AbiCoder.prototype.encode(
            ["bool", "bool", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
            [
                false,
                false,
                BigNumber.from(hashedPostBody),
                proof?.nullifierHash,
                selectedProof.id.toString(),
                proof?.externalNullifier,
                proof?.proof
            ]
        )

        console.log("referenceModuleInitData", referenceModuleInitData)
        console.log("referenceModule", referenceModule)

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

        // Destructure the stuff we need out of the typedData.value field
        const { collectModule, collectModuleInitData, contentURI, deadline, profileId } =
            typedData.createPostTypedData.typedData.value
        // const collectModule = "0x11C45Cbc6fDa2dbe435C0079a2ccF9c4c7051595" // FreeCollectModule
        console.log("collectModule", collectModule)

        const result = await lensHubContract.call("post", {
            profileId: profileQuery.data?.defaultProfile?.id,
            contentURI: postMetadataIpfsUrl,
            collectModule,
            collectModuleInitData: collectModuleInitData,
            referenceModule: referenceModule, // add address of LensZK3ReferenceModule here
            referenceModuleInitData: referenceModuleInitData // add ABI encoded proof here
        })
        console.log("result", result)

        // uint256 profileId;
        // string contentURI;
        // address collectModule;
        // bytes collectModuleInitData;
        // address referenceModule;
        // bytes referenceModuleInitData;
    }

    return useMutation(createPost)
}
