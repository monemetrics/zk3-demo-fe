'use client'

import { Divider, Flex, Text, Spacer, Button } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAccount, useSignMessage } from 'wagmi'
import IdBar from "../IdBar"
import LogsContext from "../../context/LogsContext"
import NewGroupList from "./NewGroupList"
import ZK3Context from "../../context/ZK3Context"

function NewGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const { _identity } = useContext(ZK3Context)
    const { address, isConnected } = useAccount()

    return (
        <>
            <Text align='center' as="b" fontSize="5xl">
                New Group
            </Text>
            <IdBar ensName="zk3.eth"></IdBar>

            <Text align='center' pt="2" fontSize="md">
            Semaphore groups are binary incremental Merkle trees in which each leaf represents an Identity commitment for a user. Groups can be abstracted to represent events, polls, or organizations.

In our case, we will be using Groups to represent connections with web2.0 Auth providers.
            </Text>
            <Spacer />
            {_identity && <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> My groups:</Text>}
            <Divider pt="5" borderColor="gray.500" />
            <Flex flexDirection='column' p="6" alignItems='center'>
                <Spacer />

                {(isConnected && _identity) ? (
                    <NewGroupList />
                ) : (
                    <Text>Loading...</Text>
                )}
            </Flex>
            <Divider pt="5" borderColor="gray.500" />
            <Link href='/' style={{marginTop: '2px'}}>
                <Button variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>
                Back
                </Button>
            </Link>
        </>
    )
}

export default NewGroupPage