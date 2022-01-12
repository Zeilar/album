import {
    Box,
    Flex,
    Image,
    Link,
    Spinner,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { Album } from "../@types/album";
import useAuth from "../hooks/useAuth";
import { ApiService } from "../services/ApiService";

export default function MyAlbums() {
    const { authenticated } = useAuth();
    const [albums, setAlbums] = useState<Album[]>([]);
    const toast = useToast();

    useEffect(() => {
        if (!authenticated) {
            return;
        }
        (async () => {
            const albumsQuery = await ApiService.fetch<Album[]>("/albums");
            if (albumsQuery.ok && albumsQuery.data) {
                setAlbums(albumsQuery.data);
            }
        })();
    }, [authenticated]);

    if (authenticated === null) {
        return <Spinner mx="auto" color="blue" />;
    }

    if (authenticated === false) {
        toast({
            status: "error",
            position: "top",
            title: "You must be logged in to do that",
        });
        return <Navigate to="/" />;
    }

    function renderAlbums(albums: Album[]) {
        return albums.map((album) => (
            <Stack spacing={2} key={album.id} mb="1rem">
                <Link
                    w="fit-content"
                    as={RouterLink}
                    fontSize="1.5rem"
                    fontWeight="semibold"
                    to={`/albums/${album.id}`}
                >
                    {album.title}
                </Link>
                <Flex overflowX="auto" gridGap="0.25rem" py="0.25rem">
                    {album.photos.map((photo, i) => (
                        <Box flexShrink={0} key={i}>
                            <Image
                                src={photo}
                                w="5rem"
                                h="5rem"
                                objectFit="cover"
                            />
                        </Box>
                    ))}
                </Flex>
            </Stack>
        ));
    }

    return (
        <Stack spacing={4}>
            <Text fontSize="2rem" fontWeight="bold">
                Albums
            </Text>
            <Tabs>
                <TabList>
                    <Tab>All</Tab>
                    <Tab>Rated</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>{renderAlbums(albums)}</TabPanel>
                    <TabPanel px={0}>
                        {renderAlbums(
                            albums.filter((album) => album.rated === true)
                        )}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    );
}
