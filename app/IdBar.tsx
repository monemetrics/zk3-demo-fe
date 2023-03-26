'use client'

import React, { useContext, useEffect } from 'react'
import { Box, Text } from '@chakra-ui/layout'
import ZK3Context from '../context/ZK3Context'
import { Tooltip, useClipboard, useToast } from '@chakra-ui/react'

function IdBar() {
    const { _identityLinkedEOA } = useContext(ZK3Context)
    const placeholder = _identityLinkedEOA ? _identityLinkedEOA : "No Identity Linked";
    const { onCopy, value, setValue, hasCopied } = useClipboard("");
    const toast = useToast()

    useEffect(() => {
        if (!hasCopied) return
        toast({
            title: 'Copied!',
            description: 'Your address was copied to your clipboard',
            status: 'info',
            duration: 5000,
            isClosable: true,
        })
    }, [hasCopied])

    return (
        <>
            <Text align='center'>Identity Linked EOA:</Text>
            <Tooltip label={_identityLinkedEOA ? _identityLinkedEOA : "No Identity Linked"} placement='top'>
                <Box p='2' borderWidth='1px' borderRadius='lg' maxW='lg' alignSelf='center' px='2' boxShadow='md' onClick={onCopy} _hover={{cursor: "pointer"}}>
                    <Text align='center' fontSize='18' textColor='#002add'>
                        {_identityLinkedEOA ? _identityLinkedEOA?.substring(0, 5) + '...' + _identityLinkedEOA?.substring(_identityLinkedEOA.length - 3, _identityLinkedEOA.length) : "No Identity Linked"}
                    </Text>
                </Box>
            </Tooltip>
        </>
    )
}

export default IdBar