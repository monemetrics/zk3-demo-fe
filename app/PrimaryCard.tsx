import React from 'react'
import { Flex, Card, CardHeader, CardBody, Text, Avatar, Stack } from "@chakra-ui/react"
import Image from 'next/image'
import twitterLogo from '../public/twitter.png'
import lensLogo from '../public/lens.jpg'
import discordLogo from '../public/discord.png'
import telegramLogo from '../public/telegram.png'
import ethereumLogo from '../public/ethereum.png'
import githubLogo from '../public/github.png'
import plusIcon from '../public/plus.png'

export default function PrimaryCard(props: { name: string, text: string, logo: string }) {
    return (
        <Card _hover={{
            background: "white",
            color: "blue.500",
            cursor: "pointer"
        }}>
            <CardBody>
                <Stack direction='row'>
                    <Image alt='logo' src={props.logo=='Github' ? githubLogo : props.logo=='Lens' ? lensLogo : props.logo=='Twitter' ? twitterLogo : props.logo=='Discord' ? discordLogo : props.logo=='Telegram' ? telegramLogo : props.logo=='Ethereum' ? ethereumLogo : plusIcon} height={40} width={40} style={{objectFit:'contain', marginRight: '12px', width: 'auto'}}></Image>
                    <Stack direction='column'>
                        <Text fontWeight='bold'>{props.name}</Text>
                        <Text>{props.text}</Text>
                    </Stack>
                </Stack>
            </CardBody>
        </Card>)
}