'use client'

import { Divider, Flex, Text, Spacer, Button, useToast, IconButton, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { SettingsIcon } from "@chakra-ui/icons"
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
    const { _lensAuthToken, _identity, setIdentity, setMyCircleList } = useContext(ZK3Context)
    const address = useAddress();
    const sdk = useSDK()
    const [_signature, setSignature] = useState('')

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

    const fetchGroups = async () => {
        const identityString = localStorage.getItem("identity")
        if (!identityString)
            return
        const commitment = new Identity(identityString).getCommitment()
        setCircleData(_circleData)
        console.log('circleData: ', circleData)

    }

    const createIdentity = useCallback(async (signature: any) => {
        console.log(signature)
        const identity = new Identity(signature)

        setIdentity(identity)

        localStorage.setItem("identity", identity.toString())


        //setLogs("Your new Semaphore identity was just created 🎉")
        toast({
            title: 'Identity Created!',
            description: 'Your new Semaphore identity was just created 🎉',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }, [])

    const signIdentityMessage = async () => {
        //console.log('attempt sign')
        const signature = await sdk?.wallet.sign('gm zk3 frens')
        if (!signature)
            throw new Error('No signature!')
        setSignature(signature)
        createIdentity(signature)
    }

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
                Identity
            </Text>
            {/*<IdBar ensName="zk3.eth"></IdBar>*/}

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
                        onClick={signIdentityMessage}>
                        {'Generate Identity'}
                    </Button>
                ) : (
                    <ConnectWallet />
                )}
            </Flex>
        </>
    )
}

export default IdentityPage