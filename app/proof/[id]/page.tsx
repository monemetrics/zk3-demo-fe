"use client"
import { Box, Button, Divider, Heading } from "@chakra-ui/react"
import { ZK3_GRAPHQL_ENDPOINT } from "../../../const/contracts"
import { useEffect, useState } from "react"

export default function ProofPage({ params }: any) {
    const [proofData, setProofData] = useState<any>(null)
    const [hasTweeted, setHasTweeted] = useState<boolean>(false)
    const [proof404, setProof404] = useState<boolean>(false)
    const fetchGQLProofData = async () => {
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
        if (data.data.proof == null)
            setProof404(true)
        setProofData(data.data.proof)
    }
    // const timestamp = "now"
    // const dummyCommitment = "0x0"
    // const dummyProofName = "Proof Name"
    // const dummyProofDescription = "Proof Description"
    // const dummyCircleName = "Circle Name"
    // const dummyContentURI = "ipfs://asdf.com"
    useEffect(() => {
        fetchGQLProofData()
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
            {!proofData ?
                <Box mt={4} display='flex' justifyContent='center'>
                    <Heading size='md'>{proof404 ? 'Proof not found' : 'Loading...'}</Heading>
                </Box> 
                :
                <>
                    <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                        <Heading size="sm" color="#1e2d52">
                            CircleId:{" "}
                        </Heading>
                        <Heading size="sm" p={2} ml={4} color="#1e2d52" fontWeight='normal'>
                            {proofData?.circleId}
                        </Heading>
                    </Box>
                    <Divider />
                    <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                        <Heading size="sm" color="#1e2d52">
                            Signal:{" "}
                        </Heading>
                        <Heading size="sm" p={2} ml={4} color="#1e2d52" wordBreak='break-all' fontWeight='normal'>
                            {proofData?.signal}
                        </Heading>
                    </Box>
                    <Divider />
                    <Divider />
                    <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                        <Heading size="sm" color="#1e2d52">
                            Proof:{" "}
                        </Heading>
                        <Heading size="sm" p={2} ml={4} color="#1e2d52" wordBreak='break-all' fontWeight='normal'>
                            {proofData?.proof}
                        </Heading>
                    </Box>
                    <Divider />
                    <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                        <Heading size="sm" color="#1e2d52">
                            CreatedAt:{" "}
                        </Heading>
                        <Heading size="sm" p={2} ml={4} color="#1e2d52" wordBreak='break-all' fontWeight='normal'>
                            {proofData?.createdAt}
                        </Heading>
                    </Box>
                    <Divider />
                    <Box display="flex" flexDir="column" alignItems="start" justifyContent="end" mt={4}>
                        <Heading size="sm" color="#1e2d52">
                            Tx Hash:{" "}
                        </Heading>
                        <Heading size="sm" p={2} ml={4} color="#1e2d52" wordBreak='break-all' fontWeight='normal' _hover={{ textDecoration: 'underline' }}>
                            {proofData ? <a target='_blank' href={`https://mumbai.polygonscan.com/tx/${proofData.txHash}`}>{`https://mumbai.polygonscan.com/tx/${proofData.txHash}`}</a> : "loading..."}
                        </Heading>
                    </Box>
                    <Divider />
                    <Box display='flex' alignItems='center' mt={4} flexDir='column'>
                        <Heading size='sm' mb={4}>
                            Share your proof on Twitter and get a free genesis NFT!
                        </Heading>
                        <a
                            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                            className="twitter-share-button"
                            data-size="large"
                            data-text="I created a zero knowledge proof with ZK3 Protocol. Check it out on the proof explorer! Generate a proof and mint a free genesis NFT for a limited time only!"
                            data-url={`https://zk3-app-zk3.vercel.app/proof/${params.id}`}
                            data-via="zk3org"
                            data-show-count="false"
                        >

                        </a>
                        <script async src="https://platform.twitter.com/widgets.js"></script>
                        <Heading size='sm' mt={4}>
                            {hasTweeted ? "Thanks for sharing!" : "Please share your proof on Twitter to be eligible for the mint!"}
                        </Heading>
                        <Button isDisabled={!hasTweeted} mt={4} variant='solid' bgColor='#002add' color='#fff' colorScheme='blue'>
                            MINT
                        </Button>
                    </Box>
                </>
            }
        </>
    )
}