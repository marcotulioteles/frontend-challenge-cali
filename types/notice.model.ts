export type NoticeType = "success" | "warning" | "error" | "info";

export type Notice = {
    id: string;
    type: NoticeType;
    title?: string;
    message: string;
    duration?: number;
    actionLabel?: string;
    onAction?: () => void;
};