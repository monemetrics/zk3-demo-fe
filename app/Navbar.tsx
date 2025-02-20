import { Flex, Box, Spacer, Heading, Text, HStack, Hide, Input, InputGroup, InputLeftAddon, InputRightElement, Button, ButtonGroup, Show, VStack } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import WalletButton from "./WalletButton"
import Image from 'next/image'
import zk3Logo from '../public/zk3.png'
import LensSignInButton from "./newgroup/LensSignInButton"
import useLensUser from "../lib/auth/useLensUser";
import { SearchIcon } from "@chakra-ui/icons"
import Link from "next/link"

export default function Navbar() {
    const [activePage, setActivePage] = useState<'Explorer' | 'Identity' | 'Lens' | 'Genesis'>('Identity')

    useEffect(() => {
        //console.log('activePage:', window.location)
        if (window.location.pathname.includes('/proof')) {
            setActivePage('Explorer')
        } else if (window.location.pathname.includes('/lens')) {
            setActivePage('Lens')
        } else if (window.location.pathname.includes('/genesis')) {
            setActivePage('Genesis')
        } else {
            setActivePage('Identity')
        }
    }, [])

    return (
        <>
            <Box>
                <Flex minWidth='max-content' alignItems='center' gap='1' bgColor='#002add' p='1'>
                    <Box p='0' display='flex' alignItems='center'>
                        <HStack borderColor='#151c2b' borderWidth={2} my={1} mx={2} bgColor='#fff' borderRadius='8' p='1' width={140} onClick={() => window.open('/', '_self')} _hover={{ cursor: "pointer", }}>
                            <Image alt='zk3 Logo' src={zk3Logo} height={60} width={60} style={{ objectFit: 'contain', marginRight: '0px' }}></Image>
                            <Heading size='lg' textAlign='left'>ZK3</Heading>
                        </HStack>
                    </Box>
                    <Spacer />
                    <Hide breakpoint='(max-width: 800px)'>
                        <Box>
                            <VStack spacing='0'>
                                <ButtonGroup size='md' isAttached variant='solid' bgColor='#fff' borderRadius={8} borderColor='#151c2b' borderWidth={2} mb={0}>
                                    <Link href='/proof/dashboard'>
                                        <Button width='165px' onClick={() => setActivePage('Explorer')} _hover={activePage === 'Explorer' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2' }} bgColor={activePage === 'Explorer' ? '#002add' : '#fff'} borderRightColor='#151c2b' borderRightWidth={2} borderRightRadius={0} color={activePage === 'Explorer' ? '#fff' : '#151c2b'}>Proof Explorer</Button>
                                    </Link>
                                    <Link href='/'>
                                        <Button onClick={() => setActivePage('Identity')} _hover={activePage === 'Identity' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2' }} bgColor={activePage === 'Identity' ? '#002add' : '#fff'} borderRadius={0} color={activePage === 'Identity' ? '#fff' : '#151c2b'}>Identity</Button>
                                    </Link>
                                    <Link href='/lens'>
                                        <Button width='165px' onClick={() => setActivePage('Lens')} _hover={activePage === 'Lens' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2' }} bgColor={activePage === 'Lens' ? '#002add' : '#fff'} borderLeftColor='#151c2b' borderLeftWidth={2} borderLeftRadius={0} color={activePage === 'Lens' ? '#fff' : '#151c2b'}>Lens Playground</Button>
                                    </Link>

                                </ButtonGroup>
                                <Link href='/genesis'>
                                    <Button size='sm' mt={0} onClick={() => setActivePage('Genesis')} _hover={activePage === 'Genesis' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2' }} bgColor={activePage === 'Genesis' ? '#002add' : '#fff'} borderColor='#151c2b' borderWidth={2} borderTopWidth={0} borderTopRadius={0} color={activePage === 'Genesis' ? '#fff' : '#151c2b'}>Genesis Drop</Button>
                                </Link>
                            </VStack>
                        </Box>
                    </Hide>
                    <Spacer />
                    <Box p='0' mr={2}>
                        <LensSignInButton></LensSignInButton>
                    </Box>
                </Flex>

                <Show breakpoint='(max-width: 800px)'>
                    <Flex minWidth='max-content' alignItems='center' gap='2' bgColor='#002add' p='1' justifyContent='center'>
                        <Box>
                            <ButtonGroup size={{ 'base': 'sm', 'sm': 'md' }} isAttached variant='solid' bgColor='#fff' borderRadius={8} borderColor='#151c2b' borderWidth={2}>
                                <Link href='/proof/dashboard'>
                                    <Button onClick={() => setActivePage('Explorer')} _hover={activePage === 'Explorer' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2' }} bgColor={activePage === 'Explorer' ? '#002add' : '#fff'} borderRightColor='#151c2b' borderRightWidth={2} borderRightRadius={0} color={activePage === 'Explorer' ? '#fff' : '#151c2b'}>Proof Explorer</Button>
                                </Link>
                                <Link href='/'>
                                    <Button onClick={() => setActivePage('Identity')} _hover={activePage === 'Identity' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2' }} bgColor={activePage === 'Identity' ? '#002add' : '#fff'} borderRadius={0} color={activePage === 'Identity' ? '#fff' : '#151c2b'}>Identity</Button>
                                </Link>
                                <Link href='/lens'>
                                    <Button onClick={() => setActivePage('Lens')} _hover={activePage === 'Lens' ? { bgColor: '#4299E1' } : { bgColor: '#e2e2e2' }} bgColor={activePage === 'Lens' ? '#002add' : '#fff'} borderLeftColor='#151c2b' borderLeftWidth={2} borderLeftRadius={0} color={activePage === 'Lens' ? '#fff' : '#151c2b'}>Lens Playground</Button>
                                </Link>

                            </ButtonGroup>
                        </Box>
                    </Flex>
                </Show>
            </Box>
        </>
    )
}