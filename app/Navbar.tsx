import { Flex, Box, Spacer, Heading, Text, HStack, Hide, Input, InputGroup, InputLeftAddon, InputRightElement, Button, ButtonGroup } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import WalletButton from "./WalletButton"
import Image from 'next/image'
import zk3Logo from '../public/zk3.png'
import LensSignInButton from "./newgroup/LensSignInButton"
import useLensUser from "../lib/auth/useLensUser";
import { SearchIcon } from "@chakra-ui/icons"
import Link from "next/link"

export default function Navbar() {
    const [activePage, setActivePage] = useState<'Explorer' | 'Identity' | 'Lens'>('Identity')

    useEffect(() => {
        //console.log('activePage:', window.location)
        if (window.location.pathname.includes('/proof')) {
            setActivePage('Explorer')
        } else if (window.location.pathname.includes('/lens')) {
            setActivePage('Lens')
        } else {
            setActivePage('Identity')
        }
    }, [])

    return (
        <>
            <Flex minWidth='max-content' alignItems='center' gap='2' bgColor='#002add' p='1'>
                <Box p='0' display='flex' alignItems='center'>
                    <HStack borderColor='#151c2b' borderWidth={2} my={1} mx={2} bgColor='#fff' borderRadius='8' p='1' width={140} onClick={() => window.open('/', '_self')} _hover={{ cursor: "pointer", }}>
                        <Image alt='zk3 Logo' src={zk3Logo} height={60} width={60} style={{ objectFit: 'contain', marginRight: '0px' }}></Image>
                        <Heading size='lg' textAlign='left'>ZK3</Heading>
                    </HStack>
                    {/*<form onSubmit={(e) => {
                        e.preventDefault()
                        handleSearchProof()
                    }}>
                        <InputGroup mb={0}>
                            <InputLeftAddon children='zk3://proof/' />
                            <Input  bgColor='#fff' type='text' name='id' placeholder="Search proof id..." onChange={(e) => setSearchQuery(e.target.value)}>

                            </Input>
                            <InputRightElement onClick={handleSearchProof} children={<SearchIcon color='#002add' />} />
                        </InputGroup>
                    </form>*/}

                </Box>
                <Spacer />
                <Box>
                    <ButtonGroup size='md' isAttached variant='solid' bgColor='#fff' borderRadius={8} borderColor='#151c2b' borderWidth={2}>
                        <Link href='/proof/dashboard'>
                            <Button onClick={() => setActivePage('Explorer')} _hover={activePage === 'Explorer' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2'}} bgColor={activePage === 'Explorer' ? '#002add' : '#fff'} borderRightColor='#151c2b' borderRightWidth={2} borderRightRadius={0} color={activePage === 'Explorer' ? '#fff' : '#151c2b'}>Proof Explorer</Button>
                        </Link>
                        <Link href='/'>
                            <Button onClick={() => setActivePage('Identity')} _hover={activePage === 'Identity' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2'}} bgColor={activePage === 'Identity' ? '#002add' : '#fff'} borderRadius={0} color={activePage === 'Identity' ? '#fff' : '#151c2b'}>Identity</Button>
                        </Link>
                        <Link href='/lens'>
                            <Button onClick={() => setActivePage('Lens')} _hover={activePage === 'Lens' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2'}} bgColor={activePage === 'Lens' ? '#002add' : '#fff'} borderLeftColor='#151c2b' borderLeftWidth={2} borderLeftRadius={0} color={activePage === 'Lens' ? '#fff' : '#151c2b'}>Lens Playground</Button>
                        </Link>

                    </ButtonGroup>
                </Box>
                <Spacer />
                <Box p='0'>
                    <LensSignInButton></LensSignInButton>
                </Box>
            </Flex>
        </>
    )
}