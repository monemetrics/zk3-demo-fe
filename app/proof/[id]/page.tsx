"use client"
import { Box, Divider, Heading } from "@chakra-ui/react"
import { ZK3_GRAPHQL_ENDPOINT } from "../../../const/contracts"
import { useEffect, useState } from "react"

export default function ProofPage({ params }: any) {
    const [proofData, setProofData] = useState<any>(null)
    const fetchQGLProofData = async () => {
        const graphqlQuery = {
            operationName: "Query",
            query: `query Query($proofId: ID!) {
                proof(proofId: $proofId) {
                  proofId
                  circleId
                  signal
                  proof
                  txHash
                  createdAt
                  updatedAt
                  blockNumber
                }
              }`,
            variables: { proofId: params.id }
        }

        const response = await fetch(ZK3_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                //"x-access-token": `Bearer ${JSON.parse(lensAuthToken!).accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(graphqlQuery)
        })
        const data: { data: { proof: any } } = await response.json()
        console.log("proofData: ", data.data)
        setProofData(data.data.proof)
    }
    // const timestamp = "now"
    // const dummyCommitment = "0x0"
    // const dummyProofName = "Proof Name"
    // const dummyProofDescription = "Proof Description"
    // const dummyCircleName = "Circle Name"
    // const dummyContentURI = "ipfs://asdf.com"
    useEffect(() => {
        fetchQGLProofData()
    }, [])
    // fetchQGLProofData()

    return (
        <>
            <Box mb={2} display="flex" alignItems="center" justifyContent="start">
                <Heading size="md">proof / </Heading>
                <Heading size="md" ml={1} px={2} borderRadius={45} bgColor="#002add" color="white">
                    {params.id}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    circleId:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {proofData?.circleId}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    Signal:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {proofData?.signal}
                </Heading>
            </Box>
            <Divider />
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    proof:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {proofData?.proof}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    CreatedAt:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {proofData?.createdAt}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    Tx Hash:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {proofData ? `https://mumbai.polygonscan.com/tx/${proofData.txHash}` : "loading..."}
                </Heading>
            </Box>
            <a
                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                className="twitter-share-button"
                data-size="large"
                data-text="testing..."
                data-url="http://localhost:3000/proof/1234"
                data-via="zk3org"
                data-show-count="false"
            >
                Tweet
            </a>
            <script async src="https://platform.twitter.com/widgets.js"></script>
        </>
    )
}