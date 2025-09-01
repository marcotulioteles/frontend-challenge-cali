"use client";

import { useEffect, useState } from "react";
import { DynamicPhosphorIcon } from "./dynamic-icon";
import AltPagination from "../ui/alt-pagination";
import { TransactionStatus } from "@/types/transaction.model";
import { API_URL_MAP } from "@/helpers/api/api-url-map";
import LoadingContent from "./loading-content";

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

type Cursor = { beforeTs: string; beforeId: string } | null;

export default function TransactionTable() {
    const pageSize = 20;

    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [total, setTotal] = useState(0);
    const [nextCursor, setNextCursor] = useState<Cursor>(null);
    const [history, setHistory] = useState<Cursor[]>([null]); // first page has null cursor
    const [pageIdx, setPageIdx] = useState(0); // 0-based index in history
    const currentPage = pageIdx + 1;

    const [loading, setLoading] = useState(true);

    async function fetchPage(cursor: Cursor) {
        setLoading(true);
        try {
            const querySearch = new URLSearchParams({
                limit: String(pageSize),
            });
            if (cursor?.beforeTs) querySearch.set("beforeTs", cursor.beforeTs);
            if (cursor?.beforeId) querySearch.set("beforeId", cursor.beforeId);

            const res = await fetch(
                `${API_URL_MAP.transactions.list}?${querySearch}`,
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );
            const data = await res.json();

            setTransactions(data.transactions || []);
            setNextCursor(data.nextCursor || null);
            setTotal(data.total || 0);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPage(history[pageIdx]);
    }, []);

    const onNext = async () => {
        if (!nextCursor) return;
        const newHistory = history.slice(0, pageIdx + 1).concat(nextCursor);
        setHistory(newHistory);
        setPageIdx(pageIdx + 1);
        await fetchPage(nextCursor);
    };

    const onPrev = async () => {
        if (pageIdx === 0) return;
        const newPageIdx = pageIdx - 1;
        setPageIdx(newPageIdx);
        await fetchPage(history[newPageIdx]);
    };

    const hasPrev = pageIdx > 0;
    const hasNext = Boolean(nextCursor);

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
                                {transaction.card.last4}
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
            {/* <div className="w-full max-w-7xl mx-auto px-6 xl:px-0">
                <AltPagination
                    pageSize={pageSize}
                    total={total}
                    currentPage={currentPage}
                    onPrev={onPrev}
                    onNext={onNext}
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                    loading={loading}
                />
            </div> */}
        </>
    );
}
