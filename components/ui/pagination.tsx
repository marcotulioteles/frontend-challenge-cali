"use client";

import { useMemo } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { buttonClass } from "../utils/pagination/button-class";
import { clamp } from "../utils/pagination/clamp-number";
import { buildPageItems, PageItem } from "../utils/pagination/build-page-items";

export type PaginationProps = {
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    maxButtons?: number;
    showSummary?: boolean;
    showPageSize?: boolean;
    ariaLabel?: string;
    disabled?: boolean;
    className?: string;
};

export function Pagination({
    page,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
    maxButtons = 7,
    showSummary = true,
    showPageSize = true,
    ariaLabel = "Pagination",
    disabled = false,
    className = "",
}: PaginationProps) {
    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / Math.max(1, pageSize))
    );
    const current = clamp(page, 1, totalPages);

    const pageItems = useMemo<PageItem[]>(
        () => buildPageItems(totalPages, current, maxButtons),
        [totalPages, current, maxButtons]
    );

    const start = totalItems === 0 ? 0 : (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, totalItems);

    const goTo = (p: number) => {
        if (disabled) return;
        const next = clamp(p, 1, totalPages);
        if (next !== current) onPageChange(next);
    };

    const handleKey = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        target: number | "prev" | "next"
    ) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (target === "prev") goTo(current - 1);
            else if (target === "next") goTo(current + 1);
            else goTo(target);
        }
    };

    return (
        <div className={`flex flex-wrap justify-between gap-4 ${className}`}>
            {/* Left controls: Back + numbers + Next */}
            <nav aria-label={ariaLabel} className="flex items-center gap-2">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => goTo(current - 1)}
                    onKeyDown={(e) => handleKey(e, "prev")}
                    disabled={current === 1 || disabled}
                    className={`flex items-center gap-2 ${buttonClass({
                        muted: true,
                        disabled: current === 1 || disabled,
                    })}`}
                    aria-label="Back"
                >
                    <CaretLeftIcon />
                    <span className="hidden sm:inline">Back</span>
                </button>

                {/* Page numbers */}
                <ul className="flex items-center gap-2" role="list">
                    {pageItems.map((item, idx) =>
                        item === "ellipsis" ? (
                            <li
                                key={`e-${idx}`}
                                className="px-2 text-gray-500 select-none"
                            >
                                …
                            </li>
                        ) : (
                            <li key={item}>
                                <button
                                    type="button"
                                    aria-current={
                                        item === current ? "page" : undefined
                                    }
                                    onClick={() => goTo(item)}
                                    onKeyDown={(e) => handleKey(e, item)}
                                    disabled={disabled}
                                    className={buttonClass({
                                        active: item === current,
                                        disabled,
                                    })}
                                >
                                    {item}
                                </button>
                            </li>
                        )
                    )}
                </ul>

                {/* Next */}
                <button
                    type="button"
                    onClick={() => goTo(current + 1)}
                    onKeyDown={(e) => handleKey(e, "next")}
                    disabled={current === totalPages || disabled}
                    className={`flex items-center gap-2 ${buttonClass({
                        muted: true,
                        disabled: current === totalPages || disabled,
                    })}`}
                    aria-label="Next"
                >
                    <span className="hidden sm:inline">Next</span>{" "}
                    <CaretRightIcon />
                </button>
            </nav>

            {/* Right controls: page size + summary */}
            <div className="grid min-[400px]:flex items-center gap-4">
                {showPageSize && onPageSizeChange && (
                    <label className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700">Result per page</span>
                        <select
                            className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm disabled:opacity-50"
                            value={pageSize}
                            onChange={(e) =>
                                onPageSizeChange(Number(e.target.value))
                            }
                            disabled={disabled}
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </label>
                )}

                {showSummary && (
                    <span className="text-sm text-gray-600 tabular-nums">
                        {start}-{end} of {totalItems.toLocaleString()}
                    </span>
                )}
            </div>
        </div>
    );
}
