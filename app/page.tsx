'use client'

import { Divider, Flex, Text, Spacer, Button, useToast, IconButton, Menu, MenuButton, MenuList, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { SettingsIcon, InfoIcon } from "@chakra-ui/icons"
import { Identity } from '@semaphore-protocol/identity'
import { useState, useRef, useCallback, useEffect, useContext } from 'react'
import { useAddress, useSDK } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import IdBar from "./IdBar"
import GroupList from "./GroupList"
import LogsContext from "../context/LogsContext"
import ZK3Context from "../context/ZK3Context"
import { useQuery, gql } from '@apollo/client';
import Link from "next/link";

function IdentityPage() {
    const toast = useToast()
    const { setLogs } = useContext(LogsContext)
    const { _lensAuthToken, _identity, setIdentity, setMyCircleList, _identityLinkedEOA, setIdentityLinkedEOA } = useContext(ZK3Context)
    const address = useAddress();
    const sdk = useSDK()
    const [_signature, setSignature] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const GET_CIRCLES = gql`
        query GetCircles {
            circles {
                name
                id
                description
            }
        }
    `;

    const { loading, error, data: _circleData } = useQuery(GET_CIRCLES)
    const [circleData, setCircleData] = useState()

    const createIdentity = useCallback(async (signature: any, addy: string) => {
        console.log(signature)
        const identity = new Identity(signature)

        setIdentity(identity)
        localStorage.setItem("identity", identity.toString())

        setIdentityLinkedEOA(addy)
        localStorage.setItem("identityLinkedEOA", addy)
        console.log('identityLinkedEOA', addy)

        toast({
            title: 'Identity Created!',
            description: 'Your new Semaphore identity was just created 🎉',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }, [])

    const signIdentityMessage = async (addy: string) => {
        //console.log('attempt sign')
        const signature = await sdk?.wallet.sign('gm zk3 frens')
        if (!signature)
            throw new Error('No signature!')
        setSignature(signature)
        createIdentity(signature, addy)
    }

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
            <Flex justifyContent='end'>
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
                    Identity
                </Text>
                <IconButton onClick={onOpen} variant='ghost' aria-label="info" icon={<InfoIcon color='#002add' />}></IconButton>
            </Flex>

            <IdBar />

            <Text align='center' pt="2" fontSize="md">
                {_identity && address ? 'Identity successfully connected!' : (address) ? 'In order to generate a new Identity you will need to sign a message' : 'Please connect your wallet'}
            </Text>
            <Spacer />
            {_identity && <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> My groups:</Text>}
            <Flex flexDirection='column' p="6" alignItems='center' borderColor='#1e2d52' borderWidth='1px' borderRadius='12px'>
                <Spacer />

                {(_identity && address) ? (
                    <GroupList></GroupList>
                ) : (address) ? (
                    <Button
                        fontWeight="bold"
                        justifyContent="center"
                        variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'
                        px="4"
                        onClick={() => {signIdentityMessage(address)}}>
                        {'Generate Identity'}
                    </Button>
                ) : (
                    <ConnectWallet />
                )}
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Information about ZK3 Identities</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>ZK3 Identities are deterministically generated from your EOA signature. This means that you can have one identity per wallet and they are linked. Your private identity data (trapdoor and nullifier used for signatures) is stored locally on your machine. Only the Identity Commitment (like a public key) is stored on-chain as leaves on a merkle tree.</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default IdentityPage