import { Flex, Box, Spacer, Heading } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import WalletButton from "./WalletButton"
import Image from 'next/image'
import zk3Logo from '../public/zk3.png'
import LensSignInButton from "./newgroup/LensSignInButton"
import useLensUser from "../lib/auth/useLensUser";

export default function Navbar() {
    return (
        <>
            <Flex minWidth='max-content' alignItems='center' gap='2' bgColor='#0068e6'>
                <Box p='2'>
                    <Image alt='zk3 Logo' src={zk3Logo} height={60} width={60} style={{objectFit:'contain', marginRight: '80px'}}></Image>
                </Box>
                <Spacer />
                <Box p='2' sx={{position: 'absolute', width: '180px', marginLeft: 'auto', marginRight: 'auto', left: 0, right: 0}}>
                    <Heading size='lg' color={"whiteAlpha.900"} >ZK3 demo</Heading>
                </Box>
                <Spacer />
                <Box p='2'>
                    <LensSignInButton></LensSignInButton>
                </Box>
            </Flex>
        </>
    )
}