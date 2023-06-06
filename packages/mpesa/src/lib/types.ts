
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


export type B2BSetupCredentials = Partial<{
    /**
     * The password for the initiator security credential
     */
    password: string,
    /**
     * The security credential for the initiator
     */
    security_credential: string
    /**
     * The consumer key for the app
     */
    consumer_key: string,
    /**
     * The consumer secret for the app
     */
    consumer_secret: string,
    /**
     * The pass key for the app
     */
    pass_key: string,
    /**
     * The short code for the app
     */
    short_code: number,
    /**
     * The business name for the app, will be used to identify the initiator
     */
    business_name: string,
}>


export type C2BSetupCredentials = Partial<{
    /**
     * The consumer key for the app
     */
    consumer_key: string,
    /**
     * The consumer secret for the app
     */
    consumer_secret: string,
    /**
     * The pass key for the app
     */
    pass_key: string,
    /**
     * The short code for the app
     */
    short_code: number,
    /**
     * The business name for the app, will be used for the initiator name value
     */
    business_name: string,
}>