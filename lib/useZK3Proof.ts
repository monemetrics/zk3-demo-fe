import { useState, useEffect, useContext } from "react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, verifyProof, FullProof } from "@semaphore-protocol/proof"
import { keccak256 } from "ethers/lib/utils"
import { utils } from "ethers"

interface circle {
    id: string
    members: string[]
    name: string
    description: string
    contentURI: string
}

const useZK3Proof = () => {

    const generateFullProof = async (_identity: Identity, _circle: circle, _signal: string) => {
        console.log("start generateFullProof")
        if (_identity && _circle && _signal) {
            console.log("generating proof: ", _circle, _signal)
        }
        else {
            console.log("generateFullProof: failed argument check: ", _identity, _circle, _signal)
            return
        }
        const group = generateGroupFromCircle(_circle)
        if (!group) {
            console.log("no group")
            return
        }
        console.log("generateFullProof: passed all return checks")
        const externalNullifier = group.root
        const hashedPostBody = utils.formatBytes32String(_signal)
        const fullProof = await generateProof(_identity, group, externalNullifier, hashedPostBody)
        console.log("fullProof: ", fullProof)
        const success = await verifyProof(fullProof, 20)
        console.log("isSuccess: ", success)
        if (success) {
            console.log("proof generated successfully: ", fullProof)
        } else console.log("error: proof construction failed")
        // todo: actually attach proof to post and send it (after testing that the proof is ok!)
    }

    function generateGroupFromCircle(_circle: circle) {
        const _group = new Group(_circle.id)
        _group.addMembers(_circle.members)
        console.log("group: ", _group)
        return _group
    }

    return {
        generateFullProof
    }
}

export default useZK3Proof
