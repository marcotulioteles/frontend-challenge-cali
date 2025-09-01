"use client";

import { useEffect, useRef, useState } from "react";
import {
    getDatabase,
    ref,
    query,
    orderByChild,
    limitToLast,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    off,
} from "firebase/database";
import { firebaseApp } from "@/lib/firebase/client";
import { Transaction } from "@/types/transaction.model";

type Options =
    | { mode: "admin"; pageSize: number }
    | { mode: "user"; uid: string; pageSize: number };

export function useLiveTransactions(opts: Options) {
    const [updatedTransactions, setUpdatedTransactions] = useState<
        Transaction[]
    >([]);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<Map<string, Transaction>>(new Map());

    useEffect(() => {
        const db = getDatabase(firebaseApp);
        const basePath =
            opts.mode === "admin"
                ? "transactions"
                : `transactions_by_user/${opts.uid}`;

        // Admin should always load (and keep listening to) ALL transactions (no page limit)
        const q =
            opts.mode === "admin"
                ? query(ref(db, basePath), orderByChild("createdAt"))
                : query(
                      ref(db, basePath),
                      orderByChild("createdAt"),
                      limitToLast(opts.pageSize)
                  );

        function publish() {
            const arr = Array.from(mapRef.current.values()).sort(
                (a, b) => b.createdAt - a.createdAt || (b.id > a.id ? 1 : -1)
            );
            setUpdatedTransactions(arr);
        }

        const added = onChildAdded(q, (snap) => {
            const transaction = snap.val() as Transaction;
            if (transaction?.id) {
                mapRef.current.set(transaction.id, transaction);
                publish();
            }
        });

        const changed = onChildChanged(q, (snap) => {
            const transaction = snap.val() as Transaction;
            if (transaction?.id) {
                mapRef.current.set(transaction.id, transaction);
                publish();
            }
        });

        const removed = onChildRemoved(q, (snap) => {
            const transaction = snap.val() as Transaction;
            if (transaction?.id) {
                mapRef.current.delete(transaction.id);
                publish();
            }
        });

        setLoading(false);
        return () => {
            off(q, "child_added", added);
            off(q, "child_changed", changed);
            off(q, "child_removed", removed);
        };
    }, [
        opts.mode,
        opts.mode === "user" ? opts.uid : null,
        opts.mode === "user" ? opts.pageSize : null,
    ]);

    return { updatedTransactions, loading };
}
