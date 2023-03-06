import React from 'react'
import { useState, useContext } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Flex, Card, CardHeader, CardBody, Text, Button, Box, Center } from "@chakra-ui/react"
import PrimaryCard from '../PrimaryCard';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAccount, useSignMessage } from 'wagmi'
import ZK3Context from '../../context/ZK3Context';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import Link from 'next/link';
import Image from 'next/image'
import twitterLogo from '../../public/twitter.png'
import lensLogo from '../../public/lens.jpg'
import discordLogo from '../../public/discord.png'
import telegramLogo from '../../public/telegram.png'
import ethereumLogo from '../../public/ethereum.png'
import githubLogo from '../../public/github.png'
import LogsContext from "../../context/LogsContext"
import plusIcon from '../../public/plus.png'
import LensSignInButton from './LensSignInButton';

const availableGroupData = [
    {
        name: 'Github',
        description: 'Connect with Github'
    },
    {
        name: 'Twitter',
        description: 'Connect with Twitter'
    },
    {
        name: 'Discord',
        description: 'Connect with Discord'
    },
    {
        name: 'Ethereum',
        description: 'Connect with EVM Wallet'
    },
    {
        name: 'Lens',
        description: 'Connect with Lens'
    },
]

function NewGroupList() {
    const { address } = useAccount()
    const { setLogs } = useContext(LogsContext)
    const { setLensAuthToken } = useContext(ZK3Context)

    const GET_LENS_CHALLENGE = gql`
        query Challenge {
            challenge(request: { address: "${address}" }) {
                text
            }
        }
    `;

    var AUTHENTICATE_LENS = gql`mutation($request: SignedAuthChallenge!) {
        authenticate(request: $request) {
            accessToken
            refreshToken
        }
    }`;

    const { data: challengeData } = useQuery(GET_LENS_CHALLENGE, {
        context: { apolloClientName: "lens" },
    });
    const [mutateFunction, { data: authData }] = useMutation(AUTHENTICATE_LENS, {
        context: { apolloClientName: "lens" },
    });

    const { signMessageAsync } = useSignMessage({
        message: challengeData?.challenge.text,
        onSuccess(data) {
            console.log(data)
            try {
                mutateFunction({ variables: { request: { address: address, signature: data } } })
                    .then((response) => {
                        setLensAuthToken(response.data.authenticate.accessToken)
                        localStorage.setItem("lensAuthToken", response.data.authenticate.accessToken)
                        setLogs('Successfully signed in with Lens!')
                    })
                onClose()
            }
            catch (error) {
                console.log(error)
            }
        },
    })

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [activeModalName, setActiveModalName] = useState('')

    const handleAddNewGroup = (name: string) => {
        setActiveModalName(name)
        onOpen()
    }

    const signChallengeMessage = async () => {
        if (activeModalName == 'Lens')
            await signMessageAsync()
    }

    return (
        <>
            <Flex flexDirection='column' width='md' gap='2'>
                {availableGroupData.map((entry: { name: string, description: string }) => {
                    return (
                        <div onClick={() => {
                            handleAddNewGroup(entry.name)
                        }}>
                            <PrimaryCard name={entry.name} logo={entry.name} text={entry.description} />
                        </div>)

                })}
            </Flex>
            <Text>{ }</Text>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Connect your ZK3 ID</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Please login to {activeModalName} in order to join the group:</Text>
                        <br />
                        {activeModalName === 'Lens' && <LensSignInButton />}
                        {activeModalName !== 'Lens' && <Box onClick={signChallengeMessage} position='relative' p='4' borderWidth='1px' borderRadius='lg' maxW='sm' alignSelf='center' py='4' boxShadow='md' maxH='80px' _hover={{
                            background: "white",
                            color: "blue.500",
                            cursor: "pointer"
                        }}>
                            <Button justifyContent="center">
                                <Center width='40px' height='40px' mr='40px'>
                                    <Image alt='logo' src={activeModalName == 'Github' ? githubLogo : activeModalName == 'Lens' ? lensLogo : activeModalName == 'Twitter' ? twitterLogo : activeModalName == 'Discord' ? discordLogo : activeModalName == 'Telegram' ? telegramLogo : activeModalName == 'Ethereum' ? ethereumLogo : plusIcon} height={40} width={40} style={{ objectFit: 'contain', }}></Image>
                                </Center>
                                Continue with {activeModalName}
                            </Button>
                        </Box>}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default NewGroupList