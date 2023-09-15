import EventEmitter from 'events'
import { type tPayoutRequestCallbackBody, type tPaymentRequestCallbackBody, payment_request_callback_body_schema, payout_request_callback_body_schema, payment_request_body, tPaymentRequestBody } from '../lib/schemas'
import { Request, Response } from 'express'
import z from 'zod'
import 'dotenv/config'
import MpesaClient from '../client'
import { SendPaymentResponse, SendPayoutRequest, SendPayoutResponse } from '../lib/types'
import { tPayoutRequestBody } from '../lib/schemas'
import { payout_request_body } from '../lib/schemas'

type CallBackEvents = {
    /**
     * Emitted when a payout request is successful
     * this is where you can include logic for updating your database
     */
    'payout:success': tPayoutRequestCallbackBody,
    /**
     * Emitted when a payout request has a response code other than 0
     * this is where you can include logic for updating your database
     */
    'payout:error': tPayoutRequestCallbackBody,
    /**
     * Emitted when a payout request has an invalid body
     * this is where you can include logic for updating your database
     */
    'payout:invalid': {
        received: unknown,
        error: z.typeToFlattenedError<tPayoutRequestCallbackBody>
    },
    /**
     * Emitted when a payment request is successful
     * this is where you can include logic for updating your database
     */
    'payment:success': tPaymentRequestCallbackBody,
    /**
     * Emitted when a payment request has a response code other than 0
     * this is where you can include logic for updating your database
     */
    'payment:error': tPaymentRequestCallbackBody,
    /**
     * Emitted when a payment request has an invalid body
     * this is where you can include logic for updating your database
     */
    'payment:invalid': {
        received: unknown,
        error: z.typeToFlattenedError<tPaymentRequestCallbackBody>
    },
    /**
     * Emitted when an uncaught exception occurs
     * This is where tou can add your logging solution, e.g sentry
     */
    'uncaughtException': unknown
    /**
     * Emmited when a payment request has successfully been sent to the mpesa api
     * This is where to include logic for updating your database
     */
    'payment-request:success': SendPaymentResponse
    /**
     * Emmited when a payment request has failed to be sent to the mpesa api 
     * This can be either due to an error in the request body or an error from the mpesa api, **Note** you need to include validation logic to know which error occured
     */
    'payment-request:error': {
        type: 'code' | 'unknown' | 'body-error'
        error: SendPaymentResponse | unknown | z.typeToFlattenedError<tPaymentRequestBody>
    }
    /**
     * Emmited when a payout request has successfully been sent to the mpesa api 
     * This is where to include logic for updating your database
     */
    'payout-request:success': SendPayoutResponse
    /**
     * Emmited when a payout request has failed to be sent to the mpesa api
     * This can be either due to an error in the request body or an error from the mpesa api, **Note** you need to include validation logic to know which error occured
     */
    'payout-request:error': {
        type: 'code' | 'unknown' | 'body-error'
        error: SendPayoutRequest | unknown | z.typeToFlattenedError<tPayoutRequestBody>
    }
}

/**
 * `ExpressMpesaEvents` class provides events and methods for handling MPesa events.
 * 
 * @example
 * ```
 * const mpesaEvents = new ExpressMpesaEvents();
 * mpesaEvents.on('payout:success', data => { ... });
 * ```
 */
class ExpressMpesaEvents extends EventEmitter {

    client: MpesaClient 
    
    constructor(){
        super()
        this.paymentsCallbackHandler = this.paymentsCallbackHandler.bind(this)
        this.payoutsCallbackHandler = this.payoutsCallbackHandler.bind(this)
        this.paymentRequestHandler = this.paymentRequestHandler.bind(this)
        this.payoutRequestHandler = this.payoutRequestHandler.bind(this)
        this.client = new MpesaClient({
            b2c: {
                consumer_key: process.env.B2C_MPESA_CONSUMER_KEY,
                consumer_secret: process.env.B2C_MPESA_CONSUMER_SECRET,
                pass_key: process.env.B2C_MPESA_PASSKEY,
                password: process.env.B2C_PASSWORD,
                security_credential: process.env.B2C_SECURITY_CREDENTIAL,
                short_code: Number(process.env.B2C_MPESA_SHORTCODE),
            },
            c2b: {
                consumer_key: process.env.C2B_MPESA_CONSUMER_KEY,
                consumer_secret: process.env.C2B_MPESA_CONSUMER_SECRET,
                pass_key: process.env.C2B_MPESA_PASSKEY,
                short_code: Number(process.env.C2B_MPESA_SHORTCODE)
            }
        })
    }

    /**
     * Emits an event.
     * 
     * @param event The event to emit.
     * @param data The data to pass to the event listeners.
     */
    public emit = <K extends keyof CallBackEvents>(event: K, data: CallBackEvents[K]) => super.emit(event, data)
    /**
     * Registers an event listener.
     * 
     * @param event The event to listen for.
     * @param listener The callback function to run when the event is emitted.
     */
    public on = <K extends keyof CallBackEvents>(event: K, listener: (data: CallBackEvents[K]) => void) => super.on(event, listener)

    /**
     * @description Handles the callback from the mpesa api for payouts
     * @param req 
     * @param res 
     */
    public async payoutsCallbackHandler(req: Request, res: Response) {
        res.status(200).send('OK')
        const parsed = payout_request_callback_body_schema.safeParse(req.body)
        if (!parsed.success){
            this.emit('payout:invalid', {
                received: req.body,
                error: parsed.error.formErrors
            })
        }
        else 
        {
            const data = parsed.data 
            try {
                switch (data.Result?.ResultCode?.toString()){
                    case '0':{
                        this.emit('payout:success', data)
                        break;
                    }
                    default: {
                        this.emit('payout:error', data)
                    }
                }
            }
            catch (e)
            {
                this.emit('uncaughtException', e)
            }
        }
    }

    /**
     * @description Handles the callback from the mpesa api for payments
     * @param req 
     * @param res 
     */
    public async paymentsCallbackHandler(req: Request, res: Response) {
        res.status(200).send('OK')
        console.log("Incoming body::", req.body)
        const parsed = payment_request_callback_body_schema.safeParse(req.body)
        if (!parsed.success){

            console.log("The ERROR", JSON.stringify(parsed.error))

            this.emit('payment:invalid', {
                received: req.body,
                error: parsed.error.formErrors
            })
        }
        else 
        {
            const data = parsed.data
            try {
                switch (data.Body?.stkCallback?.ResultCode?.toString()){
                    case '0':{
                        this.emit('payment:success', data)
                        break;
                    }
                    default: {
                        this.emit('payment:error', data)
                    }
                }

            } catch(e)
            {
                this.emit('uncaughtException', e)
            }
        }
    }


    /**
     * @name payoutRequestHandler
     * @description Handles the payment request from the client
     * @param req 
     * @param res 
     */
    public async paymentRequestHandler(req: Request, res: Response){

        const body = req.body

        const parsed = payment_request_body.safeParse(body)

        if(!parsed.success){
            this.emit('payment-request:error', {
                type: 'body-error',
                error: parsed.error.formErrors
            })
            res.status(400).send(parsed.error.formErrors)
            return
        }

        const data = parsed.data

        try {
            const daraja_response = await this.client.send_payment_request(data)


            const code = daraja_response?.ResponseCode 

            switch(code){
                case "0":{
                    res.status(200).send(daraja_response)
                    this.emit('payment-request:success', daraja_response)
                    break;
                };
                default:{
                    res.status(500).send({
                        message: "Wrong result code returned",
                        error: daraja_response
                    })
                    this.emit('payment-request:error', {
                        type: 'code',
                        error: daraja_response
                    })
                    return
                }
            }
        } 
        catch (e)
        {
            res.status(500).send({
                message: "Something went wrong",
                error: e
            })
            this.emit('payment-request:error', {
                type: 'unknown',
                error: e
            })
            return
        }
    }


    public async payoutRequestHandler(req: Request, res: Response){
        const body = req.body 

        const parsed = payout_request_body.safeParse(body)


        if(!parsed.success){
            this.emit('payout-request:error', {
                type: 'body-error',
                error: parsed.error.formErrors
            })
            res.status(400).send(parsed.error.formErrors)
            return
        }

        const data = parsed.data

        try {

            const daraja_response = await this.client.send_payout_request(data)

            const code = daraja_response?.ResponseCode 

            switch(code){
                case "0":{
                    res.status(200).send(daraja_response)
                    this.emit('payout-request:success', daraja_response)
                    break;
                };
                default:{
                    res.status(500).send({
                        message: "Wrong result code returned",
                        error: daraja_response
                    })
                    this.emit('payout-request:error', {
                        type: 'code',
                        error: daraja_response
                    })
                    return
                }
            }

        }
        catch (e)
        {
            res.status(500).send({
                message: "Something went wrong",
                error: e
            })
            this.emit('payout-request:error', {
                type: 'unknown',
                error: e
            })
            return
        }
    }

    /**
     * @name setTestUrl
     * @description Sets the test url for the client, this is for when your callback url will probably change dynamically e.g when testing with ngrok
     * @param url 
     */
    public setTestUrl(url: string){
        this.client.set_callback_url(url)
    }

    /**
     * @name init
     * @description Initializes the client with details, that cannot be automatically set using environment variables 
     *              - **Note** be sure to call this at the start of your application or before you start using the client
     * 
     * @param props 
     */
    public init(props: Partial<{
        env: 'production' | 'sandbox',
        c2b_business_name: string,
        b2c_business_name: string,
        callback_url: string
    }>){
        this.client.set_client({
            env: props.env,
            b2c_business_name: props.b2c_business_name,
            c2b_business_name: props.c2b_business_name,
            callback_url: props.callback_url
        })
    }
}

export default new ExpressMpesaEvents()

export {
    ExpressMpesaEvents
}