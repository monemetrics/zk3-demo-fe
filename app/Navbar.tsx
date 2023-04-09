import { Flex, Box, Spacer, Heading, Text, HStack, Hide, Input, InputGroup, InputLeftAddon, InputRightElement } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import WalletButton from "./WalletButton"
import Image from 'next/image'
import zk3Logo from '../public/zk3.png'
import LensSignInButton from "./newgroup/LensSignInButton"
import useLensUser from "../lib/auth/useLensUser";
import { SearchIcon } from "@chakra-ui/icons"

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchProof = () => {
        console.log(searchQuery)
        window.open('/proof/' + searchQuery, '_self')
    }
    return (
        <>
            <Flex minWidth='max-content' alignItems='center' gap='2' bgColor='#002add' p='1'>
                <Box p='0' display='flex' alignItems='center'>
                    <HStack my={1} mx={2} bgColor='#fff' borderRadius='8' p='1' width={140} onClick={() => window.open('/', '_self')} _hover={{ cursor: "pointer", }}>
                        <Image alt='zk3 Logo' src={zk3Logo} height={60} width={60} style={{ objectFit: 'contain', marginRight: '0px' }}></Image>
                        <Heading size='lg' textAlign='left'>ZK3</Heading>
                    </HStack>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSearchProof()
                    }}>
                        <InputGroup mb={0}>
                            <InputLeftAddon children='zk3://proof/' />
                            <Input  bgColor='#fff' type='text' name='id' placeholder="Search proof id..." onChange={(e) => setSearchQuery(e.target.value)}>

                            </Input>
                            <InputRightElement onClick={handleSearchProof} children={<SearchIcon color='#002add' />} />
                        </InputGroup>
                    </form>

                </Box>
                <Spacer />
                <Box p='0'>
                    <LensSignInButton></LensSignInButton>
                </Box>
            </Flex>
        </>
    )
}