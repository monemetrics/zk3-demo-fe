'use client'

import { Divider, Flex, Text, Spacer, Button } from "@chakra-ui/react"
import { Identity } from '@semaphore-protocol/identity'
import { useState, useRef, useCallback, useEffect, useContext } from 'react'
import Link from "next/link"
import { useAccount, useSignMessage } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'
import IdBar from "../IdBar"
import GroupList from "../GroupList"
import LogsContext from "../../context/LogsContext"
import NewGroupList from "./NewGroupList"

function NewGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const [_identity, setIdentity] = useState<Identity>()
    const { address, isConnected } = useAccount()
    const recoveredAddress = useRef<string>()

    const createIdentity = useCallback(async (signature: any) => {
        console.log(signature)
        const identity = new Identity(signature)

        setIdentity(identity)

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

    useEffect(() => {
        const identityString = localStorage.getItem("identity")

        if (identityString) {
            const identity = new Identity(identityString)

            setIdentity(identity)

            setLogs("Your Semaphore identity was retrieved from the browser cache 👌🏽")
        } else {
            setLogs("Create your Semaphore identity 👆🏽")
        }
    }, [])

    const signIdentityMessage = async () => {
        await signMessageAsync()
    }

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
            <Link href='/' style={{marginTop: '2px'}}>Back</Link>
            <Divider pt="5" borderColor="gray.500" />
        </>
    )
}

export default NewGroupPage