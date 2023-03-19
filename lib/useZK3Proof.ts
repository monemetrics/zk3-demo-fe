import { useState, useEffect, useContext } from "react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, verifyProof, FullProof } from "@semaphore-protocol/proof"
import { keccak256 } from "ethers/lib/utils"

interface circle {
    id: string
    members: string[]
    name: string
    description: string
    contentURI: string
}

const useZK3Proof = () => {
    const [status, setStatus] = useState<string>("no proof")
    const [identity, setIdentity] = useState<Identity | null>()
    const [circle, setCircle] = useState<circle>()
    const [group, setGroup] = useState<Group | null>()
    const [proof, setProof] = useState<FullProof | null>()
    const [signal, setSignal] = useState<string | null>()

    function setProofArgs(_identity: Identity, _circle: circle, _signal: string) {
        if (_identity && _circle && _signal) {
            console.log("generating proof: ", _circle, _signal)
            setIdentity(_identity)
            setCircle(_circle)
            setSignal(_signal)
        }
    }

    const generateFullProof = async () => {
        if (!identity) return
        if (!circle) return
        if (!signal) return
        generateGroupFromCircle(circle)
        if (!group) return
        const externalNullifier = group.root
        const hashedPostBody = keccak256(Buffer.from(signal));
        const fullProof = await generateProof(identity, group, externalNullifier, hashedPostBody)
        const success = await verifyProof(fullProof, 20)
        if (success) {
            setProof(fullProof)
            console.log('proof generated successfully: ', fullProof)
        }
        else
            console.log('error: proof construction failed')
        // todo: actually attach proof to post and send it (after testing that the proof is ok!)
    }

    function generateGroupFromCircle(_circle: circle) {
        const _group = new Group(_circle.id)
        _group.addMembers(_circle.members)
        setGroup(_group)
    }

    return {
        status,
        setProofArgs,
        generateFullProof
    }
}

export default useZK3Proof
