import { HttpMethods } from "@/types/http-methods.enum";

export async function httpRequest(url: string, method: HttpMethods, body?: any, headers?: HeadersInit, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const response = await fetch(fullUrl, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}
