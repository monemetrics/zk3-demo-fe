'use client'

import { Divider, Flex, Text, Spacer, Button } from "@chakra-ui/react"
import { Identity } from '@semaphore-protocol/identity'
import { useState, useRef, useCallback, useEffect, useContext } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'
import IdBar from "./IdBar"
import GroupList from "./GroupList"
import LogsContext from "../context/LogsContext"
import ZK3Context from "../context/ZK3Context"

function IdentityPage() {
    const { setLogs } = useContext(LogsContext)
    const { _lensAuthToken, _identity, setIdentity } = useContext(ZK3Context)
    const { address, isConnected } = useAccount()
    const recoveredAddress = useRef<string>()

    const createIdentity = useCallback(async (signature: any) => {
        console.log(signature)
        const identity = new Identity(signature)

        setIdentity(identity.getCommitment().toString())

        localStorage.setItem("identity", identity.getCommitment().toString())


        setLogs("Your new Semaphore identity was just created 🎉")
    }, [])

    const { signMessageAsync } = useSignMessage({
        message: 'gm zk3 frens', // <- changing the signing message destroys the link between all users and their existing identities
        onSuccess(data, variables) {
            // Verify signature when sign message succeeds
            recoveredAddress.current = verifyMessage(variables.message, data)
            createIdentity(data)
        },
    })

    const signIdentityMessage = async () => {
        await signMessageAsync()
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
                        onClick={isConnected ? signIdentityMessage : () => { }}>
                        {isConnected ? 'Generate Identity' : 'Please Connect your wallet'}
                    </Button>
                )}
            </Flex>
            <Divider pt="5" borderColor="gray.500" />
        </>
    )
}

export default IdentityPage