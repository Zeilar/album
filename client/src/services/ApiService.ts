export interface Response<T> {
    data: T | null;
    ok: boolean;
    status: number;
}

export class ApiService {
    public static BASE_URL = process.env.REACT_APP_API_BASE_URL;

    public static async fetch<T>(
        input: RequestInfo,
        init?: RequestInit | undefined,
        body?: FormData | any
    ): Promise<Response<T>> {
        let data: T | null = null;
        const response = await fetch(`${ApiService.BASE_URL}${input}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
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
