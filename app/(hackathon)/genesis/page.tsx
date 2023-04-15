'use client'
import { Box, Text, HStack, Button, Heading, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import useLensUser from "../../../lib/auth/useLensUser";
import LensSignInButton from "../../newgroup/LensSignInButton";
import ZK3Context from "../../../context/ZK3Context";
import { createProofOfTwitterTypedData } from "../../../lib/ZK3helpers";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Identity } from "@semaphore-protocol/identity";
import TGP from "../../../public/tokyo_genesis.png";
import Image from "next/image";
import { ZK3_GRAPHQL_ENDPOINT } from "../../../const/contracts";
import { m } from "framer-motion";
import { useCreatePostWithDispatcher } from "../../../lib/useCreatePostWithDispatcher";
import useSetDispatcher from "../../../lib/useSetDispatcher";

interface circle {
    id: string,
    members: string[],
    name: string,
    description: string,
    contentURI: string
}

export default function Page() {
    const { mutateAsync: createPostWithDispatcher } = useCreatePostWithDispatcher();
    const [selectedSocial, setSelectedSocial] = useState<'twitter' | 'lens' | null>('twitter')
    const { isSignedInQuery, profileQuery } = useLensUser();
    const [lensFollowerCount, setLensFollowerCount] = useState<Number | null>(null)
    const [twitterAccount, setTwitterAccount] = useState<any>(null)
    const [proofReceipt, setProofReceipt] = useState<any>(null)
    const [hasTweeted, setHasTweeted] = useState<boolean>(false)
    const [hasMinted, setHasMinted] = useState<boolean>(false)
    const [hasTwitterProof, setHasTwitterProof] = useState<boolean>(false)
    const [selectedProof, setSelectedProof] = useState<circle | null>(null)
    const address = useAddress()
    const { setDispatcher } = useSetDispatcher()
    const toast = useToast()
    const { _identity, _lensAuthToken, _identityLinkedEOA, _myCircleList } = useContext(ZK3Context)

    const graphqlQuery = {
        operationName: "Query",
        query: `query Query($service: String!) {
    isConnected(service: $service)
  }`,
        variables: { service: "twitter" }
    }

    const fetchHasTwitter = async () => {
        const response = await fetch(ZK3_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "x-access-token": `Bearer ${_lensAuthToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(graphqlQuery)
        })
        const data: { data: { isConnected: boolean } } = await response.json()
        console.log("isConnected: ", data)
        if (data.data.isConnected) {
            setTwitterAccount(data.data.isConnected.toString())
            console.log("found twitter handle")
        }
    }

    useEffect(() => {
        const temp = localStorage.getItem("myCircleList")
        if (temp) {
            const circle = JSON.parse(temp).filter((c: any) => c.name === "twitter-account-holder")[0]
            if (circle) {
                setSelectedProof(circle)
                setHasTwitterProof(true)
            }
        }

        fetchHasTwitter()
    }, [profileQuery.data])

    const proofOfTwitterGQL = {
        operationName: "Mutation",
        query: `
        mutation Mutation($identityCommitment: String!, $ethAddress: String!, $twitterHandle: String!, $signature: String) {
            createProofOfTwitter(identityCommitment: $identityCommitment, ethAddress: $ethAddress, twitterHandle: $twitterHandle, signature: $signature)
          }`,
        variables: {
            identityCommitment: _identity?.getCommitment().toString(),
            ethAddress: _identityLinkedEOA,
            twitterHandle: twitterAccount,
        }
    };
    const proofOfLensGQL = {
        operationName: "Mutation",
        query: `
        mutation CreateProofOfLens($identityCommitment: String!, $ethAddress: String!, $lensId: String!, $linkedEoaSig: String, $secondaryEoaAddress: String, $secondaryEoaSig: String) {
            createProofOfLens(identityCommitment: $identityCommitment, ethAddress: $ethAddress, lensId: $lensId, linkedEOASig: $linkedEoaSig, secondaryEOAAddress: $secondaryEoaAddress, secondaryEOASig: $secondaryEoaSig)
          }`,
        variables: {
            identityCommitment: _identity?.getCommitment().toString(),
            ethAddress: address,
            lensId: profileQuery.data?.defaultProfile?.id,
        }
    };

    const postToLens = async () => {
        await createPostWithDispatcher({
            image: null,
            title: 'title',
            description: 'description',
            content: 'Konnichiwa Tokyo via ZK3',
            selectedProof: selectedProof!,
        });
    }

    // todo: implement
    const handleTwitterSignIn = () => {
        window.open(`https://dev.zk3.io/webhooks/twitter/signin?ethAddress=${_identityLinkedEOA}`)
    }

    if (profileQuery.data?.defaultProfile && lensFollowerCount === null) {
        setLensFollowerCount(profileQuery.data?.defaultProfile.stats.totalFollowers)
    }

    const getRoundedDownLogCount = (count: Number) => {
        const len = Number(count.toExponential().split('+')[1])
        return 10 ** len
    }

    const handleCreateTwitterProof = async () => {
        if (!_identity) return
        if (!address) return
        const commitment = new Identity(_identity.toString()).getCommitment()
        const typedData = await createProofOfTwitterTypedData(commitment.toString(), address.toString(), twitterAccount)

        const createProofOfTwitter = async () => {
            const response = await fetch(ZK3_GRAPHQL_ENDPOINT, {
                method: "POST",
                headers: {
                    "x-access-token": `Bearer ${_lensAuthToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(proofOfTwitterGQL)
            })
            const data: { data: any } = await response.json()
            console.log('twitter response', data.data)

            setProofReceipt(data.data.createProofOfTwitter)

            toast({
                render: () => (
                    <Box color="white" p={3} bg="green.500" borderRadius={8}>
                        <Heading mb={2} size='md'>Create BalanceOfProof successful!</Heading>
                        <a href={`https://mumbai.polygonscan.com/tx/${data.data.createProofOfTwitter}`} target='_blank'>{`https://mumbai.polygonscan.com/tx/${data.data.createProofOfTwitter}`}</a>
                    </Box>
                ),
                duration: 10000,
                isClosable: true
            })

        }
        createProofOfTwitter()
    }

    return (
        <Box display='flex' flexDir='column' justifyItems='center'>
            <Text align='center' as='b' fontSize='5xl'>Genesis ZK3 Drop</Text>
            <Text align='center' fontSize='xl'>Generate a ZK3 Proof and mint a free NFT!</Text>
            <br />
            {selectedSocial &&
                <>
                    {selectedSocial === 'twitter' &&
                        <>
                            <Text align='center' fontSize='xl' mb={4}>Twitter</Text>
                            <Box mb={4} justifyContent='center' display='flex'>
                                {!address ?
                                    <ConnectWallet accentColor="#151c2b"
                                        colorMode="light"
                                        btnTitle="Connect Wallet"
                                    />
                                    :
                                    !profileQuery.data?.defaultProfile
                                        ?
                                        <Link href='https://sandbox.lenster.xyz/' target='_blank'>
                                            <Button variant='solid' colorScheme='twitter' color='#fff' bgColor='#1a94da'>Create Testnet Lens Profile</Button>
                                        </Link>
                                        :
                                        !twitterAccount ?
                                            <Button onClick={handleTwitterSignIn} variant='solid' colorScheme='twitter' color='#fff' bgColor='#1a94da'>Sign in with Twitter</Button>
                                            :
                                            <></>
                                }
                            </Box>
                            {twitterAccount &&
                                <>
                                    <Text mb={4} align='center'>You own {twitterAccount} on Twitter</Text>
                                    {!hasTwitterProof && <Button onClick={handleCreateTwitterProof} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>Generate Proof of {twitterAccount} Twitter handle</Button>}
                                    {hasTwitterProof &&
                                        <>                                            {/*
                                            <Box display='flex' justifyContent='center'>
                                                <Link href={`/proof/${proofReceipt}`} target='_blank'>
                                                    <Button mb={4} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>Click to view proof on ZK3 proof explorer</Button>
                                                </Link>
                                            </Box>
                                            <Text mb={4} align='center'>Share your proof on Twitter and get a free \[redacted\] on Mainnet</Text>
                                            <Box display='flex' justifyContent='center'>
                                                <a
                                                    href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                                                    className="twitter-share-button"
                                                    data-size="large"
                                                    data-text="I created a zero knowledge proof with ZK3 Protocol. Check it out on the proof explorer! Generate a proof and mint a free genesis NFT for a limited time only!"
                                                    data-url={`https://zk3-app-zk3.vercel.app/proof/${proofReceipt.txHash}`}
                                                    data-via="zk3org"
                                                    data-show-count="false"
                                                    onClick={() => setHasTweeted(true)}
                                                >
                                                </a>
                                                <script async src="https://platform.twitter.com/widgets.js"></script>
                                            </Box>
                                            <Text mb={4} align='center'>
                                                {hasTweeted ? "Thanks for sharing!" : "Please share your proof on Twitter to be eligible for the mint!"}
                                            </Text>
                                            <Button onClick={() => setHasMinted(true)} isDisabled={hasTweeted} mt={4} variant='solid' bgColor='#002add' color='#fff' colorScheme='blue'>
                                                MINT NFT
                                            </Button>*/}
                                            <Box mx={4} display='flex' justifyContent='center'>
                                                <Text mb={4} align='center'>Proof generated!</Text>

                                                <a
                                                    href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                                                    className="twitter-share-button"
                                                    data-size="large"
                                                    data-text="I created a zero knowledge proof with ZK3 Protocol. Check it out on https://zk3.io ! Generate a proof and mint a free genesis NFT for a limited time only!"
                                                    data-url={`https://zk3-app-zk3.vercel.app/genesis`}
                                                    data-via="zk3org"
                                                    data-show-count="false"
                                                    onClick={() => setHasTweeted(true)}
                                                >
                                                </a>
                                                <script async src="https://platform.twitter.com/widgets.js"></script>
                                            </Box>
                                            <Box display='flex' justifyContent='center' flexDir='column' mb={4} alignItems='center'>
                                                <Text mb={4} align='center'>Share your proof on Lens and get a free NFT:</Text>
                                                <Button mb={4} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add' onClick={setDispatcher}>Set Dispatcher</Button>
                                                <Button mb={4} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add' onClick={postToLens}>Post to Lens</Button>
                                                <Text mb={4} align='center'>Or create a post through our Lenster Fork:</Text>
                                                <Link href='https://lenster-zk3.vercel.app/' target='_blank'>
                                                    <Button mb={4} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>Go to Lenster ZK3 Edition</Button>
                                                </Link>
                                            </Box>
                                        </>
                                    }
                                </>

                            }
                        </>
                    }
                </>
            }
            {hasMinted &&
                <>
                    <Text align='center' size='xl'>Your ZK3 Tokyo Genesis NFT:</Text>
                    <Image alt='zk3 Logo' src={TGP} height={500} width={500} style={{ objectFit: 'contain', marginRight: '0px' }}></Image>
                </>
            }
        </Box>
    );
}