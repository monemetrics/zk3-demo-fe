'use client'
import { Box, Text, HStack, Button } from "@chakra-ui/react";
import { useState } from "react";
import useLensUser from "../../../lib/auth/useLensUser";
import LensSignInButton from "../../newgroup/LensSignInButton";

export default function Page() {
    const [selectedSocial, setSelectedSocial] = useState<'twitter' | 'lens' | null>(null)
    const { isSignedInQuery, profileQuery } = useLensUser();
    const [lensFollowerCount, setLensFollowerCount] = useState<Number | null>(null)

    if (profileQuery.data?.defaultProfile && lensFollowerCount === null) {
        setLensFollowerCount(profileQuery.data?.defaultProfile.stats.totalFollowers)
    }

    const getRoundedDownLogCount = (count: Number) => {
        const len = Number(count.toExponential().split('+')[1])
        return 10**len
    }

    return (
        <Box display='flex' flexDir='column' justifyItems='center'>
            <Text align='center' as='b' fontSize='5xl'>Genesis ZK3 Drop</Text>
            <Text align='center' fontSize='xl'>Generate a ZK3 Proof and mint a free NFT!</Text>
            <br />
            <Text align='center' fontSize=''>Please which type of social proof you would like to generate:</Text>
            <HStack justifyContent='space-evenly' my={4}>
                <Button onClick={() => setSelectedSocial('twitter')} variant='outline' colorScheme='twitter' color={selectedSocial === 'twitter' ? '#fff' : '#1a94da'} bgColor={selectedSocial === 'twitter' ? '#1a94da' : ''}>Twitter</Button>
                <Button onClick={() => setSelectedSocial('lens')} variant='outline' colorScheme='green' color='#00501e' bgColor={selectedSocial === 'lens' ? '#abfe2c' : ''}>Lens</Button>
            </HStack>
            {selectedSocial &&
                <>
                    {selectedSocial === 'twitter' &&
                        <>
                            <Text align='center' fontSize='xl'>Twitter</Text>
                            <Box mb={4} justifyContent='center' display='flex'>
                                <Button variant='solid' colorScheme='twitter' color='#fff' bgColor='#1a94da'>Sign in with Twitter</Button>
                            </Box>
                        </>
                    }
                    {selectedSocial === 'lens' &&
                        <>
                            <Text mb={4} align='center' fontSize='xl'>Lens</Text>
                            <Box mb={4} justifyContent='center' display='flex'>
                                <LensSignInButton></LensSignInButton>
                            </Box>
                            {lensFollowerCount && 
                                <>
                                    <Text mb={4} align='center'>You have {lensFollowerCount.toString()} followers on Lens</Text>
                                    <Button variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>Generate Proof of {`>= ${getRoundedDownLogCount(lensFollowerCount)}`} followers</Button>
                                </>
                            }
                        </>
                    }
                </>
            }
        </Box>
    );
}