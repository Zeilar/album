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

interface Props {
    onSubmit(title: string, photos: File[]): Promise<void>;
}

export default function UploadZone({ onSubmit }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState<null | string>(null);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
    });

    const titleError = title === "";

    async function submit() {
        setSubmitting(true);
        await onSubmit(title as string, acceptedFiles);
        setSubmitting(false);
    }

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
                onClick={submit}
                disabled={acceptedFiles.length === 0}
            >
                Upload
            </Button>
        </Stack>
    );
}
