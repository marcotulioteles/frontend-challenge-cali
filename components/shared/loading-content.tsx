import { DynamicPhosphorIcon } from "./dynamic-icon";

export default function LoadingContent() {
    return (
        <div className="flex flex-col items-center gap-2 justify-center">
            <DynamicPhosphorIcon
                iconName="CircleNotchIcon"
                size={48}
                className="fill-primary-400 animate-spin"
            />
            <p className="text-gray-500 text-2xl font-light animate-pulse">
                Loading...
            </p>
        </div>
    );
}
