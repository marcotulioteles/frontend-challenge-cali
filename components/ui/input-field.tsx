import { forwardRef, InputHTMLAttributes, JSX, Ref, RefObject } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import type {
    FieldError,
    FieldValues,
    Path,
    UseFormRegister,
    UseFormRegisterReturn,
    RegisterOptions,
} from "react-hook-form";
import { DynamicPhosphorIcon, PhosphorIconName } from "../shared/dynamic-icon";
import { Mask } from "use-mask-input";
import { useHookFormMask } from "use-mask-input";

interface InputFieldProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    register?: UseFormRegister<TFieldValues>;
    registerOptions?: Parameters<UseFormRegister<TFieldValues>>[1];
    registerWithMask?: ReturnType<typeof useHookFormMask>;
    mask?: Mask;
    maskOptions?: RegisterOptions | unknown | undefined;
    error?: FieldError;
    type?: string;
    placeholder?: string;
    icon?: PhosphorIconName;
    size?: number;
    inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
    className?: string;
    containerClassName?: string;
}

const setRegisteredFn = <TFieldValues extends FieldValues>(
    name: Path<TFieldValues>,
    options: {
        registerWithMask?: ReturnType<typeof useHookFormMask>;
        mask?: Mask;
        maskOptions?: RegisterOptions | unknown | undefined;
        register?: UseFormRegister<TFieldValues>;
        registerOptions?: Parameters<UseFormRegister<TFieldValues>>[1];
    }
): UseFormRegisterReturn => {
    if (options.registerWithMask) {
        if (!options.mask) {
            throw new Error(
                "mask prop is required when using registerWithMask"
            );
        }
        return options.registerWithMask(
            name,
            options.mask,
            options.maskOptions
        );
    }
    if (options.register) {
        return options.register(name, {
            ...options.registerOptions,
        });
    }
    throw new Error("Either register or registerWithMask must be provided");
};

function BaseInputField<TFieldValues extends FieldValues>(
    {
        name,
        register,
        registerOptions,
        registerWithMask,
        mask,
        maskOptions,
        error,
        type = "text",
        placeholder,
        icon,
        size = 24,
        inputMode,
        className = "",
        containerClassName = "",
    }: InputFieldProps<TFieldValues>,
    ref: Ref<HTMLInputElement>
) {
    const invalid = !!error;

    // Extract setValueAs so we can apply it manually for display & avoid double transform
    let displayTransform: ((value: any) => any) | undefined;
    let cleanedRegisterOptions = registerOptions;
    if (registerOptions && typeof registerOptions.setValueAs === "function") {
        displayTransform = registerOptions.setValueAs;
        // remove it for RHF register
        const { setValueAs: _omit, ...rest } = registerOptions;
        cleanedRegisterOptions = rest;
    }

    const registered = setRegisteredFn<TFieldValues>(name, {
        register,
        registerOptions: cleanedRegisterOptions,
        registerWithMask,
        mask,
        maskOptions,
    });

    const {
        ref: registerRef,
        onChange: rhfOnChange,
        ...rest
    } = registered as UseFormRegisterReturn & {
        onChange?: (e: any) => void;
    };

    const combinedRef = (el: HTMLInputElement | null) => {
        registerRef(el);
        if (typeof ref === "function") {
            ref(el);
        } else if (ref && typeof ref === "object") {
            (ref as RefObject<HTMLInputElement | null>).current = el;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (displayTransform) {
            const transformed = displayTransform(e.target.value);
            if (transformed !== e.target.value) {
                e.target.value = transformed ?? "";
            }
        }
        rhfOnChange?.(e);
    };

    return (
        <div className={`text-left space-y-1 relative ${containerClassName}`}>
            {icon && (
                <DynamicPhosphorIcon
                    iconName={icon}
                    size={size}
                    className={`absolute top-4 left-0 ${
                        invalid ? "text-red-500" : "text-gray-400"
                    }`}
                />
            )}
            <input
                {...rest}
                ref={combinedRef}
                type={type}
                placeholder={placeholder}
                inputMode={inputMode}
                aria-invalid={invalid}
                onChange={handleChange}
                className={`input-field ${icon ? "pl-8" : ""} ${
                    invalid ? "text-red-500 placeholder:text-red-500" : ""
                } ${className}`}
            />
            {invalid && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                    <WarningCircleIcon size={16} />
                    {error?.message}
                </p>
            )}
        </div>
    );
}

const InputField = forwardRef(BaseInputField) as <
    TFieldValues extends FieldValues
>(
    p: InputFieldProps<TFieldValues> & { ref?: Ref<HTMLInputElement> }
) => JSX.Element;

export default InputField;
