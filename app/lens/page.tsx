'use client'

import { Divider, Flex, Text, Spacer, Button } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAccount, useSignMessage } from 'wagmi'
import IdBar from "../IdBar"
import LensActionList from "./LensActionList"
import LogsContext from "../../context/LogsContext"
import ZK3Context from "../../context/ZK3Context"

function LensGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const { _identity } = useContext(ZK3Context)
    const { address, isConnected } = useAccount()

    return (
        <>
            <Text align='center' as="b" fontSize="5xl">
                Lens Group
            </Text>
            <IdBar ensName="zk3.eth"></IdBar>

            <Text align='center' pt="2" fontSize="md">
            Please select an action to perform in the Lens Group
            </Text>
            <Spacer />
            {_identity && <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> Available Actions:</Text>}
            <Divider pt="5" borderColor="gray.500" />
            <Flex flexDirection='column' p="6" alignItems='center'>
                <Spacer />

                {(isConnected && _identity) ? (
                    <LensActionList />
                ) : (
                    <Text>Loading...</Text>
                )}
            </Flex>
            <Link href='/' style={{marginTop: '2px'}}>
                <Button variant='solid' colorScheme='blue'>
                Back
                </Button>
            </Link>
            <Divider pt="5" borderColor="gray.500" />
        </>
    )
}

export default LensGroupPage