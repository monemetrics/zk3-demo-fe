import React from 'react'
import { useContext, useEffect, useState } from 'react';
import { Box, Spacer, Flex, Card, CardHeader, CardBody, Text, Radio, RadioGroup, HStack, Divider, Select, Button, useToast } from "@chakra-ui/react"
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
import { createGithubRepoOwnerProofTypedData } from '../../lib/ZK3helpers';
import ZK3Context from "../../context/ZK3Context"
import { BigNumber } from 'ethers';
import { Identity } from '@semaphore-protocol/identity';
import { useQuery, useMutation, gql } from '@apollo/client';
import { FC } from 'react';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { CheckCircleIcon } from '@chakra-ui/icons';

interface ModuleProps {
    title: string;
    icon: ReactNode;
    onClick: () => void;
    selected: boolean;
}

const RepoSelectCard: FC<ModuleProps> = ({ title, icon, onClick, selected }) => (
    <Box p='2' borderColor='#1e2d52' borderWidth={selected ? 2 : 1} borderRadius='10' mb='2' _hover={{ borderColor: '#151c2b' }} onClick={onClick}>
        <Box display='flex' alignItems='center'>
            <Box display='flex' alignItems='center' justifyContent='start'>
                <Box mr='5'>{icon}</Box>
                <div>{title}</div>
            </Box>
            <Spacer></Spacer>
            {selected && <CheckCircleIcon color='#002add' width={5} height={5} />}
        </Box>
    </Box>
);

function RepoOwnerProof() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { _identity, _lensAuthToken, _identityLinkedEOA } = useContext(ZK3Context)
    const [ownedRepos, setOwnedRepos] = useState<string[]>([])
    const [selectedRepo, setSelectedRepo] = useState<string>('')
    const address = useAddress()
    const sdk = useSDK()
    const toast = useToast()

    useEffect(() => {
        const graphqlQuery = {
            "operationName": "Query",
            "query": `query Query($ethAddress: String!) {
                getOwnedRepos(ethAddress: $ethAddress)
              }`,
            "variables": { "ethAddress": _identityLinkedEOA }
        };
        const fetchOwnedRepos = async () => {
            const response = await fetch('https://dev.zk3.io/graphql', {
                method: 'POST',
                headers: {
                    'x-access-token': `Bearer ${_lensAuthToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphqlQuery)
            })
            const data = await response.json()
            console.log('ownedRepos: ', data)
            setOwnedRepos(data.data.getOwnedRepos)
        }
        fetchOwnedRepos();
    }, [])

    var REPO_OWNER_PROOF = gql`mutation CreateBalanceOfProof($identityCommitment: String!, $signature: String, $repoName: String!) {
        createGithubRepoOwnerProof(identityCommitment: $identityCommitment, signature: $signature, repoName: $repoName)
      } `;

    const [mutateFunction, { data: authData }] = useMutation(REPO_OWNER_PROOF, {

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
        const typedData = await createGithubRepoOwnerProofTypedData(commitment.toString(), address, selectedRepo)

        const signature = await sdk?.wallet.signTypedData(typedData.domain, typedData.types, typedData.value)
        //console.log(signature)

        mutateFunction({ variables: { identityCommitment: commitment.toString(), signature: signature?.signature, repoName: selectedRepo } })
            .then((response) => {
                console.log("response: ", response)
                toast({
                    title: `RepoOwnerProof ${selectedRepo} successfully created!`,
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
                <PrimaryCard name='Repo Owner proof' logo='Github' text='Click to create a ZK3 proof of ownership of a Github Repository' />
            </div>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose a Repository</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {ownedRepos.map((repo) => {
                            return (
                                <RepoSelectCard
                                    key={repo}
                                    title={repo}
                                    icon={<img src='/github.png' width={25} height={25} />}
                                    onClick={() => setSelectedRepo(repo)}
                                    selected={selectedRepo ? selectedRepo === repo : false}
                                />
                            )
                        })}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleGenerateProof} width='100%' variant='solid' bgColor='#002add' color='#fff' colorScheme='blue'>Generate Proof</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default RepoOwnerProof