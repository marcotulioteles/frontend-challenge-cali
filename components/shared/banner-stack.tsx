import { Notice } from "@/types/notice.model";
import BannerNotification from "../ui/banner-notification";

interface BannerStackProps {
    stack: Notice[];
    dismiss: (id: string) => void;
}

export default function BannerStack({ stack, dismiss }: BannerStackProps) {
    return (
        <div className="fixed top-0 inset-x-0 z-50 flex flex-col gap-2 p-3 pointer-events-none">
            {stack.map((n) => (
                <BannerNotification
                    key={n.id}
                    notice={n}
                    onClose={() => dismiss(n.id)}
                />
            ))}
        </div>
    );
}
