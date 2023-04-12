'use client'

import { Divider, Flex, Text, Spacer, Button, Menu, IconButton, MenuButton, MenuItem, MenuList, useToast, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Box, Heading } from "@chakra-ui/react"
import { useContext, useState, useEffect } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react";
import { Identity } from "@semaphore-protocol/identity";
import IdBar from "../IdBar"
import EthActionList from './EthActionList'
import MyProofList from "./MyProofList";
import ZK3Context from "../../context/ZK3Context"
import { useQuery, gql } from '@apollo/client';
import { InfoIcon, SettingsIcon } from "@chakra-ui/icons";
import useSignPendingProofs from "../../lib/useSignPendingProofs"

interface circle {
    id: string,
    members: string[],
    name: string,
    description: string,
    contentURI: string
}

function EthereumGroupPage() {
    const { _identity, setMyCircleList, _myCircleList, setIdentity, setIdentityLinkedEOA } = useContext(ZK3Context)
    const address = useAddress();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const { signPendingProofs } = useSignPendingProofs()
    const [pendingProofs, setPendingProofs] = useState([])

    useEffect(() => {
        const handleStorage = () => {

            const pendingProofsString = localStorage.getItem("pendingProofs")

            if (pendingProofsString) {
                var pendingProofs = JSON.parse(pendingProofsString)
                console.log("pendingProofs: ", pendingProofs)
                setPendingProofs(pendingProofs)
            }

        }
        handleStorage()
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const handleDisconnectIdentity = () => {
        localStorage.removeItem("identity")
        localStorage.removeItem("myCircleList")
        localStorage.removeItem("identityLinkedEOA")
        setIdentityLinkedEOA(null)
        setIdentity(null)
        setMyCircleList([])
        toast({
            title: 'Identity Disconnected!',
            description: 'Your Semaphore identity was just disconnected',
            status: 'info',
            duration: 5000,
            isClosable: true,
        })
    }

    return (
        <>
            <Flex justifyContent='space-between' alignItems='center'>
                <Link href='/'>
                    <Button size={{ 'base': 'sm', 'sm': 'md' }} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>
                        Back
                    </Button>
                </Link>
                <Menu>
                    <MenuButton
                        variant='ghost'
                        as={IconButton}
                        aria-label='settings'
                        icon={<SettingsIcon />} />
                    <MenuList>
                        <Link href="/">
                            <MenuItem onClick={handleDisconnectIdentity}>Disconnect Identity</MenuItem>
                        </Link>
                    </MenuList>
                </Menu>
            </Flex>

            <Flex justifyContent='center'>
                <Text align='center' as="b" fontSize="5xl">
                    EVM Group
                </Text>
                <IconButton onClick={onOpen} variant='ghost' aria-label="info" icon={<InfoIcon color='#002add' />}></IconButton>
            </Flex>

            <IdBar />

            <Text align='center' pt="2" fontSize="md">
                Please select an action to perform in the EVM Group
            </Text>
            <Spacer />
            <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> Available Actions:</Text>
            <Flex flexDirection='column' p="6" alignItems='center' borderColor='#1e2d52' borderWidth='1px' borderRadius='12px'>
                <Spacer />

                {(address && _identity) ? (
                    <EthActionList />
                ) : (
                    <Text>Loading...</Text>
                )}
            </Flex>

            {pendingProofs.length !== 0 &&
                <Box borderColor='#1e2d52' borderWidth='1px' borderRadius='12px' mt={2} p={2} display='flex' alignItems='center' justifyContent='space-between'>
                    <Heading size='md'>Pending Proofs!</Heading>
                    <Button onClick={() => signPendingProofs(pendingProofs)} size={{ 'base': 'sm', 'sm': 'md' }} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'> Sign Pending Proofs </Button>
                </Box>}

            <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> My proofs:</Text>
            <Flex flexDirection='column' p="6" alignItems='center' borderColor='#1e2d52' borderWidth='1px' borderRadius='12px'>
                <Spacer />

                {_myCircleList ? (
                    <MyProofList />
                ) : (
                    <Text>Loading...</Text>
                )}
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Information about the EVM Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            The actions in the EVM Group allow you to generate zk proofs in order to add your Identity to an on-chain ZK3 Group. Your available proofs display which ZK3 Groups you are a part of.
                        </Text>
                        <br />
                        <Text>
                            You can generate and sign proofs with a wallet different than your Identity linked wallet. The generated proof will be attributed to your Identity. This allows ZK3 to maintain the privacy of its users.
                        </Text>
                        <br />
                        <Text>
                            Simply switch the currently connected wallet from your MetaMask browser extension to the wallet you want to use to generate the proof (this wallet must actually fulfill the requirements of the proof, i.e. have the balance you are trying to prove).
                        </Text>
                        <br />
                        <Text>
                            Reminder: Disconnecting your Identity will wipe your local storage and you will need to regenerate your Identity. Make sure you have switched back to your original Indentity linked EOA before signing (otherwise you are simply creating a new Identity and potentially compromising some of the privacy features of ZK3)
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EthereumGroupPage