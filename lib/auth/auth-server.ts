import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function getServerUser() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;

    try {
        const decoded = await adminAuth.verifySessionCookie(session, true);
        return decoded;
    } catch {
        return null;
    }
}
