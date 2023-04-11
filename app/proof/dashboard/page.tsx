'use client'
import { Heading, Box, Skeleton, Stack } from "@chakra-ui/react";

export default function ProofExplorerDashboard() {
    return (
        <Box>
            <Box>
                <Heading size='md' mb={4}>Recent Proofs:</Heading>
                <Stack borderColor='#1e2d52' borderWidth={1} p={2} borderRadius={8}>
                    <Skeleton height="20px"/>
                    <Skeleton height="20px"/>
                    <Skeleton height="20px"/>
                    <Skeleton height="20px"/>
                    <Skeleton height="20px"/>
                    <Skeleton height="20px"/>
                    <Skeleton height="20px"/>
                </Stack>
            </Box>
        </Box>
    );
}