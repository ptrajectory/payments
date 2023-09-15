import axios, { AxiosError } from "axios"
import { AccessTokenResponse, B2BSetupCredentials, C2BSetupCredentials, SendPaymentRequestBody, SendPaymentResponse, SendPayoutRequest, SendPayoutResponse } from "./lib/types.ts"
import { format_mpesa_date } from "./lib/utils.ts"
import fetch from 'node-fetch'
import { payment_request_callback_body_schema, tPaymentRequestCallbackBody } from "./lib/schemas.ts";



class MpesaEvent {
    // private _event_type: 'express' | 'payout';
    constructor(props?: Partial<{
        /**
         * @name event_type
         * @description The type of mpesa event
         * @type {'express' | 'payout'}
         */
        event_type: 'express' | 'payout' 

    }>){
        // this._event_type = props.event_type || 'express'
    }

    /**
     * @name handle_payout_request_callback
     * @description Handles the payout request callback
     * @param body 
     * @returns 
     */
    async handle_payment_request_callback(body: Partial<tPaymentRequestCallbackBody>){
        const parsed = payment_request_callback_body_schema.safeParse(body) 

        if(!parsed.success) {
            return Promise.reject(parsed.error.formErrors)
            // TODO: handle error locally
        }

        const data = parsed.data

        return data
    }


    /**
     * @name handle_payout_request_callback
     * @description Handles the payout request callback
     * @param body 
     * @returns 
     */
    async handle_payout_request_callback(body: Partial<tPaymentRequestCallbackBody>){
        const parsed = payment_request_callback_body_schema.safeParse(body)

        if(!parsed.success) {
            return Promise.reject(parsed.error.formErrors)
        }

        const data = parsed.data

        return data
    }
}



class MpesaClient {
    private _env = 'sandbox'
    private _callback_url = ''
    private _base_url = 'https://sandbox.safaricom.co.ke'
    private _b2c: B2BSetupCredentials = {}
    private _c2b: C2BSetupCredentials = {}

    constructor(props: Partial<{
        /**
         * @name env
         * @description The environment to use
         * @type {'sandbox' | 'production'}
         */
        env: 'sandbox' | 'production',
        /**
         * @name b2c
         * @description The b2c credentials, if you plan to use the b2c api
         * @type {B2BSetupCredentials}
         */
        b2c: B2BSetupCredentials,
        /**
         * @name c2b
         * @description The c2b credentials, if you plan to use the c2b api
         * @type {C2BSetupCredentials}
         */
        c2b: C2BSetupCredentials,
        /**
         * @name callback_url
         * @description The callback url to use for the api, 
         * **Note** do not postfix the url with a `/` also, the url needs to be https
         * @example https://example.com and not https://example.com/ or http://example.com 
         */
        callback_url: string
    }>) {
        this._env = props.env || 'sandbox' 
        this._base_url = (props.env === 'sandbox' || props.env === undefined) ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke'
        this._b2c = props.b2c || {}
        this._c2b = props.c2b || {}
        this._callback_url = props.callback_url || ''
    }


    /**
     * @name generate_access_token 
     * @description Generates an access token for the mpesa api 
     * @returns 
     */
    private async _generate_access_token(type: 'b2c' | 'c2b' = 'c2b') {
        const username = type === 'b2c' ? this._b2c.consumer_key : this._c2b.consumer_key
        const password = type === 'b2c' ? this._b2c.consumer_secret : this._c2b.consumer_secret
        
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
                    error: res.statusText
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


    private async _generate_password(type: 'b2c' | 'c2b' = 'c2b') {
        const timestamp = format_mpesa_date(new Date());
        const short_code = type === 'b2c' ? this._b2c.short_code : this._c2b.short_code
        const pass_key = type === 'b2c' ? this._b2c.pass_key : this._c2b.pass_key
        const pre = `${short_code}${pass_key}${timestamp}`
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
            const access_token = await this._generate_access_token('c2b')

            const {
                password,
                timestamp
            } = await this._generate_password('c2b')
    
            const response = await axios.post<SendPaymentResponse>(url, {
                BusinessShortCode: this._c2b.short_code,
                Password: password,
                AccountReference: this._c2b.business_name,
                Amount: amount,
                CallBackURL: `${this._callback_url}/c2b/callback`,
                PartyA: phone_number,
                PartyB: this._c2b.short_code,
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
            if (e instanceof AxiosError) {
                return Promise.reject({
                    message: 'Error sending payment request',
                    error: e.response?.data
                })
            }
            return Promise.reject({
                message: 'Error sending payment request',
                error: e
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
         * @name transaction_desc
         * @description The description of the transaction
         * @type {string}
         */
        transaction_desc: string
    }>){
        const { amount, transaction_type, phone_number, transaction_desc } = props
        const base_url = this._base_url
        const url = `${base_url}/mpesa/b2c/v1/paymentrequest`
        try {
            const access_token = await this._generate_access_token('b2c')

            const response = await axios.post<SendPayoutResponse>(url, {
                InitiatorPassword: this._b2c.security_credential,
                InitiatorName: this._b2c.business_name,
                SecurityCredential: this._b2c.security_credential,
                CommandID: transaction_type,
                Amount: amount,
                Occassion: 'occassion',
                PartyA: this._b2c.short_code,
                PartyB: phone_number,
                QueueTimeOutURL: `${this._callback_url}/b2c/timeout`,
                ResultURL: `${this._callback_url}/b2c/result`,
                Remarks: transaction_desc,
            } as SendPayoutRequest, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

            return response.data
        }
        catch (e)
        {
            if(e instanceof AxiosError) {
                return Promise.reject({
                    message: 'Error initiating payout',
                    error: e.response?.data
                })
            }
            return Promise.reject({
                message: 'Error initiating payout',
                error: e
            })
        }
    }


    /**
     * @name set_callback_url
     * @description for testing purposes, i.e when you need to dynamically change the callback url
     * @param url 
     */
    public set_callback_url(url: string){
        this._callback_url = url
    }

    /**
     * @name set_client 
     * !!! INTERNAL USE ONLY !!!
     * @description this is for any clients e.g the express client, that rely on this client to set the env
     * @param props 
     */
    public set_client(props: Partial<{
        env: 'sandbox' | 'production',
        b2c_business_name: string,
        c2b_business_name: string,
        callback_url: string,
    }>){
        this._env = props.env || 'sandbox'
        this._b2c.business_name = props.b2c_business_name || ''
        this._c2b.business_name = props.c2b_business_name || ''
        this._callback_url = props.callback_url || ''
    }
}


export default MpesaClient
