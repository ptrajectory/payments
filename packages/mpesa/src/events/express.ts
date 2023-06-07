import EventEmitter from 'events'
import { type tPayoutRequestCallbackBody, type tPaymentRequestCallbackBody, payment_request_callback_body_schema, payout_request_callback_body_schema } from '../lib/schemas'
import { Request, Response } from 'express'
import z from 'zod'

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

    constructor(){
        super()
        this.paymentsCallbackHandler = this.paymentsCallbackHandler.bind(this)
        this.payoutsCallbackHandler = this.payoutsCallbackHandler.bind(this)
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
        const parsed = payment_request_callback_body_schema.safeParse(req.body)
        if (!parsed.success){
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
}

export default new ExpressMpesaEvents()

export {
    ExpressMpesaEvents
}