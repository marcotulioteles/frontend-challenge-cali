/**
 * Builds a space–separated Tailwind CSS class string for a pagination button
 * based on its visual state.
 *
 * The function composes a base style plus conditional variants for:
 * - Active (current page): highlighted with primary colors and bold text.
 * - Muted (non-active, secondary style): neutral border/text with subtle hover.
 * - Disabled: reduced opacity and non-interactive cursor.
 *
 * Focus styles (ring) are always included for accessibility unless disabled.
 *
 * Priority of states:
 * 1. active overrides muted.
 * 2. disabled only affects interactivity/opacity; it does not remove structural styles.
 *
 * @param opts - Optional flags controlling the visual state.
 * @param opts.active - If true, applies the "current page" emphasized style.
 * @param opts.muted - If true, applies a subdued neutral style (ignored if active is true).
 * @param opts.disabled - If true, applies disabled cursor and reduced opacity.
 *
 * @returns A concatenated string of Tailwind (and utility) classes suitable for a button element.
 *
 * @example
 * // Active page button
 * const cls = buttonClass({ active: true });
 *
 * @example
 * // Muted (regular) page button
 * const cls = buttonClass({ muted: true });
 *
 * @example
 * // Disabled next button
 * const cls = buttonClass({ disabled: true });
 *
 * @example
 * // Default (no special state)
 * const cls = buttonClass({});
 */
export function buttonClass(opts: {
    active?: boolean;
    muted?: boolean;
    disabled?: boolean;
}) {
    const base =
        "h-10 min-w-10 px-3 inline-flex items-center justify-center rounded-lg border text-sm transition select-none transition-all duration-300";
    const focus =
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400";
    const disabled = opts.disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer";
    if (opts.active) {
        return `${base} ${focus} ${disabled} font-bold border-primary-400 bg-primary-400 text-white`;
    }
    if (opts.muted) {
        return `${base} ${focus} ${disabled} border-gray-300 text-gray-800 bg-white hover:bg-gray-100`;
    }
    return `${base} ${focus} ${disabled} border-gray-300 bg-white hover:bg-gray-100`;
}