interface SendPaymentResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}
interface SendPayoutResponse {
    ConversationID: string;
    OriginatorConversationID: string;
    ResponseCode: string;
    ResponseDescription: string;
}

declare class MpesaClient {
    private _env;
    private _consumer_key;
    private _consumer_secret;
    private _pass_key;
    private _business_short_code;
    private _callback_url;
    private _base_url;
    private _password;
    private _security_credential;
    constructor(props: Partial<{
        /**
         * @name env
         * @description The environment to use
         * @type {'sandbox' | 'production'}
         */
        env: 'sandbox' | 'production';
        /**
         * @name consumer_key
         * @description The consumer key got from the daraja portal
         * @type {string}
         */
        consumer_key: string;
        /**
         * @name consumer_secret
         * @description The consumer secret got from the daraja portal
         * @type {string}
         */
        consumer_secret: string;
        /**
         * @name pass_key
         * @description The pass key got from the daraja portal
         * @type {string}
         */
        pass_key: string;
        /**
         * @name business_short_code
         * @description The business short code got from the daraja portal
         * @type {number}
         */
        business_short_code: number;
        /**
         * @name callback_url
         * @description The callback url to be used by the mpesa api
         * @type {string}
         */
        callback_url: string;
        /**
         * @name b2c
         * @description The b2c credentials for b2c transactions
         * @type {Partial<{
         *  password: string,
         *  security_credential: string
         * }>}
         */
        b2c: Partial<{
            password: string;
            security_credential: string;
        }>;
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
         * @name description
         * @description The description of the transaction
         * @type {string}
         */
        description: string;
    }>): Promise<SendPayoutResponse>;
}

export { MpesaClient as default };
