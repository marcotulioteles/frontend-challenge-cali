import { TransactionStatus } from "@/types/transaction.model";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const checkUserSession = async () => {
    const session = (await cookies()).get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return session as string;
}

export const decideTransactionStatus = (amount: number) => {
    if (amount > 1000) return TransactionStatus.DECLINED;
    if (amount <= 1000) return TransactionStatus.APPROVED;
}

export const isAdmin = (roles?: unknown) => {
    return Array.isArray(roles) && roles.includes("admin");
}