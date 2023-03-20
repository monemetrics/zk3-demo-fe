'use client'

import { Divider, Flex, Text, Spacer, Button } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react"
import IdBar from "../IdBar"
import LogsContext from "../../context/LogsContext"
import NewGroupList from "./NewGroupList"
import ZK3Context from "../../context/ZK3Context"

function NewGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const { _identity } = useContext(ZK3Context)
    const address = useAddress()

    return (
        <>
            <Text align='center' as="b" fontSize="5xl">
                New Group
            </Text>
            {/*<IdBar ensName="zk3.eth"></IdBar>*/}

            <Text align='center' pt="2" fontSize="md">
                Semaphore groups are binary incremental Merkle trees in which each leaf represents an Identity commitment for a user. Groups can be abstracted to represent events, polls, or organizations.

                In our case, we will be using Groups to represent connections with web2.0 Auth providers.
            </Text>
            <Spacer />
            {_identity && <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> My groups:</Text>}
            <Flex flexDirection='column' p="6" alignItems='center' borderColor='#1e2d52' borderWidth='1px' borderRadius='12px'>
                <Spacer />

                {(address && _identity) ? (
                    <NewGroupList />
                ) : (
                    <Text>Loading...</Text>
                )}
            </Flex>
            <Link href='/' style={{ marginTop: '2px' }}>
                <Button position='fixed' left='20' bottom='20' variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>
                    Back
                </Button>
            </Link>
        </>
    )
}

export default NewGroupPage