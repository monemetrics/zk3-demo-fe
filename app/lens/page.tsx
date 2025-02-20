'use client'

import { Divider, Flex, Text, Spacer, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react";
import IdBar from "../IdBar"
import LensActionList from "./LensActionList"
import LogsContext from "../../context/LogsContext"
import ZK3Context from "../../context/ZK3Context"
import { InfoIcon, SettingsIcon } from "@chakra-ui/icons";
import useSetDispatcher from "../../lib/useSetDispatcher";

function LensGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const { _identity, setIdentity, setMyCircleList, setIdentityLinkedEOA } = useContext(ZK3Context)
    const address = useAddress();
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { setDispatcher } = useSetDispatcher()

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
            <Flex justifyContent='end' alignItems='center'>
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
                        <MenuItem onClick={setDispatcher}>Set ZK3 Dispatcher</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            <Flex justifyContent='center'>
                <Text align='center' as="b" fontSize="5xl">
                    Lens Playground
                </Text>
                <IconButton onClick={onOpen} variant='ghost' aria-label="info" icon={<InfoIcon color='#002add' />}></IconButton>
            </Flex>

            <IdBar />

            <Text align='center' pt="2" fontSize="md">
                Please select an action to perform in the Lens Playground
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

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Information about the Lens Playground</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            The Lens Playground allows you to publish Lens Posts or Comments with an attached ZK3 Proof. Your Lens Publication will be attributed to the profile displayed in the top right corner of the dApp. (Can be a Lens Profile held by a different wallet than the one you used to generate your Indentity)
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default LensGroupPage