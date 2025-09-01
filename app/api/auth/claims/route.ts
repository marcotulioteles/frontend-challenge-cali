import { adminAuth } from "@/lib/firebase/admin";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { idToken, roles } = await req.json();

        if (!idToken || !roles) {
            return new Response(JSON.stringify({ error: "Missing idToken or roles" }), { status: 400 });
        }

        const decoded = await adminAuth.verifyIdToken(idToken);
        const claims = typeof roles === "object" ? { roles } : { roles: [roles] };
        await adminAuth.setCustomUserClaims(decoded.uid, claims);

        return new Response(JSON.stringify({ message: "Claims set successfully" }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: "Failed to set claims", details: error?.message }), { status: 500 });
    }
}