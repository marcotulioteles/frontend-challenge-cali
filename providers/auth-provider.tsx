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
import { API_URL_MAP } from "@/helpers/api/api-url-map";

type AuthState = {
    uid: string;
    email: string | null;
    roles: string[];
    loading: boolean;
    userDisplayName?: { firstName?: string | null; lastName?: string | null };
    refreshRoles: () => Promise<void>;
};

const Context = createContext<AuthState | null>(null);

type Initial = {
    uid: string;
    email: string | null;
    roles: string[];
    userDisplayName?: { firstName?: string | null; lastName?: string | null };
};

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
    const [userDisplayName, setUserDisplayName] = useState(
        initial.userDisplayName
    );
    const [loading, setLoading] = useState(false);
    const firstMount = useRef(true);

    const refreshRoles = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL_MAP.users.me.roles, {
                credentials: "include",
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
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
        const unsubscribe = onIdTokenChanged(auth, async (u) => {
            const newUid = u?.uid ?? "";
            if (newUid !== uid) {
                setUid(newUid);
                setEmail(u?.email ?? null);
                setUserDisplayName(
                    u?.displayName
                        ? {
                              firstName: u.displayName
                                  .split(" ")[0]
                                  .toUpperCase(),
                              lastName: u.displayName
                                  .split(" ")
                                  .pop()
                                  ?.toUpperCase(),
                          }
                        : {}
                );
                await refreshRoles();
            }
            firstMount.current = false;
        });
        return () => unsubscribe();
    }, [uid]);

    const value = useMemo(
        () => ({ uid, email, roles, loading, refreshRoles, userDisplayName }),
        [uid, email, roles, userDisplayName, loading]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAuth() {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
