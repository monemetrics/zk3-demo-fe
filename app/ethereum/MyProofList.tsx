import React from 'react'
import { useContext, useEffect, useState } from 'react';
import ZK3Context from '../../context/ZK3Context';
import { Flex, Card, CardHeader, CardBody, Text, Radio, RadioGroup, HStack, Divider, Select, Button } from "@chakra-ui/react"
import EVMBalanceOfProof from './EVMBalanceOfProof';
import { Identity } from '@semaphore-protocol/identity';
import PrimaryCard from '../PrimaryCard';

interface circle {
    id: string,
    members: string[],
    name: string,
    description: string,
    contentURI: string
}

function MyProofList() {
    const { _identity, setMyCircleList, _myCircleList } = useContext(ZK3Context)
    //var [ myCircleList, setMyCircleList ] = useState<circle[]>([])
    
    if (!_identity)
        return <p>No identity found</p>

    return (
        <>
            <Flex flexDirection='column' width='md' gap='2' alignItems='center'>
                {_myCircleList.map((e: circle) => {return (
                    <PrimaryCard key={e.id} name={e.description} logo={e.description.split('-')[0] == 'github' ? 'Github' : 'Ethereum'} text={e.contentURI} />
                )})}
            </Flex>
        </>
    )
}

export default MyProofList