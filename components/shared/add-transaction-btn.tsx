"use client";

import { useState } from "react";
import Modal from "../ui/modal";
import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";

export default function AddTransactionBtn() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
            <Modal
                showCloseBtn
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <h1 className="font-title text-2xl mb-6">Create Transaction</h1>
                <form>
                    <div className="max-w-sm space-y-6">
                        <input
                            type="text"
                            id="card-number"
                            className="input-field"
                            placeholder="0000 0000 0000 0000"
                        />
                        <input
                            type="text"
                            id="cardholder-name"
                            className="input-field"
                            placeholder="Cardholder Name"
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                id="expiration-date"
                                className="input-field"
                                placeholder="MM/YY"
                            />
                            <input
                                type="number"
                                id="security-code"
                                className="input-field"
                                placeholder="Security Code"
                            />
                        </div>
                        <input
                            type="number"
                            id="amount"
                            className="input-field"
                            placeholder="R$ 0,00"
                        />
                    </div>
                    <button
                        type="submit"
                        className="primary-btn font-medium mt-6 flex items-center justify-center"
                    >
                        <CreditCardIcon className="mr-2" size={28} />
                        Add Transaction
                    </button>
                </form>
            </Modal>
        </div>
    );
}
