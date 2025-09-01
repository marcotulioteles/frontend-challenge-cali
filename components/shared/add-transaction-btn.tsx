"use client";

import { useState } from "react";
import Modal from "../ui/modal";
import { CreditCardIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";
import InputField from "../ui/input-field";
import { HttpMethods } from "@/types/http-methods.enum";
import { httpRequest } from "@/helpers/api/http-request";
import { Transaction } from "@/types/transaction.model";
import { API_URL_MAP } from "@/helpers/api/api-url-map";
import { useNotifications } from "@/providers/notifications-provider";

const schema = z.object({
    cardNumber: z
        .string()
        .min(1, "Card number is required")
        .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Invalid card number"),
    cardholderName: z.string().min(1, "Cardholder name is required"),
    expirationDate: z
        .string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)")
        .refine(
            (val) => {
                const [, yy] = val.split("/");
                const currentYY = new Date().getFullYear() % 100;
                const expYY = parseInt(yy, 10);
                return expYY >= currentYY;
            },
            { message: "Expiration year cannot be in the past" }
        ),
    securityCode: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
    amount: z
        .string()
        .regex(
            /^R\$\s?(?:(?:0,(?:0[1-9]|[1-9]\d))|(?:[1-9]\d{0,2}(?:\.\d{3})*,\d{2}))$/,
            "Amount is required"
        ),
});

type FormValues = z.infer<typeof schema>;

export default function AddTransactionBtn() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { notify } = useNotifications();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            cardNumber: "",
            cardholderName: "",
            expirationDate: "",
            securityCode: "",
            amount: undefined,
        },
    });

    const registerWithMask = useHookFormMask(register);

    const onSubmit = async (data: FormValues) => {
        try {
            const body = {
                cardholderName: data.cardholderName,
                card: {
                    last4: data.cardNumber.slice(-4),
                    expirationDate: data.expirationDate,
                },
                amount: Number(
                    data.amount
                        .replace("R$", "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                        .trim()
                ),
            } as Omit<Transaction, "id" | "userId" | "status" | "createdAt">;
            const res = (await httpRequest(
                API_URL_MAP.transactions.create,
                HttpMethods.POST,
                body
            )) as { transaction?: Transaction };
            if (res) {
                reset();
                setIsOpen(false);
                notify({
                    type: "success",
                    message: "Transaction created successfully!",
                    title: "Success",
                });
            }
        } catch (error) {
            throw error;
        }
    };

    const handleCloseDialog = () => {
        reset();
        setIsOpen(false);
    };

    return (
        <div className="flex w-full max-w-7xl py-6 px-6 xl:px-0">
            <button
                className="primary-btn md:w-fit px-4 font-semibold mx-auto xl:mx-0 flex items-center gap-1"
                type="button"
                onClick={() => setIsOpen(true)}
            >
                <CreditCardIcon className="mr-2" size={28} />
                Add Transaction
            </button>
            <Modal showCloseBtn isOpen={isOpen} onClose={handleCloseDialog}>
                <h1 className="font-title text-2xl mb-6">Create Transaction</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="max-w-sm space-y-6">
                        <InputField
                            name="cardNumber"
                            registerWithMask={registerWithMask}
                            mask={["9999 9999 9999 9999"]}
                            error={errors.cardNumber}
                            placeholder="0000 0000 0000 0000"
                            type="text"
                            icon="CreditCardIcon"
                            inputMode="numeric"
                        />
                        <InputField
                            name="cardholderName"
                            register={register}
                            registerOptions={{
                                setValueAs: (v) => (v ? v.toUpperCase() : ""),
                            }}
                            error={errors.cardholderName}
                            placeholder="cardholder name"
                            type="text"
                            icon="UserIcon"
                            inputMode="numeric"
                            className="placeholder: capitalize"
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            <InputField
                                name="expirationDate"
                                registerWithMask={registerWithMask}
                                mask={["99/99"]}
                                error={errors.expirationDate}
                                placeholder="MM/YY"
                                type="text"
                                icon="CalendarCheckIcon"
                                inputMode="numeric"
                            />
                            <InputField
                                name="securityCode"
                                registerWithMask={registerWithMask}
                                mask={["999", "9999"]}
                                error={errors.securityCode}
                                placeholder="Security Code"
                                type="text"
                                icon="PasswordIcon"
                                inputMode="numeric"
                            />
                        </div>
                        <InputField
                            name="amount"
                            registerWithMask={registerWithMask}
                            mask={[
                                "R$ 9,99",
                                "R$ 99,99",
                                "R$ 999,99",
                                "R$ 9.999,99",
                                "R$ 99.999,99",
                                "R$ 999.999,99",
                                "R$ 9.999.999,99",
                                "R$ 99.999.999,99",
                                "R$ 999.999.999,99",
                                "R$ 9.999.999.999,99",
                            ]}
                            maskOptions={{
                                regex: "^R$s?(?:0|[1-9]d{0,2}|[1-9]d{0,2}.d{3}|[1-9]d{0,2}.d{3}.d{3}|[1-9]d.d{3}.d{3}.d{3}),d{2}$",
                            }}
                            error={errors.amount}
                            placeholder="R$ 0,00"
                            type="text"
                            icon="MoneyWavyIcon"
                            inputMode="numeric"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="primary-btn font-medium mt-6 flex items-center justify-center disabled:opacity-60"
                    >
                        <PlusIcon className="mr-2" size={28} />
                        {isSubmitting ? "Saving..." : "Add Transaction"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
