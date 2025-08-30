import React, { useEffect } from "react";
import { XIcon } from "@phosphor-icons/react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    showCloseBtn?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    children,
    showCloseBtn,
}: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed bg-black/25 backdrop-blur-xs inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 relative mx-4 sm:mx-0"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                {showCloseBtn && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4"
                        aria-label="Close modal"
                    >
                        <XIcon
                            size={24}
                            className="fill-gray-500 hover:fill-primary-400 transition-all duration-300"
                        />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
