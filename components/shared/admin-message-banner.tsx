"use client";

import { isAdmin } from "@/helpers/shared/is-admin";
import { useAuth } from "@/providers/auth-provider";

export default function AdminMessageBanner() {
    const { userDisplayName, roles } = useAuth();

    const isUserAdmin = isAdmin(roles);

    if (!isUserAdmin) return null;

    return (
        <div className="px-6 xl:px-0 w-full">
            <legend className="bg-gray-100 p-4 rounded-md w-full max-w-7xl xl:mx-auto my-6 text-center text-sm text-gray-600 shadow-lg">
                <h2 className="font-title text-xl text-gray-800 capitalize mb-2">
                    Hello {userDisplayName?.firstName?.toLowerCase()} 👋
                </h2>
                <p className="text-gray-500">
                    You have the admin privileges. You are able to view all
                    users transactions.
                </p>
            </legend>
        </div>
    );
}
