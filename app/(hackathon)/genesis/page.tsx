'use client'
import { Box, Text, HStack, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function Page() {
    const [selectedSocial, setSelectedSocial] = useState<'twitter' | 'lens' | null>(null)
    return (
        <Box display='flex' flexDir='column' justifyItems='center'>
            <Text align='center' as='b' fontSize='5xl'>Genesis ZK3 Drop</Text>
            <Text align='center' fontSize='xl'>Generate a ZK3 Proof and mint a free NFT!</Text>
            <br />
            <Text align='center' fontSize=''>Please which type of social proof you would like to generate:</Text>
            <HStack justifyContent='space-evenly' my={4}>
                <Button onClick={() => setSelectedSocial('twitter')} variant='outline' colorScheme='twitter'>Twitter</Button>
                <Button onClick={() => setSelectedSocial('lens')} variant='outline' colorScheme='green' color='#00501e'>Lens</Button>
            </HStack>
            {selectedSocial &&
                <>
                    {selectedSocial === 'twitter' &&
                        <>
                            <Text align='center' fontSize='xl'>Twitter</Text>
                        </>
                    }
                    {selectedSocial === 'lens' &&
                        <>
                            <Text align='center' fontSize='xl'>Lens</Text>
                        </>
                    }
                </>
            }
        </Box>
    );
}