import { BigNumber } from "ethers"

export async function createBalanceOfProofTypedData(
    identityCommitment: string,
    ethAddress: string,
    balance: BigNumber
) {
    const domain = {
        name: "Zk3 Verify",
        version: "1",
        chainId: 137,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
    }

    const types = {
        BalanceOf: [
            { name: "identityCommitment", type: "string" },
            { name: "ethAddress", type: "address" },
            { name: "balance", type: "uint256" }
        ]
    }

    const value = {
        identityCommitment,
        ethAddress,
        balance
    }

    return {
        domain,
        types,
        value
    }
}
