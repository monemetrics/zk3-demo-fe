'use client'

import { useState } from 'react'
import { ChakraProvider, Container, Stack, HStack, Text, Spinner } from '@chakra-ui/react'
import { WagmiConfig, createClient, useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import { getDefaultProvider } from 'ethers'
import Navbar from './Navbar'
import theme from "../styles/index"
import LogsContext from "../context/LogsContext"

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
  //const [_identity, setIdentity] = useState<Identity>()


  const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
  })

  const { address, isConnected } = useAccount()

  return (
    <html>
      <head />
      <body>
        <ApolloProvider client={apolloClient}>
          <WagmiConfig client={client}>
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
          </WagmiConfig>
        </ApolloProvider>
      </body>
    </html>
  )
}
