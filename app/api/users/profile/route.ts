export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getDatabase, ref, set } from "firebase/database"
import { firebaseApp } from "@/lib/firebase/client";

const database = getDatabase(firebaseApp)

type Body = { idToken: string; name: string };

export async function POST(req: Request) {
    try {
        const { idToken, name } = (await req.json()) as Body;
        if (!idToken || !name) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const decoded = await adminAuth.verifyIdToken(idToken, true);
        const uid = decoded.uid;

        const userRef = ref(database, `users/${uid}`);
        await set(userRef, {
            name,
            email: decoded.email ?? null,
            roles: ["user"],
            createdAt: Date.now(),
        });

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
