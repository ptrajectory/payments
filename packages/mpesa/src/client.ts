import axios, { AxiosError } from "axios"
import { AccessTokenResponse, SendPaymentRequestBody, SendPaymentResponse, SendPayoutRequest, SendPayoutResponse } from "./lib/types.ts"
import { format_mpesa_date } from "./lib/utils.ts"
import fetch from 'node-fetch'




class MpesaClient {
    private _env = 'sandbox'
    private _consumer_key = ''
    private _consumer_secret = ''
    private _pass_key = ''
    private _business_short_code: number
    private _callback_url = ''
    private _base_url = 'https://sandbox.safaricom.co.ke'
    private _password = ''
    private _security_credential = ''

    constructor(props: Partial<{
        /**
         * @name env
         * @description The environment to use
         * @type {'sandbox' | 'production'}
         */
        env: 'sandbox' | 'production',
        /**
         * @name consumer_key
         * @description The consumer key got from the daraja portal
         * @type {string}
         */
        consumer_key: string,
        /**
         * @name consumer_secret
         * @description The consumer secret got from the daraja portal
         * @type {string}
         */
        consumer_secret: string,
        /**
         * @name pass_key
         * @description The pass key got from the daraja portal
         * @type {string}
         */
        pass_key: string, 
        /**
         * @name business_short_code
         * @description The business short code got from the daraja portal
         * @type {number}
         */
        business_short_code: number,
        /**
         * @name callback_url
         * @description The callback url to be used by the mpesa api
         * @type {string}
         */
        callback_url: string
        /**
         * @name b2c
         * @description The b2c credentials for b2c transactions
         * @type {Partial<{
         *  password: string,
         *  security_credential: string
         * }>}
         */
        b2c: Partial<{
            password: string,
            security_credential: string
        }>
    }>) {
        this._env = props.env || 'sandbox' 
        this._consumer_key = props.consumer_key || '' 
        this._consumer_secret = props.consumer_secret || '' 
        this._pass_key = props.pass_key || ''
        this._business_short_code = props.business_short_code || 0
        this._callback_url = props.callback_url || ''
        this._password = props.b2c?.password || ''
        this._security_credential = props.b2c?.security_credential || ''
        this._base_url = props.env === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke'

    }


    /**
     * @name generate_access_token 
     * @description Generates an access token for the mpesa api 
     * @returns 
     */
    private async _generate_access_token() {
        const username = this._consumer_key 
        const password = this._consumer_secret
        
        const basic_auth = Buffer.from(username + ':' + password).toString('base64') 
    
        const url = `${this._base_url}/oauth/v1/generate`

        try {
            const res = (await fetch(`${url}?grant_type=client_credentials`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + basic_auth,
                    'Content-Type': 'application/json'
                }
            }))

            let access_token = '' 

            if(res.status === 200) {
                const data = (await res.json()) as AccessTokenResponse
                access_token = data.access_token
            }else{
                return Promise.reject({
                    message: 'Error generating access token',
                    error: await res.json()
                })
            }
            return access_token
        } catch (e) 
        {   
            return Promise.reject({
                message: 'Error generating access token',
                error: (e as AxiosError)?.response?.data
            })
        }
    }


    private async _generate_password() {
        const timestamp = format_mpesa_date(new Date());
        const pre = `${this._business_short_code}${this._pass_key}${timestamp}`
        const password = Buffer.from(pre).toString("base64");

        return {
            password,
            timestamp
        }
    }


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
    async send_payment_request(props: Partial<{
        /**
         * @name transaction_type
         * @description The type of transaction to be performed
         * @type {'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline'}
         */
        transaction_type: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline',
        /**
         * @name amount
         * @description The amount to be sent
         * @type {number}
         */
        amount: number,
        /**
         * @name phone_number
         * @description The phone number to send the money to
         * @type {number}
         */
        phone_number: number,
        /**
         * @name transaction_desc
         * @description The description of the transaction
         * @type {string}
         */
        transaction_desc: string
    }>){
        const { transaction_desc, phone_number, transaction_type, amount } = props
        const base_url = this._base_url
        
        const url = `${base_url}/mpesa/stkpush/v1/processrequest`
        
        try {
            const access_token = await this._generate_access_token()

            const {
                password,
                timestamp
            } = await this._generate_password()
    
            const response = await axios.post<SendPaymentResponse>(url, {
                BusinessShortCode: this._business_short_code,
                Password: password,
                AccountReference: 'account',
                Amount: amount,
                CallBackURL: this._callback_url,
                PartyA: phone_number,
                PartyB: this._business_short_code,
                PhoneNumber: phone_number,
                Timestamp: timestamp,
                TransactionDesc: transaction_desc,
                TransactionType: transaction_type 
            } as SendPaymentRequestBody, {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })  
            return response.data
        } 
        catch (e)
        {
            return Promise.reject({
                message: 'Error generating sending payment request',
                error: (e as AxiosError)?.response?.data
            })
        }
    
    }


    async send_payout_request(props: Partial<{
        /**
         * @name amount
         * @description The amount to be sent
         * @type {number}
         */
        amount: number,
        /**
         * @name transaction_type
         * @description The type of transaction to be performed
         * @type {'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment'}
         */
        transaction_type: 'BusinessPayment' | 'SalaryPayment' | 'PromotionPayment',
        /**
         * @name phone_number
         * @description The phone number to send the money to
         * @type {number}
         */
        phone_number: number,
        /**
         * @name description
         * @description The description of the transaction
         * @type {string}
         */
        description: string
    }>){
        const { amount, transaction_type, phone_number, description } = props
        const base_url = this._base_url
        const url = `${base_url}/mpesa/b2c/v1/paymentrequest`
        try {
            const access_token = await this._generate_access_token()

            const response = await axios.post<SendPayoutResponse>(url, {
                InitiatorName: this._password,
                SecurityCredential: this._security_credential,
                CommandID: transaction_type,
                Amount: amount,
                Occassion: 'occassion',
                PartyA: this._business_short_code,
                PartyB: phone_number,
                QueueTimeOutURL: this._callback_url,
                ResultURL: this._callback_url,
                Remarks: description
            } as SendPayoutRequest, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            return response.data
        }
        catch (e)
        {
            return Promise.reject({
                message: 'Error initiating payout',
                error: (e as AxiosError)?.response?.data
            })
        }
    }
}


export default MpesaClient
