import React from "react"

export type ZK3ContextType = {
    _identity: string | null,
    _lensAuthToken: string | null,
    _githubAuthToken: string | null,
    _eventbriteAuthToken: string | null,
    setIdentity: (identity: string) => void,
    setLensAuthToken: (token: string) => void,
    setGithubAuthToken: (token: string) => void,
    setEventbriteAuthToken: (token: string) => void,
    getActiveGroups: () => string[],
}

export default React.createContext<ZK3ContextType>({
    _identity: null,
    _lensAuthToken: null,
    _githubAuthToken: null,
    _eventbriteAuthToken: null,
    setIdentity: (identity: string) => identity,
    setLensAuthToken: (token: string) => token,
    setGithubAuthToken: (token: string) => token,
    setEventbriteAuthToken: (token: string) => token,
    getActiveGroups: () => []
})
