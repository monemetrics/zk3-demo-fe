'use client'

import { Identity } from '@semaphore-protocol/identity'
import { useState, useEffect } from 'react'
import { ChakraProvider, Container, Stack, HStack, Text, Spinner, useToast } from '@chakra-ui/react'
import { WagmiConfig, createClient, useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { getDefaultProvider } from 'ethers'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import Navbar from './Navbar'
import theme from "../styles/index"
import ZK3Context from '../context/ZK3Context';

const MAINNET_API_URL = "https://api.lens.dev/"
const MUMBAI_API_URL = "https://api-mumbai.lens.dev/"

const url_in_use = MUMBAI_API_URL

interface circle {
  id: string,
  members: string[],
  name: string,
  description: string,
  contentURI: string
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const zk3Link = new HttpLink({
    uri: 'https://dev.zk3.io/graphql',
  });

  const lensLink = new HttpLink({
    uri: url_in_use,
  });

  const apolloClient = new ApolloClient({

    link: ApolloLink.split(
      (operation) => operation.getContext().apolloClientName === "lens",
      lensLink,
      zk3Link
    ),

    cache: new InMemoryCache(),

  });

  const toast = useToast()
  const [_identity, setIdentity] = useState<Identity | null>(null)
  const [_lensAuthToken, setLensAuthToken] = useState<string>("")
  const [_githubAuthToken, setGithubAuthToken] = useState<string>("")
  const [_eventbriteAuthToken, setEventbriteAuthToken] = useState<string>("")
  const [_myCircleList, setMyCircleList] = useState<circle[]>([])

  

  useEffect(() => {
    const identityString = localStorage.getItem("identity")
    const lensAuthToken = localStorage.getItem("LH_STORAGE_KEY")

    if (lensAuthToken) {
      setLensAuthToken(JSON.parse(lensAuthToken).accessToken)
      console.log('found lens token')
    }

    if (identityString) {
      console.log('identityString: ', identityString)
      const identity = new Identity(identityString)/////////////////////////////////////////
      const commitment = identity.getCommitment()
      setIdentity(identity)

      toast({
        title: 'Identity Retrieved!',
        description: 'Your Semaphore identity was retrieved from the browser cache 👌🏽',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Identity Not Found!',
        description: 'Please create your Semaphore identity 👆🏽',
        status: 'warning',
        duration: 10000,
        isClosable: true,
      })
    }
  }, [])

  const getActiveGroups = () => {
    var groups: string[] = []
    if (_lensAuthToken) groups.push('Lens')
    if (_githubAuthToken) groups.push('Github')
    if (_eventbriteAuthToken) groups.push('Eventbrite')
    return groups
  }


  const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
  })
  // the chainId our app wants to be running on
  // for our example the Polygon Mumbai Testnet
  const desiredChainId = ChainId.Mumbai;

  // Create a client
  const queryClient = new QueryClient();

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
                    _lensAuthToken,
                    _githubAuthToken,
                    _eventbriteAuthToken,
                    _myCircleList,
                    setMyCircleList,
                    setIdentity,
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
