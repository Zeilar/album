import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [password, setPassword] = useState<string | null>(null);
    const toast = useToast();
    const { register } = useAuth();

    const emailError = email === "";
    const passwordError = password === "";

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        setSubmitting(true);
        const { ok } = await register(email, password);
        setSubmitting(false);
        toast({
            position: "top",
            title: ok ? "Registration successful" : "Registration failed",
            status: ok ? "success" : "error",
        });
        if (ok) {
            navigate("/");
        }
    }

    return (
        <Stack spacing={4} maxW="50rem" m="auto" as="form" onSubmit={submit}>
            <Text fontSize="1.5rem">Register</Text>
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
            <Button
                colorScheme="blue"
                type="submit"
                w="fit-content"
                isLoading={submitting}
            >
                Register
            </Button>
        </Stack>
    );
}
