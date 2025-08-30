/**
 * Constrains a numeric value to lie within an inclusive lower and upper bound.
 *
 * If the provided number is less than the minimum, the minimum is returned.
 * If it is greater than the maximum, the maximum is returned.
 * Otherwise, the original number is returned unchanged.
 *
 * This utility is commonly used to:
 * - Keep pagination indices within valid page ranges.
 * - Prevent UI values (e.g., slider positions, zoom levels, opacity) from exceeding limits.
 * - Normalize external or user-provided input into a safe domain.
 *
 * @param n   The candidate number to clamp.
 * @param min The inclusive lower bound.
 * @param max The inclusive upper bound (should be >= min).
 *
 * @returns The clamped value, guaranteed to be between min and max (inclusive).
 *
 * @throws {Error} (Potential future consideration) This implementation does not throw,
 * but callers should ensure that min <= max; if not, the logic will still produce a
 * value, though the semantic intent is violated.
 *
 * @example
 * // Basic usage
 * clamp(5, 0, 10); // 5
 *
 * @example
 * // Below minimum
 * clamp(-3, 0, 10); // 0
 *
 * @example
 * // Above maximum
 * clamp(42, 0, 10); // 10
 *
 * @example
 * // Edge: min == max
 * clamp(7, 5, 5); // 5
 *
 * @example
 * // Floating point values
 * clamp(3.14, 0, 3); // 3
 *
 * @remarks
 * This function is inclusive on both ends. For exclusive bounds, additional checks
 * are needed after clamping.
 *
 * @see Math.min
 * @see Math.max
 */
export function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}