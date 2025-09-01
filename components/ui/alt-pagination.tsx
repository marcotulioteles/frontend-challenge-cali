"use client";

import React from "react";

type Props = {
    pageSize: number;
    total: number;
    currentPage: number;
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
    loading?: boolean;
};

export default function AltPagination({
    pageSize,
    total,
    currentPage,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
    loading = false,
}: Props) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="text-sm text-gray-600">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span> ·{" "}
                <span className="font-medium">{total}</span> total
            </div>
            <div className="inline-flex items-center gap-2">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={!hasPrev || loading}
                    className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
                    aria-label="Previous page"
                >
                    ← Prev
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!hasNext || loading}
                    className="px-3 py-1.5 rounded border text-sm disabled:opacity-50"
                    aria-label="Next page"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
