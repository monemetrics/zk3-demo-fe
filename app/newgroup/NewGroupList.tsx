import React from 'react'
import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Flex, Card, CardHeader, CardBody, Text, Button, Box, Center } from "@chakra-ui/react"
import PrimaryCard from '../PrimaryCard';
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
import plusIcon from '../../public/plus.png'

function NewGroupList() {

    const data = [
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
    ]
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [activeModalName, setActiveModalName] = useState('')

    const handleAddNewGroup = (name: string) => {
        setActiveModalName(name)
        onOpen()
    }

    return (
        <>
            <Flex flexDirection='column' width='md' gap='2'>
                {data.map((entry: { name: string, description: string }) => {
                    return (
                        <div onClick={() => {
                            handleAddNewGroup(entry.name)
                        }}>
                            <PrimaryCard name={entry.name} text={entry.description} />
                        </div>)

                })}
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Connect your ZK3 ID</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Please login to {activeModalName} in order to join the group:</Text>
                        <br />
                        <Box position='relative' p='4' borderWidth='1px' borderRadius='lg' maxW='sm' alignSelf='center' py='4' boxShadow='md' maxH='80px' _hover={{
                            background: "white",
                            color: "blue.500",
                            cursor: "pointer"
                        }}>
                            <Flex flexDirection='row' gap='6'>
                                <Center width='40px' height='40px'>
                                    <Image alt='logo' src={activeModalName == 'Github' ? githubLogo : activeModalName == 'Lens' ? lensLogo : activeModalName == 'Twitter' ? twitterLogo : activeModalName == 'Discord' ? discordLogo : activeModalName == 'Telegram' ? telegramLogo : activeModalName == 'Ethereum' ? ethereumLogo : plusIcon} height={40} width={40} style={{ objectFit: 'contain', }}></Image>
                                </Center>

                                <Text height='40px' align='left' fontWeight='bold' fontSize='24' >
                                    continue with {activeModalName}
                                </Text>
                            </Flex>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default NewGroupList