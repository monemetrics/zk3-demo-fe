import { Flex, Box, Spacer, Heading, Text, HStack } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import WalletButton from "./WalletButton"
import Image from 'next/image'
import zk3Logo from '../public/zk3.png'
import LensSignInButton from "./newgroup/LensSignInButton"
import useLensUser from "../lib/auth/useLensUser";

export default function Navbar() {
    return (
        <>
            <Flex minWidth='max-content' alignItems='center' gap='2' bgColor='#002add' p='1'>
                <Box p='0'>
                    <HStack bgColor='#fff' borderRadius='8' p='1' width={140} ml='2'>
                        <Image alt='zk3 Logo' src={zk3Logo} height={60} width={60} style={{ objectFit: 'contain', marginRight: '0px' }}></Image>
                        <Heading size='lg' textAlign='left'>ZK3</Heading>
                    </HStack>
                </Box>
                <Spacer />
                <Box p='0' sx={{ position: 'absolute', width: '180px', marginLeft: 'auto', marginRight: 'auto', left: 0, right: 0 }}>
                    <Heading size='lg' color={"whiteAlpha.900"} >ZK3 demo</Heading>
                </Box>
                <Spacer />
                <Box p='0'>
                    <LensSignInButton></LensSignInButton>
                </Box>
            </Flex>
        </>
    )
}