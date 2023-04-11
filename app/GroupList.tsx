import React from 'react'
import { useContext, useEffect, useState } from 'react';
import ZK3Context from '../context/ZK3Context';
import { Flex, Card, CardHeader, CardBody, Text } from "@chakra-ui/react"
import { useQuery, gql } from '@apollo/client';
import PrimaryCard from './PrimaryCard';
import Link from 'next/link';

function GroupList() {
    const GET_CIRCLES = gql`
        query GetCircles {
            circles {
                name
                id
                description
            }
        }
    `;

    const [groupData, setGroupData] = useState<string[]>([])
    const { getActiveGroups, _githubAuthToken } = useContext(ZK3Context)

    //const { loading, error, data } = useQuery(GET_CIRCLES);

    useEffect(() => {
        //console.log(getActiveGroups())
        setGroupData(getActiveGroups().concat(['Ethereum']))
        if (_githubAuthToken && !getActiveGroups().includes('Github'))
            setGroupData(getActiveGroups().concat(['Github']).concat(['Ethereum']))
    }, [_githubAuthToken])

    return (
        <>
            <Flex flexDirection='column' width='md' gap='2' alignItems='center'>
                {groupData.map((entry: string) => {
                    return (
                        <Link key={entry} href={'/' + entry.toLowerCase()}>
                            <PrimaryCard name={entry === 'Ethereum' ? 'OnChain' : entry} logo={entry} text='View Group' />
                        </Link>)

                })}
                {/*data ? data.circles.map((entry: { name: string, description: string }) => {
                    return (
                        <PrimaryCard name={entry.name} text={entry.description} />)

                }) : (() => { return <PrimaryCard name='Loading' text='Loading groups...' /> })*/}
                <Link href='/newgroup'>
                    <PrimaryCard name='New Group' logo='New Group' text='Add a new group' />
                </Link>
            </Flex>
        </>
    )
}

export default GroupList