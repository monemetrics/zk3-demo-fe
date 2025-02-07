'use client'

import { Identity } from '@semaphore-protocol/identity'
import { useState, useEffect } from 'react'
import { ChakraProvider, Container, Stack, HStack, Text, Spinner, useToast, Alert, AlertTitle, Button } from '@chakra-ui/react'
import { WagmiConfig, createClient, useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, gql } from '@apollo/client';
import { getDefaultProvider } from 'ethers'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import Navbar from './Navbar'
import theme from "../styles/index"
import ZK3Context from '../context/ZK3Context';
import { ZK3_GRAPHQL_ENDPOINT } from "../const/contracts"

const MAINNET_API_URL = "https://api.lens.dev/"
const MUMBAI_API_URL = "https://api-mumbai.lens.dev/"
const SANDBOX_API_URL = "https://api-sandbox-mumbai.lens.dev/"

const url_in_use = SANDBOX_API_URL

interface circle {
    id: string
    members: string[]
    name: string
    description: string
    contentURI: string
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const zk3Link = new HttpLink({
        uri: ZK3_GRAPHQL_ENDPOINT
    })

    // const httpLink = new HttpLink({uri: APIURL});
    const authLink = new ApolloLink((operation, forward) => {
        // const token =  localStorage.getItem('auth_token')
        // add the authorization to the headers
        operation.setContext(({ headers = {} }) => ({
            headers: {
                "x-access-token": `Bearer ${_lensAuthToken}`
            }
        }))

        return forward(operation)
    })

    // const config = {
    //   link: authLink.concat(httpLink),
    //   cache: new InMemoryCache(),
    // }
    // export let apolloClient= new ApolloClient(config)
    const zk3LinkAuth = authLink.concat(zk3Link)

    const lensLink = new HttpLink({
        uri: url_in_use
    })

    const lensLinkAuth = authLink.concat(lensLink)

    const apolloClient = new ApolloClient({
        link: ApolloLink.split(
            (operation) => operation.getContext().apolloClientName === "lens",
            lensLinkAuth,
            zk3LinkAuth
        ),
        cache: new InMemoryCache()
    })

    const toast = useToast()
    const [_identity, setIdentity] = useState<Identity | null>(null)
    const [_identityLinkedEOA, setIdentityLinkedEOA] = useState<string | null>(null)
    const [_lensAuthToken, setLensAuthToken] = useState<string | null>("")
    const [_githubAuthToken, setGithubAuthToken] = useState<string | null>("")
    const [_eventbriteAuthToken, setEventbriteAuthToken] = useState<string | null>("")
    const [_myCircleList, setMyCircleList] = useState<circle[]>([])


    useEffect(() => {
        const identityString = localStorage.getItem("identity")
        const lensAuthToken = localStorage.getItem("LH_STORAGE_KEY")
        const identityLinkedEOA = localStorage.getItem("identityLinkedEOA")

        const graphqlQuery = {
            operationName: "Query",
            query: `query Query($service: String!) {
        isConnected(service: $service)
      }`,
            variables: { service: "github" }
        }

        const getCirclesQuery = {
            operationName: "GetCircles",
            query: `
            query GetCircles {
                circles {
                    name
                    id
                    description
                    members
                    contentURI
                }
            }
        `};

        const fetchHasGithubGroup = async () => {
            const response = await fetch(ZK3_GRAPHQL_ENDPOINT, {
                method: "POST",
                headers: {
                    "x-access-token": `Bearer ${JSON.parse(lensAuthToken!).accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(graphqlQuery)
            })
            const data: { data: { isConnected: boolean } } = await response.json()
            console.log("isConnected: ", data)
            if (data.data.isConnected) {
                setGithubAuthToken(data.data.isConnected.toString())
                console.log("found github token")
            }
        }

        if (identityLinkedEOA) {
            setIdentityLinkedEOA(identityLinkedEOA)
            console.log("found identityLinkedEOA")
        }

        if (lensAuthToken) {
            setLensAuthToken(JSON.parse(lensAuthToken).accessToken)
            console.log("found lens token")
            fetchHasGithubGroup()
        }

        if (identityString) {
            console.log("identityString: ", identityString)
            const identity = new Identity(identityString) /////////////////////////////////////////
            const commitment = identity.getCommitment()
            console.log("commitment: ", commitment)
            setIdentity(identity)

            toast({
                title: "Identity Retrieved!",
                description: "Your Semaphore identity was retrieved from the browser cache 👌🏽",
                status: "success",
                duration: 5000,
                isClosable: true
            })

            const fetchCircles = async () => {
                const response = await fetch(ZK3_GRAPHQL_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(getCirclesQuery)
                })
                const data: { data: { circles: circle[] } } = await response.json()
                console.log("circles: ", data)
                if (data.data.circles) {
                    const identity = new Identity(identityString) /////////////////////////////////////////
                    const commitment = identity.getCommitment()
                    var circleList = data.data.circles
                    var myCircleList: circle[] = []
                    circleList.forEach((element: any) => {
                        if (element.members.includes(commitment.toString())) {
                            myCircleList.push(element)
                        }
                    });
                    setMyCircleList(myCircleList)
                    localStorage.setItem("myCircleList", JSON.stringify(myCircleList))
                }
            }

            fetchCircles()

        } else {
            toast({
                title: "Identity Not Found!",
                description: "Please create your Semaphore identity 👆🏽",
                status: "warning",
                duration: 10000,
                isClosable: true
            })
        }
    }, [])

    const getActiveGroups = () => {
        var groups: string[] = []
        //if (_lensAuthToken) groups.push("Lens")
        if (_githubAuthToken) groups.push("Github")
        if (_eventbriteAuthToken) groups.push("Eventbrite")
        return groups
    }

    const client = createClient({
        autoConnect: true,
        provider: getDefaultProvider()
    })
    // the chainId our app wants to be running on
    // for our example the Polygon Mumbai Testnet
    const desiredChainId = ChainId.Mumbai

    // Create a client
    const queryClient = new QueryClient()

    return (
        <html>
            <head />
            <body>
                <ApolloProvider client={apolloClient}>
                    {/*<WagmiConfig client={client}>*/}
                    <ThirdwebProvider activeChain={desiredChainId}>
                        <QueryClientProvider client={queryClient}>
                            <ZK3Context.Provider
                                value={{
                                    _identity,
                                    _identityLinkedEOA,
                                    _lensAuthToken,
                                    _githubAuthToken,
                                    _eventbriteAuthToken,
                                    _myCircleList,
                                    setMyCircleList,
                                    setIdentity,
                                    setIdentityLinkedEOA,
                                    setLensAuthToken,
                                    setGithubAuthToken,
                                    setEventbriteAuthToken,
                                    getActiveGroups
                                }}
                            >
                                <ChakraProvider theme={theme}>
                                    <Navbar></Navbar>
                                    <Container maxW="lg" flex="1" display="flex" alignItems="center">
                                        <Stack py="8" display="flex" width="100%">
                                            {children}
                                        </Stack>
                                    </Container>
                                    {/*<HStack
                      style={{ position: 'fixed', bottom: '0px', left: '0px', right: '0px' }}
                      flexBasis="56px"
                      borderTop="1px solid #8f9097"
                      backgroundColor="#DAE0FF"
                      align="center"
                      justify="center"
                      spacing="4"
                      p="4"
                    >
                      {_logs.endsWith("...") && <Spinner color="primary.400" />}
                      <Text fontWeight="bold">{_logs}</Text>
                    </HStack>*/}
                                </ChakraProvider>
                            </ZK3Context.Provider>
                        </QueryClientProvider>
                    </ThirdwebProvider>
                    {/*</WagmiConfig>*/}
                </ApolloProvider>
            </body>
        </html>
    )
}
