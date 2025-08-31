import AddTransactionBtn from "../../../components/shared/add-transaction-btn";
import TransactionTable from "@/components/shared/transaction-table";
import HeaderLogoutBtn from "@/components/shared/header-logout-btn";

const transactions = [
    {
        id: "transaction-0001",
        cardholderName: "John Doe",
        cardNumber: "**** **** **** 1234",
        expirationDate: "12/25",
        value: 100.01,
        status: "approved",
    },
    {
        id: "transaction-0002",
        cardholderName: "Will Smith",
        cardNumber: "**** **** **** 5678",
        expirationDate: "11/27",
        value: 12188.08,
        status: "declined",
    },
    {
        id: "transaction-0003",
        cardholderName: "Christian Bale",
        cardNumber: "**** **** **** 9012",
        expirationDate: "09/32",
        value: 208.12,
        status: "approved",
    },
    {
        id: "transaction-0004",
        cardholderName: "Robert Downey Jr.",
        cardNumber: "**** **** **** 3456",
        expirationDate: "10/30",
        value: 555.39,
        status: "approved",
    },
    {
        id: "transaction-0005",
        cardholderName: "Chris Hemsworth",
        cardNumber: "**** **** **** 7890",
        expirationDate: "08/29",
        value: 732.01,
        status: "approved",
    },
    {
        id: "transaction-0006",
        cardholderName: "Tom Holland",
        cardNumber: "**** **** **** 1234",
        expirationDate: "12/25",
        value: 607.89,
        status: "approved",
    },
    {
        id: "transaction-0007",
        cardholderName: "Scarlett Johansson",
        cardNumber: "**** **** **** 5678",
        expirationDate: "11/27",
        value: 1742.99,
        status: "declined",
    },
    {
        id: "transaction-0008",
        cardholderName: "Benedict Cumberbatch",
        cardNumber: "**** **** **** 9012",
        expirationDate: "09/32",
        value: 802.76,
        status: "approved",
    },
    {
        id: "transaction-0009",
        cardholderName: "Tom Hiddleston",
        cardNumber: "**** **** **** 3456",
        expirationDate: "10/30",
        value: 901.12,
        status: "approved",
    },
    {
        id: "transaction-0010",
        cardholderName: "Chris Evans",
        cardNumber: "**** **** **** 7890",
        expirationDate: "08/29",
        value: 999.98,
        status: "approved",
    },
];

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
            <TransactionTable transactions={transactions} />
        </main>
    );
}
