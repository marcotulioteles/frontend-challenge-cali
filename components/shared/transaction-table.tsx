"use client";

import { useEffect, useState, useRef } from "react";
import { DynamicPhosphorIcon } from "./dynamic-icon";
import { TransactionStatus } from "@/types/transaction.model";
import { API_URL_MAP } from "@/helpers/api/api-url-map";
import LoadingContent from "./loading-content";
import { useLiveTransactions } from "@/hooks/userLiveTransactions";
import { useAuth } from "@/providers/auth-provider";
import { isAdmin } from "@/helpers/shared/is-admin";

type TransactionItem = {
    id: string;
    userId: string;
    cardholderName: string;
    amount: number;
    card: {
        last4: string;
        expirationDate: string;
    };
    status: TransactionStatus;
    createdAt: number;
};

export default function TransactionTable() {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const { roles, uid: userId } = useAuth();
    const { updatedTransactions, loading: liveLoading } = useLiveTransactions(
        isAdmin(roles)
            ? { mode: "admin", pageSize: 100 }
            : { mode: "user", uid: userId, pageSize: 100 }
    );

    const [loading, setLoading] = useState(true);

    async function fetchTransactions() {
        setLoading(true);
        try {
            const querySearch = new URLSearchParams({
                // keeping a limit to avoid fetching unbounded data
                limit: "100",
            });

            const res = await fetch(
                `${API_URL_MAP.transactions.list}?${querySearch}`,
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );
            const data = await res.json();

            setTransactions(data.transactions || []);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Apply live updates only once real live data arrives to avoid clearing fetched data with an empty array
    const hasAppliedLiveData = useRef(false);
    useEffect(() => {
        if (liveLoading) return;
        // First time: only replace if live data has something (prevent wiping fetched data with empty array)
        if (!hasAppliedLiveData.current) {
            if (updatedTransactions.length > 0) {
                setTransactions(updatedTransactions);
                hasAppliedLiveData.current = true;
            }
            return;
        }

        console.log("[LOG] updatedTransactions: ", { updatedTransactions });

        // Subsequent updates: always sync
        setTransactions(updatedTransactions);
    }, [updatedTransactions, liveLoading]);

    return (
        <>
            <div className="grid w-full max-w-7xl pb-10 px-6 xl:px-0">
                <header className="hidden md:grid grid-cols-5 gap-4 w-full border-b border-gray-300 p-4 text-primary-400 uppercase text-xs font-extrabold font-title tracking-widest">
                    <span>Cardholder Name</span>
                    <span>Card Number</span>
                    <span>Expiration Date</span>
                    <span>Value</span>
                    <span>Status</span>
                </header>
                {transactions.length > 0 && !loading ? (
                    transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="grid md:grid-cols-5 gap-4 w-full border-b border-gray-300 p-4 hover:bg-primary-50/50 transition-all duration-300 hover:border-b-primary-400 text-gray-600"
                        >
                            <span className="text-sm uppercase tracking-widest">
                                <strong className="font-light text-xs text-gray-500 block md:hidden normal-case">
                                    Cardholder Name
                                </strong>
                                {transaction.cardholderName}
                            </span>
                            <span className="tracking-widest">
                                <strong className="font-light text-xs text-gray-500 block md:hidden">
                                    Card Number
                                </strong>
                                {`**** **** **** ${transaction.card.last4}`}
                            </span>
                            <span className="tracking-widest">
                                <strong className="font-light text-xs text-gray-500 block md:hidden">
                                    Expiration Date
                                </strong>
                                {transaction.card.expirationDate}
                            </span>
                            <span className="text-base tracking-widest">
                                <strong className="font-light text-xs text-gray-500 block md:hidden">
                                    Value
                                </strong>
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(transaction.amount)}
                            </span>
                            <div>
                                <span className="font-light text-xs text-gray-500 mb-2 block md:hidden tracking-widest">
                                    Status
                                </span>
                                <span
                                    className={`w-fit text-xs rounded font-medium px-4 py-1 border uppercase tracking-widest ${
                                        transaction.status === "approved"
                                            ? "border-green-500 text-green-700 bg-green-100"
                                            : "border-red-500 text-red-700 bg-red-100"
                                    }`}
                                >
                                    {transaction.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : transactions.length === 0 && !loading ? (
                    <div className="w-full min-h-80 flex items-center justify-around">
                        <legend className="flex flex-col items-center justify-center gap-4 text-gray-400">
                            <DynamicPhosphorIcon
                                iconName="DatabaseIcon"
                                size={80}
                                className="fill-primary-400/25"
                            />
                            <span>You don't have any transactions yet.</span>
                        </legend>
                    </div>
                ) : (
                    <div className="w-full min-h-80 flex items-center justify-around">
                        <LoadingContent />
                    </div>
                )}
            </div>
        </>
    );
}
