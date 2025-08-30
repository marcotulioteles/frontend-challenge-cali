"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CircleNotchIcon,
    EnvelopeSimpleIcon,
    LockSimpleIcon,
    PasswordIcon,
    UserIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

const schema = z
    .object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[a-z]/, "Must contain at least one lowercase letter")
            .regex(/\d/, "Must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type FormValues = z.infer<typeof schema>;

export default function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        try {
            await new Promise((r) => setTimeout(r, 800));
            console.log("Form submit", data);
            reset();
            router.push("/transactions");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <main className="grid w-full min-h-screen bg-gradient-to-br from-primary-900 from-5% via-primary-400 via-60% to-primary-900 to-100% text-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="bg-white p-8 rounded-xl shadow-2xl h-fit w-full m-auto md:max-w-sm space-y-6"
            >
                <h1 className="text-4xl font-bold mb-6 text-primary-400 mx-auto w-fit">
                    Sign Up
                </h1>
                <div className="grid gap-6">
                    <div className="text-left space-y-1 relative">
                        <UserIcon
                            className={`absolute top-4 left-0 text-gray-400 ${
                                errors.fullName && "text-red-500"
                            }`}
                            size={24}
                        />
                        <input
                            className={`input-field pl-8 ${
                                errors.fullName
                                    ? "text-red-500 placeholder:text-red-500"
                                    : ""
                            }`}
                            type="text"
                            placeholder="Full Name"
                            {...register("fullName")}
                            aria-invalid={!!errors.fullName}
                        />
                        {errors.fullName && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <WarningCircleIcon size={16} />
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div className="text-left space-y-1 relative">
                        <EnvelopeSimpleIcon
                            className={`absolute top-4 left-0 text-gray-400 ${
                                errors.email && "text-red-500"
                            }`}
                            size={24}
                        />
                        <input
                            className={`input-field pl-8 ${
                                errors.email
                                    ? "text-red-500 placeholder:text-red-500"
                                    : ""
                            }`}
                            type="email"
                            placeholder="Email"
                            {...register("email")}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <WarningCircleIcon size={16} />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="text-left space-y-1 relative">
                        <LockSimpleIcon
                            className={`absolute top-4 left-0 text-gray-400 ${
                                errors.password && "text-red-500"
                            }`}
                            size={24}
                        />
                        <input
                            className={`input-field pl-8 ${
                                errors.password
                                    ? "text-red-500 placeholder:text-red-500"
                                    : ""
                            }`}
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            aria-invalid={!!errors.password}
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <WarningCircleIcon size={16} />
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="text-left space-y-1 relative">
                        <PasswordIcon
                            className={`absolute top-4 left-0 text-gray-400 ${
                                errors.confirmPassword && "text-red-500"
                            }`}
                            size={24}
                        />
                        <input
                            className={`input-field pl-8 ${
                                errors.confirmPassword
                                    ? "text-red-500 placeholder:text-red-500"
                                    : ""
                            }`}
                            type="password"
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                            aria-invalid={!!errors.confirmPassword}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                                <WarningCircleIcon size={16} />
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        className="flex items-center justify-center primary-btn mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="w-fit flex items-center gap-2 justify-center">
                                <span>Signing Up...</span>
                                <CircleNotchIcon className="animate-spin" />
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    <div>
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-primary-400 hover:font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </main>
    );
}
