import { createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type RegisterResult = { ok: true; user: Pick<User, "uid" | "email" | "displayName"> }
    | { ok: false; error: string };

export async function registerWithEmailAndPassword(
    email: string,
    password: string,
    name: string
): Promise<RegisterResult> {
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        await updateProfile(user, { displayName: name }).catch(() => { });

        const idToken = await user.getIdToken();

        const profileRes = await fetch("/api/users/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken, name }),
        });
        if (!profileRes.ok) {
            const { error } = await profileRes.json().catch(() => ({}));
            throw new Error(error || "Failed to persist profile");
        }

        const sessionRes = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });
        if (!sessionRes.ok) {
            const { error } = await sessionRes.json().catch(() => ({}));
            throw new Error(error || "Failed to create session");
        }

        return {
            ok: true,
            user: { uid: user.uid, email: user.email, displayName: user.displayName },
        };
    } catch (err: any) {
        const code = err?.code ?? "";
        const friendly =
            code === "auth/email-already-in-use" ? "This email is already registered."
                : code === "auth/invalid-email" ? "The email address is invalid."
                    : code === "auth/weak-password" ? "Password is too weak."
                        : err?.message || "Registration failed.";
        return { ok: false, error: friendly };
    }
}
