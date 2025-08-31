// providers/auth-provider.tsx
"use client";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type AuthState = {
    uid: string;
    email: string | null;
    roles: string[];
    loading: boolean;
    refreshRoles: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

type Initial = { uid: string; email: string | null; roles: string[] };

export function AuthProvider({
    initial,
    children,
}: {
    initial: Initial;
    children: React.ReactNode;
}) {
    const [uid, setUid] = useState(initial.uid);
    const [email, setEmail] = useState(initial.email);
    const [roles, setRoles] = useState(initial.roles);
    const [loading, setLoading] = useState(false);
    const firstMount = useRef(true);

    const refreshRoles = async () => {
        console.log("Refreshing roles...");
        setLoading(true);
        try {
            const res = await fetch("/api/users/me/roles", {
                credentials: "include",
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Roles data: ", data);
                const rolesValues = Object.values(
                    data.roles ?? {}
                ) as unknown[];
                const nextRoles = rolesValues.filter(
                    (r): r is string => typeof r === "string"
                );
                setRoles(nextRoles);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshRoles();
    }, []);

    useEffect(() => {
        const unsub = onIdTokenChanged(auth, async (u) => {
            const newUid = u?.uid ?? "";
            if (newUid !== uid) {
                setUid(newUid);
                setEmail(u?.email ?? null);
                await refreshRoles(); // 🔁 pull the latest roles for the new user
            }
            firstMount.current = false;
        });
        return () => unsub();
    }, [uid]);

    const value = useMemo(
        () => ({ uid, email, roles, loading, refreshRoles }),
        [uid, email, roles, loading]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
