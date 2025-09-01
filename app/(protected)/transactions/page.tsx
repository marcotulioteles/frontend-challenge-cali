import AddTransactionBtn from "../../../components/shared/add-transaction-btn";
import TransactionTable from "@/components/shared/transaction-table";
import HeaderLogoutBtn from "@/components/shared/header-logout-btn";
import AdminSearchTransaction from "@/components/shared/admin-search-transaction";
import TransactionPageHeader from "@/components/shared/transaction-page-header";
import AdminMessageBanner from "@/components/shared/admin-message-banner";

export default async function Page() {
    return (
        <main className="flex flex-col items-center min-h-screen w-full">
            <TransactionPageHeader />
            <AdminMessageBanner />
            <AddTransactionBtn />
            {/* TODO: Implement AdminSearchTransaction when functionality is refined */}
            {/* <AdminSearchTransaction /> */}
            <TransactionTable />
        </main>
    );
}
