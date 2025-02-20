'use client'

import { Divider, Flex, Text, Spacer, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react"
import IdBar from "../IdBar"
import LogsContext from "../../context/LogsContext"
import NewGroupList from "./NewGroupList"
import ZK3Context from "../../context/ZK3Context"
import { SettingsIcon } from "@chakra-ui/icons"

function NewGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const { _identity, setIdentity, setMyCircleList, setIdentityLinkedEOA } = useContext(ZK3Context)
    const address = useAddress()
    const toast = useToast()

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
            <Text align='center' as="b" fontSize="5xl">
                New Group
            </Text>
            <IdBar />

            <Text align='center' pt="2" fontSize="md">
                Semaphore groups are binary incremental Merkle trees in which each leaf represents an Identity commitment for a user. Groups can be abstracted to represent events, polls, or organizations.

                In our case, we will be using Groups to represent connections with web2.0 Auth providers.
            </Text>
            <Spacer />
            {_identity && <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> My groups:</Text>}
            <Flex flexDirection='column' p="6" alignItems='center' borderColor='#1e2d52' borderWidth='1px' borderRadius='12px'>
                <Spacer />

                {(address && _identity) ? (
                    <NewGroupList />
                ) : (
                    <Text>Loading...</Text>
                )}
            </Flex>
        </>
    )
}

export default NewGroupPage