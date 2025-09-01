import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

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

export type ServerSession = {
    uid: string;
    email?: string | null;
    userDisplayName?: {
        firstName?: string | null;
        lastName?: string | null;
    };
    roles: string[];
};


export async function getServerSession(): Promise<ServerSession | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;

    try {
        const decoded = await adminAuth.verifySessionCookie(session, true);
        const snap = await adminDb.ref(`users/${decoded.uid}/roles`).get();
        const dbRoles: string[] = snap.exists() ? snap.val() : [];

        return {
            userDisplayName: {
                firstName: decoded.name ? decoded.name.split(" ")[0].toUpperCase() : null,
                lastName: decoded.name ? decoded.name.split(" ").pop()?.toUpperCase() : null,
            },
            uid: decoded.uid,
            email: decoded.email ?? null,
            roles: dbRoles.length ? dbRoles : [],
        };
    } catch {
        return null;
    }
}