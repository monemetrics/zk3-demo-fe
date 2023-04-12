import { BigNumber } from "ethers"

export async function createBalanceOfProofTypedDataSecondarySig(
    identityCommitment: string,
    ethAddress: string,
    balance: BigNumber
) {
    const domain = {
        name: "Zk3 Verify",
        version: "1",
        chainId: 80001,
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

export async function createBalanceOfProofDoubleSignedTypedData(
  identityCommitment: string,
  ethAddress: string,
  balance: BigNumber,
  signature: string // this is the signature by the secondary signer, not the primary signer
) {
  const domain = {
    name: "Zk3 Verify",
    version: "1",
    chainId: 80001,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  };

  const types = {
    BalanceOf: [
      { name: "identityCommitment", type: "string" },
      { name: "ethAddress", type: "address" },
      { name: "balance", type: "uint256" },
      { name: "signature", type: "string" },
    ],
  };

  const value = {
    identityCommitment,
    ethAddress,
    balance,
    signature,
  };

  return {
    types,
    domain,
    value,
  };
}

export async function createGithubRepoOwnerProofTypedData(
    identityCommitment: string,
    ethAddress: string,
    repoName: string
  ) {
    const domain = {
      name: "Zk3 Verify",
      version: "1",
      chainId: 80001,
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    };
  
    const types = {
      BalanceOf: [
        { name: "identityCommitment", type: "string" },
        { name: "ethAddress", type: "address" },
        { name: "repoName", type: "string" },
      ],
    };
  
    const value = {
      identityCommitment,
      ethAddress,
      repoName,
    };
  
    return {
      types,
      domain,
      value,
    };
  }