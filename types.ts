
interface AccessTokenResponse {
    access_token: string;
    expires_in: string;
}

interface SendPaymentRequestBody {
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

interface SendPaymentResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}


interface SendPayoutRequest {
    InitiatorName: string;
    SecurityCredential: string;
    CommandID: string;
    Amount: number;
    PartyA: number;
    PartyB: number;
    Remarks: string;
    QueueTimeOutURL: string;
    ResultURL: string;
    Occassion: string;
}


interface SendPayoutResponse {
    ConversationID: string;
    OriginatorConversationID: string;
    ResponseCode: string;
    ResponseDescription: string;
}


interface PaymentRequestCallback {
    Body: {
        
    }
}