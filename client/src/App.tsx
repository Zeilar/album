import { Box, Flex } from "@chakra-ui/react";
import Router from "./Router";

export default function App() {
    return (
        <Box bgColor="gray.800" minH="100vh" color="whiteAlpha.900" px="1rem">
            <Flex flexDir="column" maxW="60rem" mx="auto">
                <Router />
            </Flex>
        </Box>
    );
}
