import { useState, useContext } from "react"
import ZK3Context from "../context/ZK3Context"
import { useAddress, useSDK } from "@thirdweb-dev/react"
import { SetDispatcherRequest, useDefaultProfileQuery } from "../graphql/generated"
import { LENS_MUMBAI_CONTRACT_ABI, LENS_SANDBOX_CONTRACT_ADDRESS, SANDBOX_API_URL } from "../const/contracts"
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers"

const useSetDispatcher = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const { _lensAuthToken } = useContext(ZK3Context)

    const sdk = useSDK()

    const address = useAddress()

    const profileQuery = useDefaultProfileQuery(
        {
            request: {
                ethereumAddress: address
            }
        },
        {
            enabled: !!address
        }
    )
    console.log(profileQuery.data?.defaultProfile?.id)

    const requestSetDispatcherTypedData = async () => {
        const requestSetDispatcherTypedDataMutation = {
            operationName: "Mutation",
            mutation: `
            mutation CreateSetDispatcherTypedData ($request: SetDispatcherRequest!)) {
                createSetDispatcherTypedData(request: $request) {
                  id
                  expiresAt
                  typedData {
                    types {
                      SetDispatcherWithSig {
                        name
                        type
                      }
                    }
                    domain {
                      name
                      chainId
                      version
                      verifyingContract
                    }
                    value {
                      nonce
                      deadline
                      profileId
                      dispatcher
                    }
                  }
                }
              }`,
            variables: {
                request: {
                    profileId: profileQuery.data?.defaultProfile?.id,
                    dispatcher: "set our custom dispatcher address here"
                }
            }
        }

        const response = await fetch(SANDBOX_API_URL, {
            method: "POST",
            headers: {
                "x-access-token": `Bearer ${_lensAuthToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestSetDispatcherTypedDataMutation)
        })
        const data: { data: { createSetDispatcherTypedData: any } } = await response.json()
        console.log("set dispatcher: enableDispatcherWithTypedData: ", data.data.createSetDispatcherTypedData)
        return data.data.createSetDispatcherTypedData
    }

    const setDispatcher = async () => {
        setLoading(true)
        try {
            const result = await requestSetDispatcherTypedData()
            const typedData = result.typedData
            console.log("set dispatcher: typedData", typedData)

            if (!sdk) throw new Error("SDK not initialized")

            const lensHubContract = await sdk.getContractFromAbi(
                LENS_SANDBOX_CONTRACT_ADDRESS,
                LENS_MUMBAI_CONTRACT_ABI
            )

            const signature = await signTypedDataWithOmmittedTypename(
                sdk,
                typedData.domain,
                typedData.types,
                typedData.value
            )
            console.log("set dispatcher: signature", signature)

            const { v, r, s } = splitSignature(signature.signature)

            const tx = await lensHubContract.call("setDispatcherWithSig", {
                profileId: typedData.value.profileId,
                dispatcher: typedData.value.dispatcher,
                sig: {
                    v,
                    r,
                    s,
                    deadline: typedData.value.deadline
                }
            })
            console.log("set dispatcher: tx hash", tx.hash)
        } catch (e) {
            setError(e)
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        setDispatcher
    }
}

export default useSetDispatcher
