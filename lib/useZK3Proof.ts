import { useState, useEffect, useContext } from "react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, verifyProof, FullProof } from "@semaphore-protocol/proof"
import { keccak256 } from "ethers/lib/utils"
import { BigNumber, utils } from "ethers"

interface circle {
    id: string
    members: string[]
    name: string
    description: string
    contentURI: string
}

const useZK3Proof = () => {
    const generateFullProof = async (_identity: Identity, _circle: circle, _signal: string) => {
        console.log("start generateFullProof", _identity)
        if (_identity && _circle && _signal) {
            console.log("generating proof: ", _circle, _signal)
        } else {
            console.log("generateFullProof: failed argument check: ", _identity, _circle, _signal)
            return
        }
        const group = generateGroupFromCircle(_circle)
        if (!group) {
            console.log("no group")
            return
        }
        console.log("generateFullProof: passed all return checks")
        // check if identity is part of the group
        if (!group.indexOf(_identity.commitment.toString())) {
            console.log("identity is not part of the group", _identity.commitment, group.members)
            return
        }
        const externalNullifier = group.root
        const hashedPostBody = BigNumber.from(keccak256(Buffer.from(_signal)))
        // const merkleProof = await group.generateMerkleProof(group.indexOf(_identity.commitment))
        console.log("root: ", group.root)
        const fullProof = await generateProof(_identity, group, externalNullifier, hashedPostBody)
        console.log("fullProof: ", fullProof)

        const success = await verifyProof(fullProof, 20)
        console.log("isSuccess: ", success)
        // todo: actually attach proof to post and send it (after testing that the proof is ok!)
        return { proof: fullProof, group }
    }

    function generateGroupFromCircle(_circle: circle) {
        console.log("generateGroupFromCircle: ", _circle)
        const _group = new Group(_circle.id)
        console.log("roop pre adding members: ", _group.root)
        console.log("circle Members: ", _circle.members)
        _group.addMembers(_circle.members)
        console.log("group: ", _group)
        console.log("group root: ", _group.root)
        return _group
    }

    return {
        generateFullProof
    }
}

export default useZK3Proof
