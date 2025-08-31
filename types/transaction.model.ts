export enum TransactionStatus {
    APPROVED = 'approved',
    DECLINED = 'declined'
}

export interface Transaction {
    id: string;
    userId: string;
    cardholderName: string;
    card: {
        last4: string;
        expirationDate: string;
    };
    amount: number;
    status: TransactionStatus;
}
