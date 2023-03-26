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

function MyProofList(props: { data: any }) {
    const { _identity, setMyCircleList, _myCircleList } = useContext(ZK3Context)
    //var [ myCircleList, setMyCircleList ] = useState<circle[]>([])
    
    if (!_identity)
        return <p>No identity found</p>

    var circleList = props.data.circles
    const commitment = new Identity(_identity.toString()).getCommitment()
    //console.log(circleList, commitment)

    var myCircleList: circle[] = []
    circleList.forEach((element: any) => {
        if (element.members.includes(commitment.toString())){
            //console.log(element.id, element.members)
            myCircleList.push(element)
        }
    });

    //console.log(myCircleList)

    localStorage.setItem("myCircleList", JSON.stringify(myCircleList))

    return (
        <>
            <Flex flexDirection='column' width='md' gap='2' alignItems='center'>
                {myCircleList.map((e: circle) => {return (
                    <PrimaryCard key={e.id} name={e.description} logo='Ethereum' text={e.contentURI} />
                )})}
            </Flex>
        </>
    )
}

export default MyProofList