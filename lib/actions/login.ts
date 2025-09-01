import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import { HttpMethods } from "@/types/http-methods.enum";
import { httpRequest } from "@/helpers/api/http-request";
import { API_URL_MAP } from "@/helpers/api/api-url-map";
import { getDatabase, ref, get } from "firebase/database";
import { enqueueFlash } from "../flash-notification/flash-notification";

export async function loginWithEmailAndPassword(
    email: string,
    password: string
): Promise<UserCredential> {
    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);

        const roles = await extractRoles(credentials.user.uid);

        // 1. Send current token + roles so backend can call adminAuth.setCustomUserClaims(userId, { roles })
        if (roles.length > 0 && API_URL_MAP.auth.claims) {
            const preToken = await credentials.user.getIdToken();
            await httpRequest(API_URL_MAP.auth.claims, HttpMethods.POST, { idToken: preToken, roles });
            // Force refresh so the new custom claims (roles) are included in a fresh ID token.
            await credentials.user.getIdToken(true);
        }

        // 2. Get refreshed token (now containing custom claims) and create the session cookie.
        const idToken = await credentials.user.getIdToken();
        await httpRequest(API_URL_MAP.auth.session, HttpMethods.POST, { idToken });

        return credentials;
    } catch (err: any) {
        console.log("[ERROR] loginWithEmailAndPassword: ", { err });
        throw err;
    }
}

async function extractRoles(userId: string): Promise<string[]> {
    try {
        const db = getDatabase();
        const rolesSnap = await get(ref(db, `/users/${userId}/roles`));
        if (!rolesSnap.exists()) return [];
        const val = rolesSnap.val();

        if (Array.isArray(val)) {
            return val.filter(r => typeof r === "string");
        }

        if (val && typeof val === "object") {
            return Object.entries(val)
                .filter(([, v]) => v)
                .map(([k]) => k);
        }
        return [];
    } catch {
        return [];
    }
}

function mapAuthError(code: string): string {
    switch (code) {
        case "auth/invalid-email":
            return "The email address is invalid.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/wrong-password":
            return "The password is incorrect.";
        default:
            return "Login failed. Please try again.";
    }
}
