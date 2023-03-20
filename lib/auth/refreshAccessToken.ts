import { RefreshMutation, RefreshMutationVariables, RefreshDocument } from "../../graphql/generated"
import { readAccessToken, setAccessToken } from "./helpers"

const MAINNET_API_URL = "https://api.lens.dev/"
const MUMBAI_API_URL = "https://api-mumbai.lens.dev/"
const SANDBOX_API_URL = "https://api-sandbox-mumbai.lens.dev"

const url_in_use = SANDBOX_API_URL

export default async function refreshAccessToken() {
    // 1. Get our current refresh token from local storage
    const currentRefreshToken = readAccessToken()?.refreshToken

    if (!currentRefreshToken) return null

    async function fetchData<TData, TVariables>(
        query: string,
        variables?: TVariables,
        options?: RequestInit["headers"]
    ): Promise<TData> {
        const res = await fetch(url_in_use, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...options,
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                query,
                variables
            })
        })

        const json = await res.json()

        if (json.errors) {
            const { message } = json.errors[0] || {}
            throw new Error(message || "Error…")
        }

        return json.data
    }

    // 3. set the new access token in local storage
    const result = await fetchData<RefreshMutation, RefreshMutationVariables>(RefreshDocument, {
        request: {
            refreshToken: currentRefreshToken
        }
    })

    const {
        refresh: { accessToken, refreshToken: newRefreshToken }
    } = result

    setAccessToken(accessToken, newRefreshToken)

    return accessToken as string
}
