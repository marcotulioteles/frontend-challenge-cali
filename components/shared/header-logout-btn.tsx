"use client";

import { API_URL_MAP } from "@/helpers/api/api-url-map";
import { auth } from "@/lib/firebase/client";
import { HttpMethods } from "@/types/http-methods.enum";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Modal from "../ui/modal";
import { useState } from "react";
import { DynamicPhosphorIcon } from "./dynamic-icon";
import { useNotifications } from "@/providers/notifications-provider";

export default function HeaderLogoutBtn() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { notify } = useNotifications();

    const handleLogout = async () => {
        try {
            setLoading(true);
            await fetch(API_URL_MAP.auth.logout, {
                method: HttpMethods.POST,
                credentials: "include",
            });
            await signOut(auth);
            router.replace("/login");
            router.refresh();
        } catch (error) {
            notify({
                type: "error",
                message: "Logout failed. Please try again later.",
                duration: 5000,
                title: "Logout Error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="text-sm text-white"
                type="button"
            >
                Logout
            </button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="flex flex-col gap-3 sm:min-w-sm">
                    <h1 className="text-center text-3xl">Logout</h1>
                    <p>Are you sure you want to logout?</p>
                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                        <button
                            onClick={() => setShowModal(false)}
                            className="primary-btn bg-gray-200 text-gray-700 rounded w-full hover:bg-gray-300 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="primary-btn px-4 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-fit flex items-center gap-2 justify-center">
                                    <span>Logging out...</span>
                                    <DynamicPhosphorIcon
                                        iconName="CircleNotchIcon"
                                        className="animate-spin"
                                    />
                                </div>
                            ) : (
                                "Yes, Logout"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
