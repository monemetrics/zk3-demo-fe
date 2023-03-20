import { useMutation } from "@tanstack/react-query"
import { useSDK, useStorageUpload } from "@thirdweb-dev/react"
import { PublicationMainFocus, useCreatePostTypedDataMutation } from "../graphql/generated"
import useLensUser from "./auth/useLensUser"
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers"
import { v4 as uuidv4 } from "uuid"
import { LENS_MUMBAI_CONTRACT_ABI, LENS_MUMBAI_CONTRACT_ADDRESS } from "../const/contracts"
import useLogin from "./auth/useLogin"
import { useEffect, useContext } from "react"
import ZK3Context from "../context/ZK3Context"
import useZK3Proof from "./useZK3Proof"

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

    async function createPost({ image, title, description, content, selectedProof }: CreatePostArgs) {
        console.log("createPost", image, title, description, content, selectedProof)
        // 0. Login
        await loginUser()

        if (content && content.length > 0 && _identity && selectedProof) {
            console.log("setting proof args")
            generateFullProof(_identity, selectedProof, content)
        }
        console.log("after generateFullProof")

        // // 0. Upload the image to IPFS
        // const imageIpfsUrl = (await uploadToIpfs({ data: [image] }))[0]

        // console.log("imageIpfsUrl", imageIpfsUrl)

        // // 0B) Upload the actual content to IPFS
        // // This is going to be a Object which contains the image field as well
        // const postMetadata = {
        //     version: "2.0.0",
        //     mainContentFocus: PublicationMainFocus.TextOnly,
        //     metadata_id: uuidv4(),
        //     description: description,
        //     locale: "en-US",
        //     content: content,
        //     external_url: null,
        //     image: imageIpfsUrl,
        //     imageMimeType: null,
        //     name: title,
        //     attributes: <any>[],
        //     tags: []
        // }

        // // Add ZK3 Proof metadata

        // if (selectedProof) {
        //     console.log("adding circleId to metadata: ", selectedProof.id)
        //     postMetadata.attributes.push({
        //         traitType: "zk3Circle",
        //         value: selectedProof.id.toString()
        //     })
        // }

        // const postMetadataIpfsUrl = (await uploadToIpfs({ data: [postMetadata] }))[0]

        // console.log("postMetadataIpfsUrl", postMetadataIpfsUrl)

        // // 1. Ask Lens to give us the typed data
        // const typedData = await requestTypedData({
        //     request: {
        //         collectModule: {
        //             freeCollectModule: {
        //                 followerOnly: false
        //             }
        //         },
        //         referenceModule: {
        //             followerOnlyReferenceModule: false
        //         },
        //         contentURI: postMetadataIpfsUrl,
        //         profileId: profileQuery.data?.defaultProfile?.id
        //     }
        // })

        // const { domain, types, value } = typedData.createPostTypedData.typedData

        // if (!sdk) return

        // // 2. Sign the typed data
        // const signature = await signTypedDataWithOmmittedTypename(sdk, domain, types, value)

        // const { v, r, s } = splitSignature(signature.signature)

        // // 3. Use the signed typed data to send the transaction to the smart contract
        // const lensHubContract = await sdk.getContractFromAbi(LENS_MUMBAI_CONTRACT_ADDRESS, LENS_MUMBAI_CONTRACT_ABI)

        // // Destructure the stuff we need out of the typedData.value field
        // const {
        //     collectModule,
        //     collectModuleInitData,
        //     contentURI,
        //     deadline,
        //     profileId,
        //     referenceModule,
        //     referenceModuleInitData
        // } = typedData.createPostTypedData.typedData.value

        // const result = await lensHubContract.call("postWithSig", {
        //     profileId: profileId,
        //     contentURI: contentURI,
        //     collectModule,
        //     collectModuleInitData,
        //     referenceModule,
        //     referenceModuleInitData,
        //     sig: {
        //         v,
        //         r,
        //         s,
        //         deadline: deadline
        //     }
        // })

        // console.log(result)
    }

    return useMutation(createPost)
}
