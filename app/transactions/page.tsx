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
                        <button className="text-sm text-white" type="button">
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex w-full max-w-7xl py-6 px-6 xl:px-0">
                <button
                    className="primary-btn md:w-fit px-4 text-sm font-semibold mx-auto xl:mx-0"
                    type="button"
                >
                    Add Transaction
                </button>
            </div>
            <div className="grid w-full max-w-7xl pb-10 px-6 xl:px-0">
                <header className="hidden md:grid grid-cols-5 gap-4 w-full border-b border-gray-300 p-4 text-primary-400 uppercase text-xs font-extrabold font-title tracking-widest">
                    <span>Cardholder Name</span>
                    <span>Card Number</span>
                    <span>Expiration Date</span>
                    <span>Value</span>
                    <span>Status</span>
                </header>
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="grid md:grid-cols-5 gap-4 w-full border-b border-gray-300 p-4 hover:bg-primary-50/50 transition-all duration-300 hover:border-b-primary-400 text-gray-600"
                    >
                        <span className="text-sm uppercase tracking-widest">
                            <strong className="font-light text-xs text-gray-500 block md:hidden normal-case">
                                Cardholder Name
                            </strong>
                            {transaction.cardholderName}
                        </span>
                        <span className="tracking-widest">
                            <strong className="font-light text-xs text-gray-500 block md:hidden">
                                Card Number
                            </strong>
                            {transaction.cardNumber}
                        </span>
                        <span className="tracking-widest">
                            <strong className="font-light text-xs text-gray-500 block md:hidden">
                                Expiration Date
                            </strong>
                            {transaction.expirationDate}
                        </span>
                        <span className="text-base tracking-widest">
                            <strong className="font-light text-xs text-gray-500 block md:hidden">
                                Value
                            </strong>
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(transaction.value)}
                        </span>
                        <div>
                            <span className="font-light text-xs text-gray-500 mb-2 block md:hidden tracking-widest">
                                Status
                            </span>
                            <span
                                className={`w-fit text-xs rounded font-medium px-4 py-1 border uppercase tracking-widest ${
                                    transaction.status === "approved"
                                        ? "border-green-500 text-green-700 bg-green-100"
                                        : "border-red-500 text-red-700 bg-red-100"
                                }`}
                            >
                                {transaction.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
