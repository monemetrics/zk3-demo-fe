'use client'

import { Divider, Flex, Text, Spacer, Button } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react";
import IdBar from "../IdBar"
import EthActionList from './EthActionList'
import ZK3Context from "../../context/ZK3Context"

function EthereumGroupPage() {
    const { _identity } = useContext(ZK3Context)
    const address = useAddress();

    return (
        <>
            <Text align='center' as="b" fontSize="5xl">
                EVM Group
            </Text>
            <IdBar ensName="zk3.eth"></IdBar>

            <Text align='center' pt="2" fontSize="md">
            Please select an action to perform in the EVM Group
            </Text>
            <Spacer />
            {_identity && <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> Available Actions:</Text>}
            <Divider pt="5" borderColor="gray.500" />
            <Flex flexDirection='column' p="6" alignItems='center'>
                <Spacer />

                {(address && _identity) ? (
                    <EthActionList />
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

export default EthereumGroupPage