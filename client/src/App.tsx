import { Flex } from "@chakra-ui/react";
import Router from "./Router";

export default function App() {
    return (
        <Flex
            bgColor="gray.800"
            minH="100vh"
            color="whiteAlpha.900"
            flexDir="column"
        >
            <Router />
        </Flex>
    );
}
