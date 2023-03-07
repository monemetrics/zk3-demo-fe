import { Web3Button } from "@thirdweb-dev/react";
import React, { useState } from "react";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../../const/contracts";
import { useCreatePost } from "../../lib/useCreatePost";
import { Input, Textarea, Select, Radio, RadioGroup, HStack, FormLabel } from "@chakra-ui/react";

export default function CreatePost() {
    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const { mutateAsync: createPost } = useCreatePost();

    console.log("content:", {
        image,
        title,
        description,
        content,
    });

    return (
        <div>
            <div>
                {/* Input for the image */}
                <div>
                    <Input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files) {
                                setImage(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                {/* Input for the title */}
                <div>
                    <Input
                        type="text"
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div>
                    <Textarea
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Content */}
                <div>
                    <Textarea
                        placeholder="Content"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                {/* Post or Comment */}

                <div>
                    <RadioGroup name='type' defaultValue='Post'>
                        <HStack spacing='24px'>
                            <Radio value='Post'>Post</Radio>
                            <Radio value='Comment' isDisabled={true}>Comment</Radio>
                        </HStack>
                    </RadioGroup>
                </div>

                {/* Attached Proof */}

                <div>
                    <Select name='proof' placeholder='No Proof selected'>
                        <option>proof 1</option>
                    </Select>
                </div>

                <Web3Button
                    contractAddress={LENS_CONTRACT_ADDRESS}
                    contractAbi={LENS_CONTRACT_ABI}
                    action={async () => {
                        if (!image) return;

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
            </div>
        </div>
    );
}