import React from 'react'
import { useContext, useEffect, useState } from 'react';
import { Flex, Card, CardHeader, CardBody, Text, Radio, RadioGroup, HStack, Divider, Select, Button, useToast } from "@chakra-ui/react"
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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper
} from '@chakra-ui/react'
import PrimaryCard from '../PrimaryCard';
import { useDisclosure } from '@chakra-ui/react';
import { useBalance, useSDK, useAddress } from "@thirdweb-dev/react";
import { ChainId, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { createBalanceOfProofTypedData } from '../../lib/ZK3helpers';
import ZK3Context from "../../context/ZK3Context"
import { BigNumber } from 'ethers';
import { Identity } from '@semaphore-protocol/identity';
import { useQuery, useMutation, gql } from '@apollo/client';

function EVMBalanceOfProof() {
    const { data: ethBalanceData, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [balanceOfValue, setBalanceOfValue] = useState<number>(1)
    const [selectedSymbol, setSelectedSymbol] = useState('MATIC')
    const { _identity } = useContext(ZK3Context)
    const address = useAddress()
    const sdk = useSDK()
    const toast = useToast()
    
    var BALANCE_OF_PROOF = gql`mutation CreateBalanceOfProof(
        $identityCommitment: String!, 
        $ethAddress: String!, 
        $balance: String!, 
        $signature: String
        ) {
            createBalanceOfProof(
                identityCommitment: $identityCommitment, 
                ethAddress: $ethAddress, 
                balance: $balance, 
                signature: $signature)
      }`;

    const [mutateFunction, { data: authData }] = useMutation(BALANCE_OF_PROOF, {
        
    });

    const handleGenerateProof = async (e: any) => {
        // toDo: add erc20 support (currently only native tokens)
        //console.log(_identity)
        if (!_identity)
            return
        if (!address)
            return
        const commitment = new Identity(_identity.toString()).getCommitment()
        //console.log(commitment)
        const typedData = await createBalanceOfProofTypedData(commitment.toString(), address, BigNumber.from(9))

        const signature = await sdk?.wallet.signTypedData(typedData.domain, typedData.types, typedData.value)
        //console.log(signature)

        mutateFunction({ variables: { identityCommitment: commitment.toString(), ethAddress: address, balance: balanceOfValue.toString(), signature: signature?.signature } })
                    .then((response) => {
                        console.log("response: ", response)
                        toast({
                            title: `BalanceOfProof ${balanceOfValue} successfully created!`,
                            description: `https://mumbai.polygonscan.com/tx/${response.data.createBalanceOfProof}`,
                            status: 'success',
                            duration: 100000,
                            isClosable: true,
                          })
                    })

    }

    return (
        <>

            <div onClick={onOpen}>
                <PrimaryCard name='BalanceOf proof' logo='Ethereum' text='Click to create a ZK3 proof of an ERC20 Balance' />
            </div>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a ZK3 Proof</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>
                                {'Balance: ' + ethBalanceData?.displayValue.split('.')[0] + '.' + ethBalanceData?.displayValue.split('.')[1].substring(0, 5) + ' ' + ethBalanceData?.symbol}
                            </FormLabel>
                            <NumberInput
                                defaultValue={1}
                                value={balanceOfValue}
                                onChange={(e) => { setBalanceOfValue(Number(e)) }}
                                min={0}
                                max={Number(ethBalanceData?.displayValue)}
                                keepWithinRange={true}
                                precision={0}
                                step={1}
                                clampValueOnBlur={true}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <FormHelperText>
                                Enter the amount you would like to generate a proof of ownership for
                            </FormHelperText>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleGenerateProof} width='100%' variant='solid' bgColor='#002add' color='#fff' colorScheme='blue'>Generate Proof</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EVMBalanceOfProof