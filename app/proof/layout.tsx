'use client'
import { useState } from "react"
import { SearchIcon } from "@chakra-ui/icons"
import { Box, Divider, Heading, Input, InputGroup, InputLeftAddon, InputRightElement } from "@chakra-ui/react"

export default function ProofLayout({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchProof = () => {
        console.log(searchQuery)
        window.open('/proof/' + searchQuery, '_self')
    }
    return (
        <Box>
            <Heading textAlign='center' mb={4}>Proof Explorer</Heading>
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSearchProof()
                }}>
                <InputGroup mb={4}>
                    <InputLeftAddon children='zk3://proof/' />
                    <Input type='text' name='id' placeholder="Search proof id..." onChange={(e) => setSearchQuery(e.target.value)}>

                    </Input>
                    <InputRightElement onClick={handleSearchProof} children={<SearchIcon color='#002add' />} />
                </InputGroup>
            </form>
            {children}
        </Box>
    )
}