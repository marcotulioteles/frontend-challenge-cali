export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/auth-server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const snap = await adminDb.ref(`users/${session.uid}/roles`).get();
    const roles: string[] = snap.exists() ? snap.val() : [];
    return NextResponse.json({ roles });
}
