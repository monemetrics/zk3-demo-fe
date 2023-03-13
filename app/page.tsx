'use client'

import { Divider, Flex, Text, Spacer, Button, useToast } from "@chakra-ui/react"
import { Identity } from '@semaphore-protocol/identity'
import { useState, useRef, useCallback, useEffect, useContext } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'
import { useAddress, useSDK } from "@thirdweb-dev/react";
import IdBar from "./IdBar"
import GroupList from "./GroupList"
import LogsContext from "../context/LogsContext"
import ZK3Context from "../context/ZK3Context"

function IdentityPage() {
    const toast = useToast()
    const { setLogs } = useContext(LogsContext)
    const { _lensAuthToken, _identity, setIdentity } = useContext(ZK3Context)
    const address = useAddress();
    const sdk = useSDK()
    const [ _signature, setSignature ] = useState('')

    const createIdentity = useCallback(async (signature: any) => {
        console.log(signature)
        const identity = new Identity(signature)

        setIdentity(identity)

        localStorage.setItem("identity", identity.toString())


        //setLogs("Your new Semaphore identity was just created 🎉")
        toast({
            title: 'Identity Created!',
            description: 'Your new Semaphore identity was just created 🎉',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }, [])

    const signIdentityMessage = async () => {
        //console.log('attempt sign')
        const signature = await sdk?.wallet.sign('gm zk3 frens')
        if (!signature)
            throw new Error('No signature!')
        setSignature(signature)
        createIdentity(signature)
    }

    return (
        <>
            <Text align='center' as="b" fontSize="5xl">
                Identity
            </Text>
            <IdBar ensName="zk3.eth"></IdBar>

            <Text align='center' pt="2" fontSize="md">
                {_identity ? 'Identity successfully connected!' : 'In order to generate a new Identity you will need to sign a message'}
            </Text>
            <Spacer />
            {_identity && <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> My groups:</Text>}
            <Divider pt="5" borderColor="gray.500" />
            <Flex flexDirection='column' p="6" alignItems='center'>
                <Spacer />

                {(_identity) ? (
                    <GroupList></GroupList>
                ) : (
                    <Button
                        fontWeight="bold"
                        justifyContent="center"
                        colorScheme="primary"
                        px="4"
                        onClick={address ? signIdentityMessage : () => { }}>
                        {address ? 'Generate Identity' : 'Please Connect your wallet'}
                    </Button>
                )}
            </Flex>
            <Divider pt="5" borderColor="gray.500" />
        </>
    )
}

export default IdentityPage