
export interface AccessTokenResponse {
    access_token: string;
    expires_in: string;
}

export interface SendPaymentRequestBody {
    BusinessShortCode: number;
    Password: string;
    Timestamp: string;
    TransactionType: string;
    Amount: number;
    PartyA: number;
    PartyB: number;
    PhoneNumber: number;
    CallBackURL: string;
    AccountReference: string;
    TransactionDesc: string;
}

export interface SendPaymentResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}


export interface SendPayoutRequest {
    InitiatorName: string;
    SecurityCredential: string;
    CommandID: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment';
    Amount: number;
    PartyA: number;
    PartyB: number;
    Remarks: string;
    QueueTimeOutURL: string;
    ResultURL: string;
    Occassion: string;
}


export interface SendPayoutResponse {
    ConversationID: string;
    OriginatorConversationID: string;
    ResponseCode: string;
    ResponseDescription: string;
}


export interface PaymentRequestCallback {
    Body: {
        
    }
}