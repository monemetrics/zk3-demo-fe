'use client'
import { useState } from "react"
import { SearchIcon } from "@chakra-ui/icons"
import { Box, Divider, Heading, Input, InputGroup, InputLeftAddon, InputRightElement } from "@chakra-ui/react"

export default function ProofLayout({ children }: { children: React.ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearchProof = () => {
        console.log(searchQuery)
        window.open('http://localhost:3000/proof/' + searchQuery, '_self')
    }
    return (
        <Box>
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSearchProof()
                }}>
                <InputGroup mb={4}>
                    <InputLeftAddon children='zk3://proof/' />
                    <Input type='text' name='id' placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)}>

                    </Input>
                    <InputRightElement onClick={handleSearchProof} children={<SearchIcon color='#002add' />} />
                </InputGroup>
            </form>
            {children}
        </Box>
    )
}