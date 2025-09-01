export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { checkUserSession, decideTransactionStatus, isAdmin } from '@/helpers/api/transactions-helper'

const MAX_LIMIT = 200;

type Tx = { id: string; createdAt: number;[k: string]: any };

export async function POST(req: NextRequest) {
    try {
        const session = await checkUserSession();

        const decoded = await adminAuth.verifySessionCookie((session as string), true);
        const uid = decoded.uid;
        const body = await req.json();
        const status = decideTransactionStatus(body.amount);

        const ref = adminDb.ref("transactions").push();
        const id = ref.key!;
        const transaction = {
            id,
            userId: uid,
            cardholderName: body.cardholderName,
            card: body.card,
            amount: body.amount,
            status,
            createdAt: Date.now(),
        }

        const updates: Record<string, any> = {};
        updates[`/transactions/${id}`] = transaction;
        updates[`/transactions_by_user/${uid}/${id}`] = transaction;

        await adminDb.ref().update(updates);

        await Promise.all([
            adminDb.ref("/meta/transactions/count").transaction(n => (n || 0) + 1),
            adminDb.ref(`/meta/transactions_by_user/${uid}/count`).transaction(n => (n || 0) + 1),
        ]);

        return NextResponse.json({ transaction: { id, ...body, status, createdAt: Date.now() } }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await checkUserSession();
        const decoded = await adminAuth.verifySessionCookie((session as string), true);
        const roles = (decoded.roles as string[] | undefined) ?? [];
        const uid = decoded.uid;

        const url = new URL(req.url);
        const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit") || 20), MAX_LIMIT));
        const beforeTsParam = url.searchParams.get("beforeTs");
        const beforeIdParam = url.searchParams.get("beforeId");

        const beforeTs = beforeTsParam !== null ? Number(beforeTsParam) : null;
        const hasValidCursor = Number.isFinite(beforeTs);
        const beforeId = beforeIdParam ?? null;

        const adminMode = isAdmin(roles);

        const totalRef = adminMode
            ? adminDb.ref("/meta/transactions/count")
            : adminDb.ref(`/meta/transactions_by_user/${uid}/count`);

        const totalSnap = await totalRef.get();
        const total = totalSnap.exists() ? Number(totalSnap.val()) : 0;

        const basePath = adminMode ? "transactions" : `transactions_by_user/${uid}`;

        let q = adminDb.ref(basePath).orderByChild("createdAt");
        if (hasValidCursor) q = q.endAt(beforeTs as number);

        const snap = await q.limitToLast(limit + 5).get();

        let rows: Tx[] = [];
        if (snap.exists()) {
            const raw = Object.values(snap.val() as Record<string, any>);
            rows = raw
                .filter((r) => r && typeof r.createdAt === "number" && typeof r.id === "string") as Tx[];
        }

        rows.sort((a, b) => (b.createdAt - a.createdAt) || (b.id > a.id ? 1 : -1));

        if (hasValidCursor && beforeId) {
            rows = rows.filter(
                (t) => t.createdAt < (beforeTs as number) ||
                    (t.createdAt === (beforeTs as number) && t.id < beforeId)
            );
        }

        const pageItems = rows.slice(0, limit);
        const nextCursor = pageItems.length
            ? {
                beforeTs: String(pageItems[pageItems.length - 1].createdAt),
                beforeId: pageItems[pageItems.length - 1].id,
            }
            : null;

        const pageSize = limit;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));

        return NextResponse.json({
            transactions: pageItems,
            nextCursor,
            pageSize,
            total,
            totalPages,
        });
    } catch (err: any) {
        const msg =
            err?.errorInfo?.message ||
            err?.message ||
            (typeof err === "string" ? err : "Internal error");
        console.error("GET /api/transactions failed:", msg, err);
        return NextResponse.json({ error: "Internal error", detail: msg }, { status: 500 });
    }
}