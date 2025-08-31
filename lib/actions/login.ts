import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../lib/firebase/client";

export async function loginWithEmailAndPassword(
    email: string,
    password: string
): Promise<UserCredential> {
    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await credentials.user.getIdToken();
        await fetch("/api/auth/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idToken })
        });
        return credentials;
    } catch (err: any) {
        // Firebase auth errors have a code field
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
