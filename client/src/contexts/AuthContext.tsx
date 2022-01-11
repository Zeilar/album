import { createContext, useEffect, useState } from "react";
import { ApiService } from "../services/ApiService";

interface IAuthContext {
    login(email: string, password: string): Promise<void>;
}

interface AuthProps {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: AuthProps) {
    const [authenticated, setAuthenticated] = useState<Object | null>(null);

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

    console.log(authenticated);

    useEffect(() => {
        (async () => {
            await whoami();
        })();
    }, []);

    const values: IAuthContext = {
        login,
    };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
}
