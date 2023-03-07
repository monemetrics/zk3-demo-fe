import React from 'react'
import { useContext, useEffect, useState } from 'react';
import ZK3Context from '../../context/ZK3Context';
import { Flex, Card, CardHeader, CardBody, Text, Radio, RadioGroup, HStack, Divider, Select, Button } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Textarea,
} from '@chakra-ui/react'
import CreatePost from './CreatePost';
import { Input } from '@chakra-ui/react';
import PrimaryCard from '../PrimaryCard';
import { useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';

function LensActionList() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handlePostSubmission = (e: any) => {
        e.preventDefault()
        //console.log(new FormData(e.target))
    }

    return (
        <>
            <Flex flexDirection='column' width='md' gap='2'>
                <div onClick={onOpen}>
                    <PrimaryCard name='ZK3 enabled Lens Post' logo='Lens' text='Click to create a Lens post with an embedded ZK3 proof' />
                </div>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a ZK3 Lens Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <CreatePost />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default LensActionList