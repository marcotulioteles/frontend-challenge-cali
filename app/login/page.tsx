"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import { loginWithEmailAndPassword } from "@/lib/actions/login";
import { API_URL_MAP } from "@/helpers/api/api-url-map";
import { enqueueFlash } from "@/lib/flash-notification/flash-notification";
import { useNotifications } from "@/providers/notifications-provider";
import { FirebaseError } from "firebase/app";

const schema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be at most 100 characters"),
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
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const { notify } = useNotifications();

    const onSubmit = async (data: FormValues) => {
        try {
            await loginWithEmailAndPassword(data.email, data.password);
            await fetch(API_URL_MAP.users.me.roles, {
                credentials: "include",
                cache: "no-store",
            });
            router.replace("/transactions");
            reset();
        } catch (error: unknown) {
            const firebaseError = error as FirebaseError;
            const msg =
                firebaseError?.code === "auth/invalid-credential"
                    ? "Invalid credentials, please check your email and password."
                    : "Error logging in, please try again later.";
            notify({
                type: "error",
                message: msg,
                duration: 5000,
                title: "Login Error",
            });
        }
    };

    return (
        <main className="grid min-h-screen bg-gradient-to-br from-primary-900 from-5% via-primary-400 via-60% to-primary-900 to-100%">
            <div className="flex flex-col items-center md:grid md:grid-cols-2 md:gap-6 w-full max-w-7xl p-6 m-auto">
                <div className="mb-8 self-center">
                    <h1 className="text-5xl md:text-6xl xl:text-8xl font-bold text-white mb-4">
                        payment app
                    </h1>
                    <span className="text-white text-sm md:text-base">
                        powered by Marco Reis
                    </span>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="bg-white p-8 rounded-xl shadow-2xl h-fit w-full m-auto md:max-w-sm space-y-6"
                >
                    <h1 className="text-4xl font-bold mb-6 text-primary-400 mx-auto w-fit">
                        Login
                    </h1>
                    <div className="grid gap-6">
                        <InputField
                            name="email"
                            register={register}
                            error={errors.email}
                            placeholder="Email"
                            type="email"
                            icon="EnvelopeSimpleIcon"
                        />
                        <InputField
                            name="password"
                            register={register}
                            error={errors.password}
                            placeholder="Password"
                            type="password"
                            icon="LockSimpleIcon"
                        />
                        <button
                            className="flex items-center justify-center primary-btn mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="w-fit flex items-center gap-2 justify-center">
                                    <span>Login in...</span>
                                    <CircleNotchIcon className="animate-spin" />
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                        <div>
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    href="/register"
                                    className="text-primary-400 hover:font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
