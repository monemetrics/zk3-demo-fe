import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { Button } from "@chakra-ui/react"

export default function Profile() {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    if (isConnected)
        return (
            <div>
                <Button colorScheme='yellow' onClick={() => disconnect()}>{address?.substring(0, 5) + '...' + address?.substring(address.length - 3, address.length)}</Button>
            </div>
        )
    return <Button colorScheme='yellow' onClick={() => connect()}>Connect Wallet</Button>
}