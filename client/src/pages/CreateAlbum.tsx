import { Box, Stack, Text } from "@chakra-ui/layout";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { CSSProperties, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router";
import { ApiService } from "../services/ApiService";

const style: CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    borderWidth: 2,
    borderStyle: "dashed",
    outline: "none",
    transition: "border 0.25s ease-in-out",
    cursor: "pointer",
};

export default function CreateAlbum() {
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState<null | string>(null);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
    });
    const navigate = useNavigate();

    async function upload() {
        const formData = new FormData();
        formData.append("title", title as string);
        acceptedFiles.forEach(file => {
            formData.append("photos", file);
        });
        setSubmitting(true);
        const response = await fetch(`${ApiService.BASE_URL}/albums`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        setSubmitting(false);
        if (response.ok) {
            const data = await response.json();
            navigate(`/albums/${data.id}`);
        }
    }

    const titleError = title === "";

    return (
        <Stack spacing={4} alignItems="flex-start">
            <FormControl isInvalid={titleError}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                    id="title"
                    value={title ?? ""}
                    onChange={e => setTitle(e.target.value)}
                />
                {titleError && (
                    <FormErrorMessage>Title is required.</FormErrorMessage>
                )}
            </FormControl>
            <Box {...getRootProps({ style })}>
                <input {...getInputProps()} />
                {acceptedFiles.length === 0 ? (
                    <Text>Drop your photos here or click to select them</Text>
                ) : (
                    <Text>{acceptedFiles.length} photos</Text>
                )}
            </Box>
            <Button
                isLoading={submitting}
                colorScheme="blue"
                onClick={upload}
                disabled={acceptedFiles.length === 0}
            >
                Upload
            </Button>
        </Stack>
    );
}
