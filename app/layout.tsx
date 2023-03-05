'use client'

import { Identity } from '@semaphore-protocol/identity'
import { useState, useEffect } from 'react'
import { ChakraProvider, Container, Stack, HStack, Text, Spinner } from '@chakra-ui/react'
import { WagmiConfig, createClient, useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { getDefaultProvider } from 'ethers'
import Navbar from './Navbar'
import theme from "../styles/index"
import LogsContext from "../context/LogsContext"
import ZK3Context from '../context/ZK3Context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const zk3Link = new HttpLink({
    uri: 'https://dev.zk3.io/',
  });

  const lensLink = new HttpLink({
    uri: 'https://api.lens.dev',
  });

  const apolloClient = new ApolloClient({

    link: ApolloLink.split(
      (operation) => operation.getContext().apolloClientName === "lens",
      lensLink,
      zk3Link
    ),

    cache: new InMemoryCache(),

  });

  const [_logs, setLogs] = useState<string>("")
  const [_identity, setIdentity] = useState<string>("")
  const [_lensAuthToken, setLensAuthToken] = useState<string>("")
  const [_githubAuthToken, setGithubAuthToken] = useState<string>("")
  const [_eventbriteAuthToken, setEventbriteAuthToken] = useState<string>("")

  useEffect(() => {
    const identityString = localStorage.getItem("identity")
    const lensAuthToken = localStorage.getItem("lensAuthToken")

    if (lensAuthToken) {
      setLensAuthToken(lensAuthToken)
      console.log('found lens token')
    }

    if (identityString) {
        const identity = new Identity(identityString)

        setIdentity(identity.getCommitment().toString())

        setLogs("Your Semaphore identity was retrieved from the browser cache 👌🏽")
    } else {
        setLogs("Create your Semaphore identity 👆🏽")
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

  return (
    <html>
      <head />
      <body>
        <ApolloProvider client={apolloClient}>
          <WagmiConfig client={client}>
            <ZK3Context.Provider
              value={{
                _identity,
                _lensAuthToken,
                _githubAuthToken,
                _eventbriteAuthToken,
                setIdentity,
                setLensAuthToken,
                setGithubAuthToken,
                setEventbriteAuthToken,
                getActiveGroups
              }}
              >
              <ChakraProvider theme={theme}>
                <LogsContext.Provider
                  value={{
                    _logs,
                    setLogs
                  }}
                >
                  <Navbar></Navbar>
                  <Container maxW="lg" flex="1" display="flex" alignItems="center">
                    <Stack py="8" display="flex" width="100%">
                      {children}
                    </Stack>
                  </Container>
                  <HStack
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
                  </HStack>

                </LogsContext.Provider>
              </ChakraProvider>
            </ZK3Context.Provider>
          </WagmiConfig>
        </ApolloProvider>
      </body>
    </html>
  )
}
