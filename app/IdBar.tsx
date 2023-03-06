'use client'

import React from 'react'
import { Box, Text } from '@chakra-ui/layout'
import { useEnsName, useAccount} from 'wagmi'

function IdBar(props: { ensName: string }) {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    return (
        <>
            <Box p='2' borderWidth='1px' borderRadius='lg' maxW='sm' alignSelf='center' px='28' boxShadow='md'>
                <Text align='center' fontWeight='bold' fontSize='28' textColor='blue.500'>
                    {ensName? ensName : 'no ENS name found'}
                </Text>
            </Box>
        </>
    )
}

export default IdBar