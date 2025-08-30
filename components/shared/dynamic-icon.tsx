import * as PhosphorIconsAll from "@phosphor-icons/react/dist/ssr";
import { IconProps } from "@phosphor-icons/react";
import React from "react";

const excludedExports = new Set([
    "IconContext",
    "IconBase",
    "Icon",
    "IconProps",
    "IconWeight",
]);

const PhosphorIcons = Object.fromEntries(
    Object.entries(PhosphorIconsAll).filter(
        ([key]) => !excludedExports.has(key)
    )
) as Record<string, React.FC<any>>;

export type PhosphorIconName = keyof typeof PhosphorIconsAll;

type DynamicPhosphorIconProps = IconProps & {
    iconName: PhosphorIconName;
};

export function DynamicPhosphorIcon({
    iconName,
    color,
    size = 32,
    ...rest
}: DynamicPhosphorIconProps) {
    const IconComponent = PhosphorIcons[iconName];

    if (!IconComponent) return <span>Icon not found</span>;

    return (
        <IconComponent
            {...rest}
            color={color}
            size={size}
            style={{ transition: "fill 0.3s ease-in" }}
        />
    );
}
