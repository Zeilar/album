import { useToast } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ApiService, Response } from "../services/ApiService";

type Authenticated = boolean | null;

interface IAuthContext {
    authenticated: Authenticated;
    userId: string | null;
    login(email: string, password: string): Promise<Response<any>>;
    register(email: string, password: string): Promise<Response<any>>;
    logout(): Promise<Response<void>>;
}

interface AuthProps {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: AuthProps) {
    const [authenticated, setAuthenticated] = useState<Authenticated>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    async function logout() {
        const response = await ApiService.fetch<void>("/auth/logout");
        if (response.ok) {
            toast({
                position: "top",
                status: "success",
                title: "Logged out",
            });
            navigate("/");
            setAuthenticated(false);
        }
        return response;
    }

    async function login(email: string, password: string) {
        const response = await ApiService.fetch<{ id: string }>(
            "/auth/login",
            { method: "POST" },
            { email, password }
        );
        if (response.ok) {
            setAuthenticated(true);
            setUserId(response.data?.id as string);
        }
        return response;
    }

    async function register(email: string, password: string) {
        const response = await ApiService.fetch<{ id: string }>(
            "/auth/register",
            { method: "POST" },
            { email, password }
        );
        if (response.ok) {
            setAuthenticated(true);
            setUserId(response.data?.id as string);
        }
        return response;
    }

    async function whoami() {
        const { ok, data } = await ApiService.fetch<{ id: string }>(
            "/auth/whoami"
        );
        setAuthenticated(ok);
        if (ok) {
            setUserId(data?.id as string);
        }
    }

    useEffect(() => {
        whoami();
    }, []);

    const values: IAuthContext = {
        authenticated,
        userId,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
}
