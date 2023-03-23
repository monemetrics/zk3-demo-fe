'use client'

import React, { useContext } from 'react'
import { Box, Text } from '@chakra-ui/layout'
import ZK3Context from '../context/ZK3Context'

function IdBar() {
    const { _identityLinkedEOA } = useContext(ZK3Context)
    return (
        <>
            <Text align='center'>Identity Linked EOA:</Text>
            <Box p='2' borderWidth='1px' borderRadius='lg' maxW='lg' alignSelf='center' px='2' boxShadow='md'>
                <Text align='center' fontSize='18' textColor='#002add'>
                    {_identityLinkedEOA ? _identityLinkedEOA : "No Identity Linked"}
                </Text>
            </Box>
        </>
    )
}

export default IdBar