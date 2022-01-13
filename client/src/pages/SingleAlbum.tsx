import {
    Button,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Stack,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Album } from "../@types/album";
import UploadZone from "../components/UploadZone";
import useAuth from "../hooks/useAuth";
import { ApiService } from "../services/ApiService";

export default function SingleAlbum() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [album, setAlbum] = useState<Album>();
    const { authenticated, userId } = useAuth();
    const editModal = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        if (!id) {
            return;
        }
        (async () => {
            setLoading(true);
            const { ok, data } = await ApiService.fetch<Album>(`/albums/${id}`);
            if (ok && data) {
                setAlbum(data);
            }
            setLoading(false);
        })();
    }, [id]);

    if (loading) {
        return <Spinner mx="auto" />;
    }

    if (!album) {
        return <Text>Album not found.</Text>;
    }

    async function editAlbum(title: string, photos: File[]) {
        const formData = new FormData();
        formData.append("title", title);
        photos.forEach(photo => {
            formData.append("photos", photo);
        });
        const response = await fetch(`${ApiService.BASE_URL}/albums/${id}`, {
            method: "PUT",
            body: formData,
            credentials: "include",
        });
        const data: { title: string; photos: string[] } = await response.json();
        if (response.ok && data) {
            setAlbum(album => (album ? { ...album, ...data } : undefined));
            editModal.onClose();
        } else {
            toast({
                position: "top",
                status: "error",
                title: "Could not edit album",
            });
        }
    }

    return (
        <Stack spacing={4}>
            {authenticated && album.owner === userId && (
                <>
                    <Button
                        w="fit-content"
                        colorScheme="blue"
                        onClick={editModal.onOpen}
                    >
                        Edit
                    </Button>
                    <Modal
                        isOpen={editModal.isOpen}
                        onClose={editModal.onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Edit album {album.title}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <UploadZone onSubmit={editAlbum} />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </>
            )}
            <Text fontSize="2rem" fontWeight="bold">
                {album.title}
            </Text>
            <Flex flexWrap="wrap" gridGap="0.5rem">
                {album.photos.map((photo, i) => (
                    <Image objectFit="cover" maxW="10rem" src={photo} key={i} />
                ))}
            </Flex>
        </Stack>
    );
}
