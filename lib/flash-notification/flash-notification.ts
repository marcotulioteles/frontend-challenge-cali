import { cookies } from "next/headers";

// Keep payload tiny; message/title/type/duration. You can add keys like action later if needed.
export type FlashNotice = {
    type: "success" | "warning" | "error" | "info";
    message: string;
    title?: string;
    duration?: number; // ms; default handled by provider
};

const COOKIE = "flash_queue";

async function readQueue(): Promise<FlashNotice[]> {
    const cookiesStore = await cookies();
    const raw = cookiesStore.get(COOKIE)?.value;
    if (!raw) return [];
    try {
        const json = Buffer.from(raw, "base64url").toString();
        const arr = JSON.parse(json);
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

/** Append one or more notices to the queue (server-only). */
export async function enqueueFlash(...items: FlashNotice[]) {
    const q = await readQueue();
    const next = [...q, ...items].slice(-20); // prevent unbounded growth
    const value = Buffer.from(JSON.stringify(next)).toString("base64url");
    const cookiesStore = await cookies();
    cookiesStore.set(COOKIE, value, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60, // seconds; enough to survive a redirect/navigation
    });
}

/** Read & clear the queue exactly once per request (server layout). */
export async function drainFlash(): Promise<FlashNotice[]> {
    const q = await readQueue();
    // Clear so messages show only once
    const cookiesStore = await cookies();
    cookiesStore.set(COOKIE, "", { path: "/", maxAge: 0 });
    return q;
}
