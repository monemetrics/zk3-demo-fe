import { Box, Button, Divider, Heading, HStack, Link, ListItem, OrderedList, Text } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState, useRef } from "react"
import { useSignMessage, useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { verifyMessage } from 'ethers/lib/utils'
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"


export default function IdentitiesPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const [_identity, setIdentity] = useState<Identity>()
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const recoveredAddress = useRef<string>()

    const createIdentity = useCallback(async (signature: any) => {
        console.log(signature)
        const identity = new Identity(signature)

        setIdentity(identity)

        localStorage.setItem("identity", identity.toString())

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
                Identity
            </Text>

            <Text align='center' pt="2" fontSize="md">
                In order to generate a new Identity you will need to sign a message
            </Text>
            <Divider pt="5" borderColor="gray.500" />

            <HStack pt="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Identity
                </Text>
            </HStack>

            {_identity ? (
                <Box py="6" whiteSpace="nowrap">
                    <Box p="5" borderWidth={1} borderColor="gray.500" borderRadius="4px">
                        <Text textOverflow="ellipsis" overflow="hidden">
                            Trapdoor: {_identity.trapdoor.toString()}
                        </Text>
                        <Text textOverflow="ellipsis" overflow="hidden">
                            Nullifier: {_identity.nullifier.toString()}
                        </Text>
                        <Text textOverflow="ellipsis" overflow="hidden">
                            Commitment: {_identity.commitment.toString()}
                        </Text>
                    </Box>
                </Box>
            ) : (
                <Box py="6">
                    {isConnected ? (
                        <Button
                            w="100%"
                            fontWeight="bold"
                            justifyContent="center"
                            colorScheme="primary"
                            px="4"
                            onClick={signIdentityMessage}
                        >
                            Create identity
                        </Button>
                    ) : (
                        <Button
                            w="100%"
                            fontWeight="bold"
                            justifyContent="center"
                            colorScheme="yellow"
                            px="4"
                            onClick={connect}
                        >
                            Connect Wallet
                        </Button>
                    )}

                </Box>
            )}

            <Divider pt="3" borderColor="gray" />

            <Stepper step={1} onNextClick={_identity && (() => router.push("/groups"))} />
        </>
    )
}
