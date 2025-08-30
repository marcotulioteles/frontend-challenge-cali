"use client";

import { useRouter } from "next/navigation";

export default function HeaderLogoutBtn() {
    const router = useRouter();

    const handleLogout = () => {
        // Perform logout logic here
        router.push("/login");
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
