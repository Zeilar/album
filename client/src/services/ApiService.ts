const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface Response<T> {
    data: T | null;
    ok: boolean;
    status: number;
}

export class ApiService {
    public static async fetch<T>(
        input: RequestInfo,
        init?: RequestInit | undefined,
        body?: any
    ): Promise<Response<T>> {
        let data: T | null = null;
        const response = await fetch(`${BASE_URL}${input}`, {
            ...init,
            headers: {
                ...init?.headers,
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        });
        try {
            if (
                response.headers
                    .get("content-type")
                    ?.includes("application/json")
            ) {
                data = await response.json();
            }
        } catch (error) {
            console.error(error);
        } finally {
            return { data, status: response.status, ok: response.ok };
        }
    }
}
