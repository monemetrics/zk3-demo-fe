'use client'

import { Divider, Flex, Text, Spacer, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast } from "@chakra-ui/react"
import { useContext } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react";
import IdBar from "../IdBar"
import LensActionList from "./LensActionList"
import LogsContext from "../../context/LogsContext"
import ZK3Context from "../../context/ZK3Context"
import { SettingsIcon } from "@chakra-ui/icons";

function LensGroupPage() {
    const { setLogs } = useContext(LogsContext)
    const { _identity, setIdentity, setMyCircleList } = useContext(ZK3Context)
    const address = useAddress();
    const toast = useToast()

    const handleDisconnectIdentity = () => {
        localStorage.removeItem("identity")
        localStorage.removeItem("myCircleList")
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
                Lens Group
            </Text>
            {/*<IdBar ensName="zk3.eth"></IdBar>*/}

            <Text align='center' pt="2" fontSize="md">
                Please select an action to perform in the Lens Group
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
            <Link href='/' style={{ marginTop: '2px' }}>
                <Button position='fixed' left='20' bottom='20' variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>
                    Back
                </Button>
            </Link>
        </>
    )
}

export default LensGroupPage