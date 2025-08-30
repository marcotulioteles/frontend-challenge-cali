export type PageItem = number | "ellipsis";

/**
 * Builds the sequence of page items (page numbers and ellipsis markers) for a pagination component.
 *
 * Strategy:
 * - Always includes the first and last page (boundary pages).
 * - Derives how many sibling pages to show on each side of the current page from `maxButtons`,
 *   capped between 0 and 2 for layout sanity.
 * - Inserts "ellipsis" (string literal) where page ranges are skipped.
 * - Collapses gaps of exactly one page into a normal page number instead of an ellipsis.
 *
 * Ellipsis logic:
 * - A left ellipsis is shown if the first middle page is more than 2 steps after the first boundary.
 * - A right ellipsis is shown if the last middle page is more than 2 steps before the last boundary.
 *
 * Edge cases:
 * - If `totalPages <= 1`, returns `[1]`.
 * - If `maxButtons` is very small, siblings reduce accordingly (possibly zero).
 * - Ensures indices never exceed bounds and no duplicates appear.
 *
 * Performance:
 * - Runs in O(k) where k is the number of items in the final pagination model (typically small).
 *
 * @param totalPages Total number of available pages (must be >= 1).
 * @param current The currently active (1-based) page index. Values outside 1..totalPages may produce clamped ranges.
 * @param maxButtons The approximate maximum number of pagination buttons (including boundaries, current, siblings, and ellipses).
 *                   This is an advisory value used to derive sibling count; exact output length may be <= maxButtons.
 * @returns An ordered array of page items consisting of:
 *          - Page numbers (1-based)
 *          - The string literal "ellipsis" where a range is collapsed
 *
 * @example
 * // Basic sequence with no need for ellipsis
 * buildPageItems(5, 3, 7) // => [1, 2, 3, 4, 5]
 *
 * @example
 * // Ellipses on both sides
 * buildPageItems(20, 10, 9)
 * // => [1, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 20]
 *
 * @example
 * // Near the start
 * buildPageItems(15, 2, 7)
 * // => [1, 2, 3, 4, "ellipsis", 15]
 *
 * @example
 * // Near the end
 * buildPageItems(15, 14, 7)
 * // => [1, "ellipsis", 12, 13, 14, 15]
 *
 * @example
 * // Only one page
 * buildPageItems(1, 1, 5) // => [1]
 *
 * @remarks
 * The function assumes a `PageItem` type like:
 *   type PageItem = number | "ellipsis";
 */
export function buildPageItems(
    totalPages: number,
    current: number,
    maxButtons: number
): PageItem[] {
    if (totalPages <= 1) return [1];

    const boundaryCount = 1; // always show first and last
    // derive sibling count from maxButtons (which includes current + neighbors + boundaries + possible ellipses)
    // we’ll cap siblings between 0 and 2 for sane layouts
    const derivedSiblings = Math.max(
        0,
        Math.min(2, Math.floor((maxButtons - (boundaryCount * 2 + 1)) / 2))
    );
    const siblings = derivedSiblings;

    const range = (a: number, b: number) =>
        Array.from({ length: b - a + 1 }, (_, i) => a + i);

    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(
        Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
        totalPages
    );

    const start = Math.max(
        Math.min(
            current - siblings,
            totalPages - boundaryCount - siblings * 2 - 1
        ),
        boundaryCount + 2
    );
    const end = Math.min(
        Math.max(current + siblings, boundaryCount + siblings * 2 + 2),
        totalPages - boundaryCount - 1
    );

    const pages: PageItem[] = [...startPages];

    // left ellipsis or adjacent
    if (start > boundaryCount + 2) pages.push("ellipsis");
    else if (start === boundaryCount + 2) pages.push(boundaryCount + 1);

    // middle range
    if (start <= end) pages.push(...range(start, end));

    // right ellipsis or adjacent
    if (end < totalPages - boundaryCount - 1) pages.push("ellipsis");
    else if (end === totalPages - boundaryCount - 1)
        pages.push(totalPages - boundaryCount);

    pages.push(...endPages);
    return pages;
}
