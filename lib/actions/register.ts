import { createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { HttpMethods } from "@/types/http-methods.enum";
import { httpRequest } from "@/helpers/api/http-request";
import { API_URL_MAP } from "@/helpers/api/api-url-map";

type RegisterResult = { ok: true; user: Pick<User, "uid" | "email" | "displayName"> }
    | { ok: false; error: string };

export async function registerWithEmailAndPassword(
    email: string,
    password: string,
    name: string
): Promise<RegisterResult> {
    const { users: usersUrl, auth: authUrl } = API_URL_MAP;

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        await updateProfile(user, { displayName: name }).catch(() => { });

        const idToken = await user.getIdToken();

        const profileRes = await httpRequest(usersUrl.profile, HttpMethods.POST, {
            idToken,
            name,
        });

        if (!profileRes.ok) {
            const { error } = await profileRes.json().catch(() => ({}));
            throw new Error(error || "Failed to persist profile");
        }

        const sessionRes = await httpRequest(authUrl.session, HttpMethods.POST, {
            idToken,
        });
        if (!sessionRes.ok) {
            const { error } = await sessionRes.json().catch(() => ({}));
            throw new Error(error || "Failed to create session");
        }

        return {
            ok: true,
            user: { uid: user.uid, email: user.email, displayName: user.displayName },
        };
    } catch (error) {
        throw error;
    }
}
