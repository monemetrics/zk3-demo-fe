import React from "react"
import { Identity } from '@semaphore-protocol/identity'

interface circle {
    id: string,
    members: string[],
    name: string,
    description: string,
    contentURI: string
}

export type ZK3ContextType = {
    _identity: Identity | null,
    _lensAuthToken: string | null,
    _githubAuthToken: string | null,
    _eventbriteAuthToken: string | null,
    _myCircleList: circle[],
    setMyCircleList: (myCircleList: circle[]) => void,
    setIdentity: (identity: Identity) => void,
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
    _myCircleList: [],
    setMyCircleList: (myCircleList: circle[]) => myCircleList,
    setIdentity: (identity: Identity) => identity,
    setLensAuthToken: (token: string) => token,
    setGithubAuthToken: (token: string) => token,
    setEventbriteAuthToken: (token: string) => token,
    getActiveGroups: () => []
})
