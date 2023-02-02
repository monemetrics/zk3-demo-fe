import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { Button } from "@chakra-ui/react"

export default function Profile() {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    if (isConnected)
        return (
                <Button colorScheme='yellow' onClick={() => disconnect()}>{address?.substring(0, 5) + '...' + address?.substring(address.length - 3, address.length)}</Button>
        )
    return <Button colorScheme='yellow' onClick={() => connect()}>Connect Wallet</Button>
}