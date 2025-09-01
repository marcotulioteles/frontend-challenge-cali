import { Notice } from "@/types/notice.model";
import { DynamicPhosphorIcon } from "../shared/dynamic-icon";

export default function BannerNotification({
    notice,
    onClose,
}: {
    notice: Notice;
    onClose: () => void;
}) {
    const { type, title, message, actionLabel, onAction } = notice;

    const styles = {
        success:
            "bg-emerald-50 text-emerald-600 border-l-4 border-l-emerald-600",
        warning: "bg-amber-50 text-amber-600 border-l-4 border-l-amber-600",
        error: "bg-red-50 text-red-600 border-l-4 border-l-red-600",
        info: "bg-blue-50 text-blue-600 border-l-4 border-l-blue-600",
    }[type];

    // accessibility: errors are assertive, others polite
    const aria =
        type === "error"
            ? { role: "alert", "aria-live": "assertive" as const }
            : { role: "status", "aria-live": "polite" as const };

    return (
        <div
            {...aria}
            className={`pointer-events-auto rounded-lg shadow-xl ${styles} 
                  mx-auto w-full max-w-3xl p-4 ring-1 ring-black/10
                  animate-slideDown`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    {title && (
                        <div className="font-semibold text-lg">{title}</div>
                    )}
                    <div className="text-sm">{message}</div>
                </div>

                {onAction && actionLabel && (
                    <button
                        onClick={onAction}
                        className="text-sm underline underline-offset-2"
                    >
                        {actionLabel}
                    </button>
                )}

                <button
                    onClick={onClose}
                    className="ml-2 rounded text-sm/none opacity-80 hover:opacity-100"
                    aria-label="Dismiss notification"
                >
                    <DynamicPhosphorIcon iconName="XIcon" size={16} />
                </button>
            </div>
        </div>
    );
}
