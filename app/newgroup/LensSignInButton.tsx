import {
  useAddress,
  useNetworkMismatch,
  useNetwork,
  ConnectWallet,
  ChainId,
  MediaRenderer,
} from "@thirdweb-dev/react";
import React, { useEffect, useContext } from "react";
import useLensUser from "../../lib/auth/useLensUser";
import useLogin from "../../lib/auth/useLogin";
import { Button, HStack, Text, Box } from "@chakra-ui/react";
import ZK3Context from "../../context/ZK3Context";
type Props = {};

export default function LensSignInButton({ }: Props) {
  const address = useAddress(); // Detect the connected address
  const isOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
  const [, switchNetwork] = useNetwork(); // Function to switch the network.
  const { isSignedInQuery, profileQuery } = useLensUser();
  const { mutate: requestLogin } = useLogin();
  const { _lensAuthToken, setLensAuthToken } = useContext(ZK3Context);

  useEffect(() => {
    const handleStorage = () => {
      isSignedInQuery.refetch()
      const temp = localStorage.getItem("LH_STORAGE_KEY")
      if (temp)
        setLensAuthToken(JSON.parse(temp).accessToken)
    }

    window.addEventListener('lens storage', handleStorage)
    return () => window.removeEventListener('lens storage', handleStorage)
  }, [])

  // 1. User needs to connect their wallet
  if (!address) {
    return <ConnectWallet accentColor="#151c2b"
      colorMode="light"
      btnTitle="Connect Wallet"
    />;
  }

  // 2. User needs to switch network to Polygon
  if (isOnWrongNetwork) {
    return (
      <Button variant='solid' colorScheme='black' color='#151c2b' bgColor='#fff' onClick={() => switchNetwork?.(ChainId.Mumbai)}>
        Switch Network
      </Button>
    );
  }

  // Loading their signed in state
  if (isSignedInQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // If the user is not signed in, we need to request a login
  if (!isSignedInQuery.data) {
    return <Button variant='solid' colorScheme='green' color='#00501e' bgColor='#abfe2c' onClick={() => requestLogin()}>Sign in with Lens</Button>;
  }

  // Loading their profile information
  if (profileQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // If it's done loading and there's no default profile
  if (!profileQuery.data?.defaultProfile) {
    return <Box bgColor='#fff' p='1' borderRadius='8px' mr='2'>No Lens Profile</Box>;
  }

  // If it's done loading and there's a default profile
  if (profileQuery.data?.defaultProfile) {
    return (
      <HStack bgColor='#fff' p='1' borderRadius='8px' mr='2' borderColor='#151c2b' borderWidth={2}>
        <Text color='#1e2d52'>{profileQuery.data?.defaultProfile.handle}</Text>
        <MediaRenderer
          // @ts-ignore
          src={profileQuery?.data?.defaultProfile?.picture?.original?.url || ""}
          alt={profileQuery.data.defaultProfile.name || ""}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            borderWidth: 2,
            border: 'solid',
            borderColor: '#1e2d52'
          }}
        />
      </HStack>
    );
  }

  return <div>Something went wrong.</div>;
}