"use client";

import { useEffect } from "react";
import { useNotifications } from "@/providers/notifications-provider";
import type { FlashNotice } from "@/lib/flash-notification/flash-notification";

export default function FlashHydrator({ initial }: { initial: FlashNotice[] }) {
    const { notify } = useNotifications();

    useEffect(() => {
        if (!initial?.length) return;
        // Push in order so they stack deterministically
        initial.forEach((n) => notify(n));
    }, [initial, notify]);

    return null;
}
