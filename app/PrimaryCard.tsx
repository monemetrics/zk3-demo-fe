import React from 'react'
import { Flex, Card, CardHeader, CardBody, Text, Avatar, Stack } from "@chakra-ui/react"
import Image from 'next/image'
import twitterLogo from '../public/twitter.png'
import lensLogo from '../public/lens.jpg'
import discordLogo from '../public/discord.png'
import telegramLogo from '../public/telegram.png'
import ethereumLogo from '../public/ethereum.jpg'
import plusIcon from '../public/plus.png'

export default function PrimaryCard(props: { name: string, text: string }) {
    return (
        <Card _hover={{
            background: "white",
            color: "blue.500",
            cursor: "pointer"
        }}>
            <CardBody>
                <Stack direction='row'>
                    <Image alt='logo' src={props.name=='Lens' ? lensLogo : props.name=='Twitter' ? twitterLogo : props.name=='Discord' ? discordLogo : props.name=='Telegram' ? telegramLogo : props.name=='Ethereum' ? ethereumLogo : plusIcon} height={40} width={40} style={{objectFit:'contain', marginRight: '12px'}}></Image>
                    <Stack direction='column'>
                        <Text fontWeight='bold'>{props.name}</Text>
                        <Text>{props.text}</Text>
                    </Stack>
                </Stack>
            </CardBody>
        </Card>)
}