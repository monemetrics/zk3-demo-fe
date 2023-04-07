"use client"
import { Box, Divider, Heading } from "@chakra-ui/react"
import { ZK3_GRAPHQL_ENDPOINT } from "../../../const/contracts"

export default function ProofPage({ params }: any) {
    const fetchQGLProofData = async () => {
        const graphqlQuery = {
            operationName: "Query",
            query: `query GetProof($id: Int!) { 
                        proofs(where: {id: {_eq: $id}}) {
                        id
                        name
                        description
                        circle {
                            name
                            id
                        }}}`,
            variables: { id: params.id }
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
        console.log("proofData: ", data)
    }
    const timestamp = "now"
    const dummyCommitment = "0x0"
    const dummyProofName = "Proof Name"
    const dummyProofDescription = "Proof Description"
    const dummyCircleName = "Circle Name"
    const dummyContentURI = "ipfs://asdf.com"

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
                    Name:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {dummyProofName}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    Description:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {dummyProofDescription}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" display="flex" color="#1e2d52">
                    Identity Commitment:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {dummyCommitment}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    Content URI:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {dummyContentURI}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    Timestamp:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    {timestamp}
                </Heading>
            </Box>
            <Divider />
            <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                <Heading size="sm" color="#1e2d52">
                    Merkle Root:{" "}
                </Heading>
                <Heading size="sm" p={2} ml={4} color="#1e2d52">
                    0x0
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