"use client";

import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/providers/auth-provider";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HeaderLogoutBtn() {
    const { roles } = useAuth();
    console.log("[LOG] roles: ", { roles });

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            await signOut(auth);
            router.replace("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-white"
            type="button"
        >
            Logout
        </button>
    );
}
