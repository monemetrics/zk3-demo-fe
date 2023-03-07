'use client'

import React from 'react'
import { Box, Text } from '@chakra-ui/layout'
import useLensUser from "../lib/auth/useLensUser";

function IdBar(props: { ensName: string }) {
    const { isSignedInQuery, profileQuery } = useLensUser();
    return (
        <>
            <Box p='2' borderWidth='1px' borderRadius='lg' maxW='sm' alignSelf='center' px='28' boxShadow='md'>
                <Text align='center' fontWeight='bold' fontSize='28' textColor='blue.500'>
                    {isSignedInQuery && profileQuery?.data?.defaultProfile?.name}
                </Text>
            </Box>
        </>
    )
}

export default IdBar