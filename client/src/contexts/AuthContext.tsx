import { createContext, useEffect, useState } from "react";
import { ApiService } from "../services/ApiService";

type Authenticated = boolean | null;

interface IAuthContext {
    authenticated: Authenticated;
    login(email: string, password: string): Promise<void>;
}

interface AuthProps {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: AuthProps) {
    const [authenticated, setAuthenticated] = useState<Authenticated>(null);

    async function login(email: string, password: string) {
        await ApiService.fetch(
            "/auth/login",
            { method: "POST" },
            { email, password }
        );
    }

    async function whoami() {
        const { status } = await ApiService.fetch("/auth/whoami");
        setAuthenticated(status === 200);
    }

    useEffect(() => {
        whoami();
    }, []);

    const values: IAuthContext = {
        login,
        authenticated,
    };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
}
