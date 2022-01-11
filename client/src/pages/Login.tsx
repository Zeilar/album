import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const emailError = email === "";
    const passwordError = password === "";

    return (
        <Stack spacing={4} maxW="50rem" m="auto" as="form" onSubmit={undefined}>
            <Text fontSize="1.5rem">Login</Text>
            <FormControl isInvalid={emailError}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                    id="email"
                    type="email"
                    value={email ?? ""}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                    <FormErrorMessage>Email is required.</FormErrorMessage>
                )}
            </FormControl>
            <FormControl isInvalid={passwordError}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                    id="password"
                    type="password"
                    value={password ?? ""}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                    <FormErrorMessage>Password is required.</FormErrorMessage>
                )}
            </FormControl>
            <Button colorScheme="blue" type="submit" w="fit-content">
                Login
            </Button>
        </Stack>
    );
}