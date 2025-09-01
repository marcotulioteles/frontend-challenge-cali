"use client";

import BannerStack from "@/components/shared/banner-stack";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

export type NoticeType = "success" | "warning" | "error" | "info";
export type Notice = {
    id: string;
    type: NoticeType;
    title?: string;
    message: string;
    duration?: number; // ms (auto-dismiss). 0 = sticky.
    actionLabel?: string;
    onAction?: () => void;
};

type Ctx = {
    notify: (n: Omit<Notice, "id">) => string; // returns id
    success: (
        msg: string,
        opts?: Partial<Omit<Notice, "id" | "type" | "message">>
    ) => string;
    warning: (
        msg: string,
        opts?: Partial<Omit<Notice, "id" | "type" | "message">>
    ) => string;
    error: (
        msg: string,
        opts?: Partial<Omit<Notice, "id" | "type" | "message">>
    ) => string;
    info: (
        msg: string,
        opts?: Partial<Omit<Notice, "id" | "type" | "message">>
    ) => string;
    dismiss: (id: string) => void;
    clear: () => void;
};

const NotificationsContext = createContext<Ctx | null>(null);

export function useNotifications(): Ctx {
    const ctx = useContext(NotificationsContext);
    if (!ctx)
        throw new Error(
            "useNotifications must be used within <NotificationsProvider>"
        );
    return ctx;
}

export function NotificationsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [stack, setStack] = useState<Notice[]>([]);
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLElement | null>(null);

    const dismiss = useCallback((id: string) => {
        setStack((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const push = useCallback(
        (n: Omit<Notice, "id">) => {
            const id = crypto.randomUUID();
            const notice: Notice = { duration: 5000, ...n, id };
            setStack((prev) => [notice, ...prev].slice(0, 4));
            if (notice.duration && notice.duration > 0) {
                window.setTimeout(() => dismiss(id), notice.duration);
            }
            return id;
        },
        [dismiss]
    );

    const helpers = useMemo(
        () => ({
            notify: (n: Omit<Notice, "id">) => push(n),
            success: (
                m: string,
                o: Partial<Omit<Notice, "id" | "type" | "message">> = {}
            ) => push({ type: "success", message: m, ...o }),
            warning: (
                m: string,
                o: Partial<Omit<Notice, "id" | "type" | "message">> = {}
            ) => push({ type: "warning", message: m, ...o }),
            error: (
                m: string,
                o: Partial<Omit<Notice, "id" | "type" | "message">> = {}
            ) => push({ type: "error", message: m, ...o }),
            info: (
                m: string,
                o: Partial<Omit<Notice, "id" | "type" | "message">> = {}
            ) => push({ type: "info", message: m, ...o }),
            dismiss,
            clear: () => setStack([]),
        }),
        [push, dismiss]
    );

    // Create or find a stable container after mount (client only)
    useEffect(() => {
        const id = "banner-root";
        let el = document.getElementById(id) as HTMLElement | null;
        if (!el) {
            el = document.createElement("div");
            el.id = id;
            document.body.appendChild(el);
        }
        containerRef.current = el;
        setMounted(true);
        // Optional cleanup: keep the element for the app lifetime (no removal)
    }, []);

    return (
        <NotificationsContext.Provider value={helpers}>
            {children}
            {mounted && containerRef.current
                ? createPortal(
                      <BannerStack stack={stack} dismiss={dismiss} />,
                      containerRef.current
                  )
                : null}
        </NotificationsContext.Provider>
    );
}
