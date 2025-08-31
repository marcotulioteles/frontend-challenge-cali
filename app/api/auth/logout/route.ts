export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;

        // Optional: revoke tokens for this user (logs out other devices too)
        if (session) {
            try {
                const decoded = await adminAuth.verifySessionCookie(session, true);
                await adminAuth.revokeRefreshTokens(decoded.uid);
            } catch {
                // ignore if cookie invalid/expired
            }
        }

        const res = NextResponse.json({ ok: true });
        // Clear the cookie
        res.cookies.set({
            name: "session",
            value: "",
            httpOnly: true,
            path: "/",
            maxAge: 0,
        });
        return res;
    } catch (e) {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
