// app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/auth-server";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata = { title: "App" };

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();
    if (!session) redirect("/login");

    return (
        <AuthProvider
            initial={{
                uid: session.uid,
                email: session.email ?? null,
                roles: session.roles,
            }}
        >
            {children}
        </AuthProvider>
    );
}
