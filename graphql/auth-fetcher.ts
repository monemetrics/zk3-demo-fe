import { isTokenExpired, readAccessToken } from "../lib/auth/helpers";
import refreshAccessToken from "../lib/auth/refreshAccessToken";

const MAINNET_API_URL = "https://api.lens.dev/";
const MUMBAI_API_URL = "https://api-mumbai.lens.dev/";
const SANDBOX_API_URL = "https://api-sandbox-mumbai.lens.dev"

const url_in_use = SANDBOX_API_URL;


export const fetcher = <TData, TVariables>(
  query: string,
  variables?: TVariables,
  options?: RequestInit["headers"]
): (() => Promise<TData>) => {
  async function getAccessToken() {
      // 1. Check the local storage for the access token
      const token = readAccessToken()
      console.log("token", token)
      // 2. If there isn't a token, then return null (not signed in)
      if (!token) return null

      let accessToken = token.accessToken

      // 3. If there is a token, then check it's expiration
      if (isTokenExpired(token.exp)) {
          // 4. If it's expired, update it using the refresh token
          const newToken = await refreshAccessToken()
          if (!newToken) return null
          accessToken = newToken
      }

      // Finally, return the token
      return accessToken
  }

  return async () => {
      const token = typeof window !== "undefined" ? await getAccessToken() : null
      console.log("token::", token, url_in_use)
      const res = await fetch(url_in_use, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              ...options,
              "x-access-token": token ? `Bearer ${token}` : '',
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
};