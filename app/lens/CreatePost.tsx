import { Web3Button } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../../const/contracts";
import { useCreatePost } from "../../lib/useCreatePost";
import { Input, Textarea, Select, Radio, RadioGroup, HStack, FormLabel, Box } from "@chakra-ui/react";

export default function CreatePost() {
    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const { mutateAsync: createPost } = useCreatePost();
    const [ proofs, setProofs ] = useState([])

    useEffect(() => {
        const myCircleList_string = localStorage.getItem('myCircleList')
        if (myCircleList_string)
        {
            const myCircleList = JSON.parse(myCircleList_string)
            setProofs(myCircleList)
        }
    }, [])

    // console.log("content:", {
    //     image,
    //     title,
    //     description,
    //     content,
    // });

    return (
        <Box>
            <Box>
                {/* Input for the image */}
                {/*<Box>
                    <Input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files) {
                                setImage(e.target.files[0]);
                            }
                        }}
                    />
                    </Box>*/}

                {/* Input for the title */}
                <Box mb={2}>
                    <Input
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Box>

                {/* Description */}
                <Box mb={2}>
                    <Textarea
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Box>

                {/* Content */}
                <Box mb={2}>
                    <Textarea
                        placeholder="Content"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Box>

                {/* Post or Comment */}

                {/*<Box>
                    <RadioGroup name='type' defaultValue='Post'>
                        <HStack spacing='24px'>
                            <Radio value='Post'>Post</Radio>
                            <Radio value='Comment' isDisabled={true}>Comment</Radio>
                        </HStack>
                    </RadioGroup>
                    </Box>*/}

                {/* Attached Proof */}

                <Box mb={2}>
                    <Select name='proof' placeholder='No Proof selected'>
                        {proofs.map((e: any) => {
                            return <option>{e.description}</option> 
                        })}
                    </Select>
                </Box>

                <Web3Button
                    accentColor="#002add"
                    contractAddress={LENS_CONTRACT_ADDRESS}
                    contractAbi={LENS_CONTRACT_ABI}
                    action={async () => {
                        //if (!image) return;

                        return await createPost({
                            image,
                            title,
                            description,
                            content,
                        });
                    }}
                >
                    Create Post
                </Web3Button>
            </Box>
        </Box>
    );
}