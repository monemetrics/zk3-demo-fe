import React from 'react'
import { useContext, useEffect, useState } from 'react';
import ZK3Context from '../../context/ZK3Context';
import { Flex, Card, CardHeader, CardBody, Text, Radio, RadioGroup, HStack, Divider, Select, Button } from "@chakra-ui/react"
import RepoOwnerProof from './RepoOwnerProof';

function GithubActionList() {
    return (
        <>
            <Flex flexDirection='column' width='md' gap='2' alignItems='center'>
                <RepoOwnerProof></RepoOwnerProof>
            </Flex>
        </>
    )
}

export default GithubActionList