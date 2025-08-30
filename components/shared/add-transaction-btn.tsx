"use client";

import { useState } from "react";
import Modal from "../ui/modal";
import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";

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

    const onSubmit = (data: FormValues) => {
        console.log("Submit transaction:", data);
        reset();
        setIsOpen(false);
    };

    const inputErr = (field?: { message?: string }) =>
        field ? (
            <p className="text-xs text-red-500 mt-1">{field.message}</p>
        ) : null;

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
                        <div>
                            <input
                                type="text"
                                className={`input-field ${
                                    errors.cardNumber && "border-red-500"
                                }`}
                                placeholder="0000 0000 0000 0000"
                                {...registerWithMask("cardNumber", [
                                    "9999 9999 9999 9999",
                                ])}
                                inputMode="numeric"
                            />
                            {inputErr(errors.cardNumber)}
                        </div>
                        <div>
                            <input
                                type="text"
                                className={`input-field placeholder:capitalize ${
                                    errors.cardholderName && "border-red-500"
                                }`}
                                placeholder="Cardholder Name"
                                style={{ textTransform: "uppercase" }}
                                {...register("cardholderName", {
                                    setValueAs: (v) =>
                                        v ? v.toUpperCase() : "",
                                })}
                            />
                            {inputErr(errors.cardholderName)}
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    className={`input-field ${
                                        errors.expirationDate &&
                                        "border-red-500"
                                    }`}
                                    placeholder="MM/YY"
                                    {...registerWithMask("expirationDate", [
                                        "99/99",
                                    ])}
                                />
                                {inputErr(errors.expirationDate)}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className={`input-field ${
                                        errors.securityCode && "border-red-500"
                                    }`}
                                    placeholder="Security Code"
                                    {...registerWithMask("securityCode", [
                                        "999",
                                        "9999",
                                    ])}
                                    inputMode="numeric"
                                />
                                {inputErr(errors.securityCode)}
                            </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                className={`input-field ${
                                    errors.amount && "border-red-500"
                                }`}
                                placeholder="R$ 0,00"
                                {...registerWithMask(
                                    "amount",
                                    [
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
                                    ],
                                    {
                                        regex: "^R$s?(?:0|[1-9]d{0,2}|[1-9]d{0,2}.d{3}|[1-9]d{0,2}.d{3}.d{3}|[1-9]d.d{3}.d{3}.d{3}),d{2}$",
                                    }
                                )}
                            />
                            {inputErr(errors.amount)}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="primary-btn font-medium mt-6 flex items-center justify-center disabled:opacity-60"
                    >
                        <CreditCardIcon className="mr-2" size={28} />
                        {isSubmitting ? "Saving..." : "Add Transaction"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
