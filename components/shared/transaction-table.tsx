"use client";

import { useState } from "react";
import { Pagination } from "../ui/pagination";

interface TransactionTableProps {
    transactions: {
        id: string;
        cardholderName: string;
        cardNumber: string;
        expirationDate: string;
        value: number;
        status: string;
    }[];
}

export default function TransactionTable({
    transactions,
}: TransactionTableProps) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    const totalItems = 1250;
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
                {transactions.map((transaction) => (
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
                            {transaction.cardNumber}
                        </span>
                        <span className="tracking-widest">
                            <strong className="font-light text-xs text-gray-500 block md:hidden">
                                Expiration Date
                            </strong>
                            {transaction.expirationDate}
                        </span>
                        <span className="text-base tracking-widest">
                            <strong className="font-light text-xs text-gray-500 block md:hidden">
                                Value
                            </strong>
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(transaction.value)}
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
                ))}
            </div>
            <div className="w-full max-w-7xl mx-auto px-6 xl:px-0">
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    pageSizeOptions={[10, 25, 50, 100]}
                    maxButtons={3} // tweak to show more/less neighbors
                />
            </div>
        </>
    );
}
