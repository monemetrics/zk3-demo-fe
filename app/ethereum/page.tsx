'use client'

import { Divider, Flex, Text, Spacer, Button, Menu, IconButton, MenuButton, MenuItem, MenuList, useToast } from "@chakra-ui/react"
import { useContext, useState, useEffect } from 'react'
import Link from "next/link"
import { useAddress } from "@thirdweb-dev/react";
import { Identity } from "@semaphore-protocol/identity";
import IdBar from "../IdBar"
import EthActionList from './EthActionList'
import MyProofList from "./MyProofList";
import ZK3Context from "../../context/ZK3Context"
import { useQuery, gql } from '@apollo/client';
import { SettingsIcon } from "@chakra-ui/icons";

interface circle {
    id: string,
    members: string[],
    name: string,
    description: string,
    contentURI: string
}

function EthereumGroupPage() {
    const { _identity, setMyCircleList, _myCircleList, setIdentity } = useContext(ZK3Context)
    const address = useAddress();
    const toast = useToast()

    //console.log(address, _identity)
    const GET_CIRCLES = gql`
        query GetCircles {
            circles {
                name
                id
                description
                members
                contentURI
            }
        }
    `;

    const { loading, error, data: _circleData } = useQuery(GET_CIRCLES)

    const commitment = new Identity(_identity?.toString()).getCommitment()

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
                EVM Group
            </Text>
            {/*<IdBar ensName="zk3.eth"></IdBar>*/}

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
            <Text align='center' pt="2" fontSize="lg" fontWeight='bold'> My proofs:</Text>
            <Flex flexDirection='column' p="6" alignItems='center' borderColor='#1e2d52' borderWidth='1px' borderRadius='12px'>
                <Spacer />

                {_circleData ? (
                    <MyProofList data={_circleData} />
                ) : (
                    <Text>Loading...</Text>
                )}
            </Flex>
            <Link href='/'>
                <Button position='fixed' left='20' bottom='20' variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>
                    Back
                </Button>
            </Link>
        </>
    )
}

export default EthereumGroupPage