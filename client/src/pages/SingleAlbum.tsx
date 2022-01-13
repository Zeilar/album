import {
    Box,
    Button,
    Checkbox,
    Flex,
    Icon,
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
import { useNavigate, useParams } from "react-router";
import { Album } from "../@types/album";
import UploadZone from "../components/UploadZone";
import useAuth from "../hooks/useAuth";
import { ApiService } from "../services/ApiService";
import MdiIcon from "@mdi/react";
import { mdiFullscreen } from "@mdi/js";

export default function SingleAlbum() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [album, setAlbum] = useState<Album>();
    const { authenticated, userId } = useAuth();
    const editModal = useDisclosure();
    const fullscreenModal = useDisclosure();
    const toast = useToast();
    const [likedPhotos, setLikedPhotos] = useState<string[]>([]);
    const navigate = useNavigate();
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

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

    function toggleLike(photo: string) {
        if (likedPhotos.includes(photo)) {
            setLikedPhotos(p => p.filter(p => p !== photo));
        } else {
            setLikedPhotos(p => [...p, photo]);
        }
    }

    function toggleCheck(
        e: React.ChangeEvent<HTMLInputElement>,
        photo: string
    ) {
        const { checked } = e.target;
        if (checked) {
            setSelectedPhotos(p => [...p, photo]);
        } else {
            setSelectedPhotos(p => p.filter(p => p !== photo));
        }
    }

    async function createFromSelection() {
        const { ok, data } = await ApiService.fetch<{ id: string }>(
            "/albums/selection",
            { method: "POST" },
            { title: album?.title, photos: selectedPhotos }
        );
        if (ok) {
            navigate(`/albums/${data?.id}`);
        } else {
            toast({
                position: "top",
                status: "error",
                title: "Failed creating album",
            });
        }
    }

    async function rateAlbum() {
        const { ok, data } = await ApiService.fetch<{ id: string }>(
            `/albums/${id}/rate`,
            { method: "POST" },
            {
                title: album?.title,
                photos: likedPhotos,
            }
        );
        if (ok) {
            navigate(`/albums/${data?.id}`);
        } else {
            toast({
                position: "top",
                status: "error",
                title: "Failed rating album",
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
                    {selectedPhotos.length > 0 && (
                        <Button
                            onClick={createFromSelection}
                            w="fit-content"
                            colorScheme="blue"
                        >
                            Create new album from selection
                        </Button>
                    )}
                </>
            )}
            {likedPhotos.length > 0 && (
                <Button colorScheme="blue" onClick={rateAlbum} w="fit-content">
                    Finish rating album
                </Button>
            )}
            {fullscreenPhoto && (
                <Modal
                    isOpen={fullscreenModal.isOpen}
                    onClose={fullscreenModal.onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody>
                            <Image src={fullscreenPhoto} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            <Text fontSize="2rem" fontWeight="bold">
                {album.title}
            </Text>
            <Flex flexWrap="wrap" gridGap="0.5rem">
                {album.photos.map((photo, i) => (
                    <Box h="fit-content" key={i} pos="relative">
                        <Image objectFit="cover" maxW="10rem" src={photo} />
                        <Flex bgColor="gray.900" alignItems="center">
                            <Button
                                w="3rem"
                                h="3rem"
                                variant="unstyled"
                                onClick={() => toggleLike(photo)}
                                bgColor={
                                    likedPhotos.includes(photo)
                                        ? "gold"
                                        : undefined
                                }
                            >
                                👍
                            </Button>
                            <Button
                                w="3rem"
                                h="3rem"
                                variant="unstyled"
                                onClick={() => {
                                    setFullscreenPhoto(photo);
                                    fullscreenModal.onOpen();
                                }}
                            >
                                <Icon as={MdiIcon} path={mdiFullscreen} />
                            </Button>
                            {userId === album.owner && (
                                <Checkbox
                                    defaultChecked={selectedPhotos.includes(
                                        photo
                                    )}
                                    onChange={e => toggleCheck(e, photo)}
                                />
                            )}
                        </Flex>
                    </Box>
                ))}
            </Flex>
        </Stack>
    );
}
