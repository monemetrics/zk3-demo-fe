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
    _identityLinkedEOA: string | null,
    _lensAuthToken: string | null,
    _githubAuthToken: string | null,
    _eventbriteAuthToken: string | null,
    _myCircleList: circle[],
    setMyCircleList: (myCircleList: circle[]) => void,
    setIdentity: (identity: Identity | null) => void,
    setIdentityLinkedEOA: (identityLinkedEOA: string | null) => void,
    setLensAuthToken: (token: string | null) => void,
    setGithubAuthToken: (token: string | null) => void,
    setEventbriteAuthToken: (token: string | null) => void,
    getActiveGroups: () => string[],
}

export default React.createContext<ZK3ContextType>({
    _identity: null,
    _identityLinkedEOA: null,
    _lensAuthToken: null,
    _githubAuthToken: null,
    _eventbriteAuthToken: null,
    _myCircleList: [],
    setMyCircleList: (myCircleList: circle[]) => myCircleList,
    setIdentity: (identity: Identity | null) => identity,
    setIdentityLinkedEOA: (identityLinkedEOA: string | null) => identityLinkedEOA,
    setLensAuthToken: (token: string | null) => token,
    setGithubAuthToken: (token: string | null) => token,
    setEventbriteAuthToken: (token: string | null) => token,
    getActiveGroups: () => []
})
