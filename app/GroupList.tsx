import React from 'react'
import { Flex, Card, CardHeader, CardBody, Text } from "@chakra-ui/react"
import { useQuery, gql } from '@apollo/client';
import PrimaryCard from './PrimaryCard';

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

    const { loading, error, data } = useQuery(GET_CIRCLES);

    const handleAddNewGroup = () => {
        alert('yes')
    }

    return (
        <>
            <Flex flexDirection='column' width='md' gap='2'>
                {data ? data.circles.map((entry: { name: string, description: string }) => {
                    return (
                        <PrimaryCard name={entry.name} text={entry.description} />)

                }) : (() => { return <PrimaryCard name='Loading' text='Loading groups...' /> })}
                <PrimaryCard name='New Group' text='Add a new group' />
            </Flex>
        </>
    )
}

export default GroupList