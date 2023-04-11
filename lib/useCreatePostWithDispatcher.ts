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
    ZK3_REFERENCE_MODULE_CONTRACT_ADDRESS,
    SEMAPHORE_ZK3_CONTRACT_ABI,
    ZK3_GRAPHQL_ENDPOINT
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

export function useCreatePostWithDispatcher() {
    const { mutateAsync: requestTypedData } = useCreatePostTypedDataMutation()
    const { mutateAsync: uploadToIpfs } = useStorageUpload()
    const { profileQuery } = useLensUser()
    const sdk = useSDK()
    const { mutateAsync: loginUser } = useLogin()
    const { _identity, _lensAuthToken } = useContext(ZK3Context)
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

    async function createPostWithDispatcher({ image, title, description, content, selectedProof }: CreatePostArgs) {
        console.log("createPost", image, title, description, content, selectedProof)
        // 0. Login
        await loginUser()

        if (!(content && content.length > 0 && _identity && selectedProof)) {
            toast({
                title: `Missing proof parameters!`,
                description: `Ensure your identity is connected! The content of the post cannot be empty and you must select a proof to publish the post.`,
                status: "error",
                duration: 10000,
                isClosable: true
            })
            return
        }
        console.log("setting proof args", _identity, selectedProof, content)
        const { proof, group } = (await generateFullProof(_identity, selectedProof, content))!
        console.log("proof", proof)
        console.log("group", group)
        toast({
            title: `Proof generation complete`,
            description: `The ZK3 proof has been locally generated. Please standby while we upload the proof to the blockchain. Expect a transaction confirmation prompt in your wallet.`,
            status: "info",
            duration: 30000,
            isClosable: true
        })
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
            postMetadata.attributes.push({
                traitType: "zk3CircleId",
                value: selectedProof.id
            })
        }

        // const postMetadataIpfsUrl = await uploadToIpfs(JSON.stringify(postMetadata))
        const postMetadataIpfsUrl = (await uploadToIpfs({ data: [postMetadata] }))[0]

        console.log("postMetadataIpfsUrl", postMetadataIpfsUrl)

        const referenceModule = ZK3_REFERENCE_MODULE_CONTRACT_ADDRESS
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

        if (!sdk) return

        const semaphoreZk3Contract = await sdk.getContractFromAbi(
            SEMAPHORE_ZK3_CONTRACT_ADDRESS,
            SEMAPHORE_ZK3_CONTRACT_ABI
        )
        
        const rootOnChain = await semaphoreZk3Contract.call("getMerkleTreeRoot", BigNumber.from(selectedProof.id))
        console.log("rootOnChain", rootOnChain.toString())
        // check if roots match
        if (rootOnChain.toString() !== group.root.toString()) {
            console.log("localRoot", group.root.toString())
            console.log("roots don't match")
            toast({
                title: `Error: Merkle Root mismatch!`,
                description: `The locally generated proof is incompatible with the proof on-chain. This is likely caused by a bug in the circle data. Please reach out to us on discord for help`,
                status: "error",
                duration: 30000,
                isClosable: true
            })
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
        if (!isValid) {
            toast({
                title: `Error: Invalid Proof!`,
                description: `The proof you provided is invalid, despite matching Merkle roots. This error shouldn't happen unless something really unexpected happened. Please reach out to us on discord for help`,
                status: "error",
                duration: 30000,
                isClosable: true
            })
            return
        }

        // End of proofs and checks, now we can actually create the post

        const broadcastPost = async () => {
            const broadcastPostMutation = {
                operationName: "Mutation",
                query: `
                mutation Mutation($circleId: ID!, $profileId: String!, $contentUri: String!, $refInitData: String!, $signature: String) {
                    broadcastPost(circleId: $circleId, profileId: $profileId, contentURI: $contentUri, refInitData: $refInitData, signature: $signature)
                  }
                  `,
                variables: {
                    circleId: selectedProof.id,
                    profileId: profileQuery.data?.defaultProfile?.id,
                    contentUri: postMetadataIpfsUrl,
                    refInitData: referenceModuleInitData,
                }
            }
    
            const response = await fetch(ZK3_GRAPHQL_ENDPOINT, {
                method: "POST",
                headers: {
                    "x-access-token": `Bearer ${_lensAuthToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(broadcastPostMutation)
            })
            const data: { data: any } = await response.json()
            console.log("broadcastPost with Dispatcher: ", data.data)
            return data.data
        }

        const result = await broadcastPost()        

        console.log("result", result)
        toast({
            title: `Lens Post Created!`,
            description: `https://mumbai.polygonscan.com/tx/${result.receipt.transactionHash}`,
            status: "success",
            duration: 300000,
            isClosable: true
        })
    }

    return useMutation(createPostWithDispatcher)
}
