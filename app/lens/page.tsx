'use client'

import { Divider, Flex, Text, Spacer, Button } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react";
import IdBar from "../IdBar"
import LensActionList from "./LensActionList"
import LogsContext from "../../context/LogsContext"
import ZK3Context from "../../context/ZK3Context"

function LensGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const { _identity } = useContext(ZK3Context)
    const address = useAddress();

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
            <Flex flexDirection='column' p="6" alignItems='center' borderColor='#1e2d52' borderWidth='1px' borderRadius='12px'>
                <Spacer />

                {(address && _identity) ? (
                    <LensActionList />
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

export default LensGroupPage