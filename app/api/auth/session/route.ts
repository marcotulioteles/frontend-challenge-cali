import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();
        if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

        const expiresIn = 1 * 24 * 60 * 60 * 1000; // 1 day
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const res = NextResponse.json({ ok: true });
        res.cookies.set({
            name: "session",
            value: sessionCookie,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: Math.floor(expiresIn / 1000),
        });
        return res;
    } catch (e) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
