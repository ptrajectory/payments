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
    CommandID: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment';
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
type B2BSetupCredentials = Partial<{
    /**
     * The password for the initiator security credential
     */
    password: string;
    /**
     * The security credential for the initiator
     */
    security_credential: string;
    /**
     * The consumer key for the app
     */
    consumer_key: string;
    /**
     * The consumer secret for the app
     */
    consumer_secret: string;
    /**
     * The pass key for the app
     */
    pass_key: string;
    /**
     * The short code for the app
     */
    short_code: number;
    /**
     * The business name for the app, will be used to identify the initiator
     */
    business_name: string;
}>;
type C2BSetupCredentials = Partial<{
    /**
     * The consumer key for the app
     */
    consumer_key: string;
    /**
     * The consumer secret for the app
     */
    consumer_secret: string;
    /**
     * The pass key for the app
     */
    pass_key: string;
    /**
     * The short code for the app
     */
    short_code: number;
    /**
     * The business name for the app, will be used for the initiator name value
     */
    business_name: string;
}>;

declare class MpesaClient {
    private _env;
    private _callback_url;
    private _base_url;
    private _b2c;
    private _c2b;
    constructor(props: Partial<{
        /**
         * @name env
         * @description The environment to use
         * @type {'sandbox' | 'production'}
         */
        env: 'sandbox' | 'production';
        /**
         * @name b2c
         * @description The b2c credentials, if you plan to use the b2c api
         * @type {B2BSetupCredentials}
         */
        b2c: B2BSetupCredentials;
        /**
         * @name c2b
         * @description The c2b credentials, if you plan to use the c2b api
         * @type {C2BSetupCredentials}
         */
        c2b: C2BSetupCredentials;
        /**
         * @name callback_url
         * @description The callback url to use for the api,
         * **Note** do not postfix the url with a `/` also, the url needs to be https
         * @example https://example.com and not https://example.com/ or http://example.com
         */
        callback_url: string;
    }>);
    /**
     * @name generate_access_token
     * @description Generates an access token for the mpesa api
     * @returns
     */
    private _generate_access_token;
    private _generate_password;
    /**
     * @name send_payment_request
     * @description Sends a payment request to the mpesa api
     * @example
     * ```ts
     * const client = new MpesaClient({
     *   env: 'sandbox',
     *   consumer_key: process.env.MPESA_CONSUMER_KEY,
     *   consumer_secret: process.env.MPESA_CONSUMER_SECRET,
     *   pass_key: process.env.MPESA_PASSKEY,
     *   business_short_code: process.env.MPESA_SHORTCODE,
     *   callback_url: ''
     * })
     * @param props
     * @returns
     */
    send_payment_request(props: Partial<{
        /**
         * @name transaction_type
         * @description The type of transaction to be performed
         * @type {'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline'}
         */
        transaction_type: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
        /**
         * @name amount
         * @description The amount to be sent
         * @type {number}
         */
        amount: number;
        /**
         * @name phone_number
         * @description The phone number to send the money to
         * @type {number}
         */
        phone_number: number;
        /**
         * @name transaction_desc
         * @description The description of the transaction
         * @type {string}
         */
        transaction_desc: string;
    }>): Promise<SendPaymentResponse>;
    send_payout_request(props: Partial<{
        /**
         * @name amount
         * @description The amount to be sent
         * @type {number}
         */
        amount: number;
        /**
         * @name transaction_type
         * @description The type of transaction to be performed
         * @type {'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment'}
         */
        transaction_type: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment';
        /**
         * @name phone_number
         * @description The phone number to send the money to
         * @type {number}
         */
        phone_number: number;
        /**
         * @name transaction_desc
         * @description The description of the transaction
         * @type {string}
         */
        transaction_desc: string;
    }>): Promise<SendPayoutResponse>;
    /**
     * @name set_callback_url
     * @description for testing purposes, i.e when you need to dynamically change the callback url
     * @param url
     */
    set_callback_url(url: string): void;
    /**
     * @name set_client
     * !!! INTERNAL USE ONLY !!!
     * @description this is for any clients e.g the express client, that rely on this client to set the env
     * @param props
     */
    set_client(props: Partial<{
        env: 'sandbox' | 'production';
        b2c_business_name: string;
        c2b_business_name: string;
    }>): void;
}

export { MpesaClient as M, SendPaymentResponse as S, SendPayoutResponse as a, SendPayoutRequest as b };
