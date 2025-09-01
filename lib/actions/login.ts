import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import { HttpMethods } from "@/types/http-methods.enum";
import { httpRequest } from "@/helpers/api/http-request";
import { API_URL_MAP } from "@/helpers/api/api-url-map";

export async function loginWithEmailAndPassword(
    email: string,
    password: string
): Promise<UserCredential> {
    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await credentials.user.getIdToken();
        await httpRequest(API_URL_MAP.auth.session, HttpMethods.POST, { idToken });
        return credentials;
    } catch (err: any) {
        const errorCode = err?.code ?? "auth/unknown";
        const errorMessage = mapAuthError(errorCode);
        throw new Error(errorMessage);
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
