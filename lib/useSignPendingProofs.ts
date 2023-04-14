import { createBalanceOfProofDoubleSignedTypedData } from "./ZK3helpers"
import { useSDK, useAddress } from "@thirdweb-dev/react"
import { useQuery, useMutation, gql } from "@apollo/client"
import { Identity } from "@semaphore-protocol/identity"
import { useContext } from "react"
import ZK3Context from "../context/ZK3Context"
import { ethers } from "ethers"

interface SignedProofPayload {
    domain: any
    message: any
    primaryType: string
    types: any
}

interface SignedProof {
    payload: SignedProofPayload
    signature: string
}

const useSignPendingProofs = () => {
    const address = useAddress()
    const sdk = useSDK()
    const { _identity } = useContext(ZK3Context)

    var BALANCE_OF_PROOF = gql`
        mutation CreateBalanceOfProof(
            $identityCommitment: String!
            $ethAddress: String!
            $balance: String!
            $linkedEoaSig: String
            $secondaryEoaSig: String
            $secondaryEoaAddress: String
        ) {
            createBalanceOfProof(
                identityCommitment: $identityCommitment
                ethAddress: $ethAddress
                balance: $balance
                linkedEOASig: $linkedEoaSig
                secondaryEOASig: $secondaryEoaSig
                secondaryEOAAddress: $secondaryEoaAddress
            )
        }
    `

    const [mutateFunction, { data: authData }] = useMutation(BALANCE_OF_PROOF)

    const commitment = new Identity(_identity?.toString()).getCommitment()

    const signPendingProofs = async (sigs: SignedProof[]) => {
        if (!address) return

        if (address !== localStorage.getItem("identityLinkedEOA")) {
            console.log(address, localStorage.getItem("identityLinkedEOA"))
            alert("please swap your wallet to the one you linked to your identity")
        } else {
            sigs.forEach(async (sig) => {
                const { payload, signature } = sig
                const { domain, message, primaryType, types } = payload
                const { identityCommitment, ethAddress, balance } = message // ethAddress = secondary signer (addy with funds)
                const doubleSignedTypedData = await createBalanceOfProofDoubleSignedTypedData(
                    identityCommitment,
                    address,
                    balance,
                    signature
                ) // address = identityLinkedEOA

                const doubleSignature = await sdk?.wallet.signTypedData(
                    doubleSignedTypedData.domain,
                    doubleSignedTypedData.types,
                    doubleSignedTypedData.value
                )
                console.log("doubleSig: ", doubleSignature)

                if (doubleSignature) {
                    const signer = ethers.utils.verifyTypedData(doubleSignedTypedData.domain, doubleSignedTypedData.types, doubleSignedTypedData.value, doubleSignature?.signature)
                    console.log('signer: ', signer)
                    mutateFunction({
                        variables: {
                            identityCommitment: commitment.toString(),
                            ethAddress: address,
                            balance: balance,
                            linkedEoaSig: doubleSignature?.signature,
                            secondaryEoaSig: signature,
                            secondaryEoaAddress: ethAddress
                        }
                    }).then((response) => {
                        console.log("response: ", response)
                    })
                }
            })
        }
    }

    return {
        signPendingProofs
    }
}
export default useSignPendingProofs
