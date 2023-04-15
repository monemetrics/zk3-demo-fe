'use client'
import { Box, Text, HStack, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useContext } from "react";
import useLensUser from "../../../lib/auth/useLensUser";
import LensSignInButton from "../../newgroup/LensSignInButton";
import ZK3Context from "../../../context/ZK3Context";
import { createProofOfTwitterTypedData } from "../../../lib/ZK3helpers";
import { useAccount } from "@thirdweb-dev/react";
import { Identity } from "@semaphore-protocol/identity";

export default function Page() {
    const [selectedSocial, setSelectedSocial] = useState<'twitter' | 'lens' | null>(null)
    const { isSignedInQuery, profileQuery } = useLensUser();
    const [lensFollowerCount, setLensFollowerCount] = useState<Number | null>(null)
    const [twitterAccount, setTwitterAccount] = useState<any>(null)
    const [proofReceipt, setProofReceipt] = useState<any>(null)
    const [hasTweeted, setHasTweeted] = useState<boolean>(false)
    const address = useAccount()
    const { _identity } = useContext(ZK3Context)

    const proofOfTwitterGQL = {
        operationName: "createProofOfTwitter",
        query: `
        mutation Mutation($identityCommitment: String!, $ethAddress: String!, $twitterHandle: String!, $signature: String) {
            createProofOfTwitter(identityCommitment: $identityCommitment, ethAddress: $ethAddress, twitterHandle: $twitterHandle, signature: $signature)
          }
    `};
    const proofOfLensGQL = {
        operationName: "createProofOfLens",
        query: `
        mutation CreateProofOfLens($identityCommitment: String!, $ethAddress: String!, $lensId: String!, $linkedEoaSig: String, $secondaryEoaAddress: String, $secondaryEoaSig: String) {
            createProofOfLens(identityCommitment: $identityCommitment, ethAddress: $ethAddress, lensId: $lensId, linkedEOASig: $linkedEoaSig, secondaryEOAAddress: $secondaryEoaAddress, secondaryEOASig: $secondaryEoaSig)
          }
    `};

    // todo: implement
    const handleTwitterSignIn = () => {
        window.open('https://dev.zk3.io/webhooks/twitter/signing?ethAddress=%3Caddress%3E')
        setTwitterAccount('@0xcandle')
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
        const commitment = new Identity(_identity.toString()).getCommitment()
        const typedData = await createProofOfTwitterTypedData(commitment.toString(), address.toString(), twitterAccount)
    }

    return (
        <Box display='flex' flexDir='column' justifyItems='center'>
            <Text align='center' as='b' fontSize='5xl'>Genesis ZK3 Drop</Text>
            <Text align='center' fontSize='xl'>Generate a ZK3 Proof and mint a free NFT!</Text>
            <br />
            <Text align='center' fontSize=''>Please which type of social proof you would like to generate:</Text>
            <HStack justifyContent='space-evenly' my={4}>
                <Button onClick={() => setSelectedSocial('twitter')} variant='outline' colorScheme='twitter' color={selectedSocial === 'twitter' ? '#fff' : '#1a94da'} bgColor={selectedSocial === 'twitter' ? '#1a94da' : ''}>Twitter</Button>
                <Button onClick={() => setSelectedSocial('lens')} variant='outline' colorScheme='green' color='#00501e' bgColor={selectedSocial === 'lens' ? '#abfe2c' : ''}>Lens</Button>
            </HStack>
            {selectedSocial &&
                <>
                    {selectedSocial === 'twitter' &&
                        <>
                            <Text align='center' fontSize='xl'>Twitter</Text>
                            <Box mb={4} justifyContent='center' display='flex'>
                                <Button onClick={handleTwitterSignIn} variant='solid' colorScheme='twitter' color='#fff' bgColor='#1a94da'>Sign in with Twitter</Button>
                            </Box>
                            {twitterAccount &&
                                <>
                                    <Text mb={4} align='center'>You own {twitterAccount} on Twitter</Text>
                                    <Button onClick={handleCreateTwitterProof} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>Generate Proof of {twitterAccount} Twitter handle</Button>
                                    {proofReceipt &&
                                        <>
                                            <Text mb={4} align='center'>Proof generated!</Text>
                                            <Link href={`/proof/${proofReceipt.txHash}`} target='_blank'>
                                                <Button mb={4} variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>Click to view proof on ZK3 proof explorer</Button>
                                            </Link>
                                            <Text mb={4} align='center'>Share your proof on Twitter and get a free genesis NFT!</Text>
                                            <a
                                                href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                                                className="twitter-share-button"
                                                data-size="large"
                                                data-text="I created a zero knowledge proof with ZK3 Protocol. Check it out on the proof explorer! Generate a proof and mint a free genesis NFT for a limited time only!"
                                                data-url={`https://zk3-app-zk3.vercel.app/proof/${proofReceipt.txHash}`}
                                                data-via="zk3org"
                                                data-show-count="false"
                                            >
                                            </a>
                                            <script async src="https://platform.twitter.com/widgets.js"></script>
                                            <Text mb={4} align='center'>
                                                {hasTweeted ? "Thanks for sharing!" : "Please share your proof on Twitter to be eligible for the mint!"}
                                            </Text>
                                            <Button isDisabled={!hasTweeted} mt={4} variant='solid' bgColor='#002add' color='#fff' colorScheme='blue'>
                                                MINT NFT
                                            </Button>
                                        </>
                                    }
                                </>

                            }
                        </>
                    }
                    {selectedSocial === 'lens' &&
                        <>
                            <Text mb={4} align='center' fontSize='xl'>Lens</Text>
                            <Box mb={4} justifyContent='center' display='flex'>
                                <LensSignInButton></LensSignInButton>
                            </Box>
                            {lensFollowerCount &&
                                <>
                                    <Text mb={4} align='center'>You have {lensFollowerCount.toString()} followers on Lens</Text>
                                    <Button variant='solid' colorScheme='blue' color='#fff' bgColor='#002add'>Generate Proof of {`>= ${getRoundedDownLogCount(lensFollowerCount)}`} followers</Button>
                                </>
                            }
                        </>
                    }
                </>
            }
        </Box>
    );
}