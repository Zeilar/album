import { useToast } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ApiService, Response } from "../services/ApiService";

type Authenticated = boolean | null;

interface IAuthContext {
    authenticated: Authenticated;
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
        const response = await ApiService.fetch(
            "/auth/login",
            { method: "POST" },
            { email, password }
        );
        if (response.ok) {
            setAuthenticated(true);
        }
        return response;
    }

    async function register(email: string, password: string) {
        const response = await ApiService.fetch(
            "/auth/register",
            { method: "POST" },
            { email, password }
        );
        if (response.ok) {
            setAuthenticated(true);
        }
        return response;
    }

    async function whoami() {
        const { status } = await ApiService.fetch("/auth/whoami");
        setAuthenticated(status === 200);
    }

    useEffect(() => {
        whoami();
    }, []);

    const values: IAuthContext = {
        authenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
}
