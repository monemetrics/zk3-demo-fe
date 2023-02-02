import { Flex, Box, Spacer, Heading } from "@chakra-ui/react"
import Profile from "./Profile"

export default function Navbar() {
    return (
        <>
            <Flex minWidth='max-content' alignItems='center' gap='2' bgColor='#0068e6'>
                <Box p='2'>
                    1
                </Box>
                <Spacer />
                <Box p='2'>
                    <Heading size='lg' color={"whiteAlpha.900"} >ZK3 demo</Heading>
                </Box>
                <Spacer />
                <Box p='2'>
                    <Profile></Profile>
                </Box>
            </Flex>
        </>
    )
}