"use client";

import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../ui/input-field";
import { DynamicPhosphorIcon } from "./dynamic-icon";

const schema = z.object({
    filter: z.enum(["all", "approved", "declined", "cardholderName"]),
    searchTerm: z.string().min(2).max(100),
});

type AdminSearchFormValues = z.infer<typeof schema>;

export default function AdminSearchTransaction() {
    const { roles } = useAuth();
    const { register, handleSubmit, watch } = useForm<AdminSearchFormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            filter: "all",
            searchTerm: "",
        },
    });

    const isAdmin = roles.includes("admin");

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="grid sm:flex items-center gap-2 py-6 px-6 xl:px-0 w-full max-w-7xl mx-auto">
            <form className="grid sm:flex items-end gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">
                        Filter by:
                    </span>
                    <select
                        className="border border-gray-300 rounded-md p-2"
                        id="filter"
                        {...register("filter")}
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                        <option value="cardholderName">Cardholder Name</option>
                    </select>
                </div>
                {watch("filter") === "cardholderName" && (
                    <>
                        <div>
                            <InputField
                                type="text"
                                name="searchTerm"
                                placeholder="Enter cardholder name"
                                register={register}
                                className="w-full sm:w-64"
                            />
                        </div>
                        <button type="submit" className="primary-btn">
                            <div className="flex items-center gap-2 sm:px-4 w-fit mx-auto">
                                <DynamicPhosphorIcon
                                    iconName="MagnifyingGlassIcon"
                                    size={24}
                                />
                                <span>Search</span>
                            </div>
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
