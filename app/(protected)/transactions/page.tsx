import AddTransactionBtn from "../../../components/shared/add-transaction-btn";
import TransactionTable from "@/components/shared/transaction-table";
import HeaderLogoutBtn from "@/components/shared/header-logout-btn";
import AdminSearchTransaction from "@/components/shared/admin-search-transaction";

export default async function Page() {
    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            <header className="flex items-center w-full bg-gradient-to-r from-primary-800 from-10% via-primary-400 via-50% to-primary-800 to-100%">
                <div className="grid xl:grid-cols-2 gap-4 w-full max-w-7xl mx-auto py-10 px-6 xl:px-0 items-center justify-center xl:justify-start">
                    <h1 className="font-title text-2xl xl:text-4xl text-white font-light">
                        Transaction History
                    </h1>
                    <div className="flex items-center gap-2 justify-self-center xl:justify-self-end">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full font-light bg-gray-200 text-primary-400">
                            AD
                        </div>
                        <HeaderLogoutBtn />
                    </div>
                </div>
            </header>
            <AddTransactionBtn />
            <AdminSearchTransaction />
            <TransactionTable />
        </main>
    );
}
