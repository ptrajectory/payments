import EventEmitter from 'events';
import z from 'zod';
import { Request, Response } from 'express';
import { M as MpesaClient, S as SendPaymentResponse, a as SendPayoutResponse, b as SendPayoutRequest } from '../client-141af4eb.js';

/**
 * @name payout_request_callback_body_schema
 * @description Schema for the body of the payout request callback
 * @type {zod.Schema}
 */
declare const payout_request_callback_body_schema: z.ZodObject<{
    Result: z.ZodOptional<z.ZodObject<{
        ResultType: z.ZodOptional<z.ZodNumber>;
        ResultCode: z.ZodOptional<z.ZodNumber>;
        ResultDesc: z.ZodOptional<z.ZodString>;
        OriginatorConversationID: z.ZodOptional<z.ZodString>;
        ConversationID: z.ZodOptional<z.ZodString>;
        TransactionID: z.ZodOptional<z.ZodString>;
        ReferenceData: z.ZodOptional<z.ZodObject<{
            ReferenceItem: z.ZodOptional<z.ZodObject<{
                Key: z.ZodOptional<z.ZodString>;
                Value: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                Key?: string | undefined;
                Value?: string | undefined;
            }, {
                Key?: string | undefined;
                Value?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            ReferenceItem?: {
                Key?: string | undefined;
                Value?: string | undefined;
            } | undefined;
        }, {
            ReferenceItem?: {
                Key?: string | undefined;
                Value?: string | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        ResultType?: number | undefined;
        ResultCode?: number | undefined;
        ResultDesc?: string | undefined;
        OriginatorConversationID?: string | undefined;
        ConversationID?: string | undefined;
        TransactionID?: string | undefined;
        ReferenceData?: {
            ReferenceItem?: {
                Key?: string | undefined;
                Value?: string | undefined;
            } | undefined;
        } | undefined;
    }, {
        ResultType?: number | undefined;
        ResultCode?: number | undefined;
        ResultDesc?: string | undefined;
        OriginatorConversationID?: string | undefined;
        ConversationID?: string | undefined;
        TransactionID?: string | undefined;
        ReferenceData?: {
            ReferenceItem?: {
                Key?: string | undefined;
                Value?: string | undefined;
            } | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    Result?: {
        ResultType?: number | undefined;
        ResultCode?: number | undefined;
        ResultDesc?: string | undefined;
        OriginatorConversationID?: string | undefined;
        ConversationID?: string | undefined;
        TransactionID?: string | undefined;
        ReferenceData?: {
            ReferenceItem?: {
                Key?: string | undefined;
                Value?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
}, {
    Result?: {
        ResultType?: number | undefined;
        ResultCode?: number | undefined;
        ResultDesc?: string | undefined;
        OriginatorConversationID?: string | undefined;
        ConversationID?: string | undefined;
        TransactionID?: string | undefined;
        ReferenceData?: {
            ReferenceItem?: {
                Key?: string | undefined;
                Value?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
}>;
type tPayoutRequestCallbackBody = z.infer<typeof payout_request_callback_body_schema>;
/**
 * @name payment_request_callback_body_schema
 * @description Schema for the body of the payment request callback
 * @type {zod.Schema}
 */
declare const payment_request_callback_body_schema: z.ZodObject<{
    Body: z.ZodObject<{
        stkCallback: z.ZodObject<{
            MerchantRequestID: z.ZodString;
            CheckoutRequestID: z.ZodString;
            ResultCode: z.ZodOptional<z.ZodNumber>;
            ResultDesc: z.ZodOptional<z.ZodString>;
            CallbackMetadata: z.ZodOptional<z.ZodObject<{
                Item: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    Name: z.ZodOptional<z.ZodString>;
                    Value: z.ZodOptional<z.ZodEffects<z.ZodType<string, z.ZodTypeDef, string>, string, string>>;
                }, "strip", z.ZodTypeAny, {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }, {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }>, "many">>;
            }, "strip", z.ZodTypeAny, {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            }, {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode?: number | undefined;
            ResultDesc?: string | undefined;
            CallbackMetadata?: {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            } | undefined;
        }, {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode?: number | undefined;
            ResultDesc?: string | undefined;
            CallbackMetadata?: {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode?: number | undefined;
            ResultDesc?: string | undefined;
            CallbackMetadata?: {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            } | undefined;
        };
    }, {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode?: number | undefined;
            ResultDesc?: string | undefined;
            CallbackMetadata?: {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            } | undefined;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode?: number | undefined;
            ResultDesc?: string | undefined;
            CallbackMetadata?: {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            } | undefined;
        };
    };
}, {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode?: number | undefined;
            ResultDesc?: string | undefined;
            CallbackMetadata?: {
                Item?: {
                    Name?: string | undefined;
                    Value?: string | undefined;
                }[] | undefined;
            } | undefined;
        };
    };
}>;
type tPaymentRequestCallbackBody = z.infer<typeof payment_request_callback_body_schema>;
/**
 * @name payment_request_body
 * @description Schema for the body of the payment request body
 * @type {zod.Schema}
 */
declare const payment_request_body: z.ZodObject<{
    amount: z.ZodNumber;
    phone_number: z.ZodNumber;
    transaction_desc: z.ZodOptional<z.ZodString>;
    transaction_type: z.ZodEnum<["CustomerPayBillOnline", "CustomerBuyGoodsOnline"]>;
}, "strip", z.ZodTypeAny, {
    transaction_type: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
    amount: number;
    phone_number: number;
    transaction_desc?: string | undefined;
}, {
    transaction_type: "CustomerPayBillOnline" | "CustomerBuyGoodsOnline";
    amount: number;
    phone_number: number;
    transaction_desc?: string | undefined;
}>;
/**
 * @name tPaymentRequestBody
 * @description the payment request body type
 */
type tPaymentRequestBody = z.infer<typeof payment_request_body>;
/**
 * @name payout_request_body
 * @description Schema for the body of a payout request
 * @type {zod.Schema}
 */
declare const payout_request_body: z.ZodObject<{
    amount: z.ZodNumber;
    phone_number: z.ZodNumber;
    transaction_desc: z.ZodOptional<z.ZodString>;
    transaction_type: z.ZodEnum<["BusinessPayment", "SalaryPayment", "PromotionPayment"]>;
}, "strip", z.ZodTypeAny, {
    transaction_type: "BusinessPayment" | "SalaryPayment" | "PromotionPayment";
    amount: number;
    phone_number: number;
    transaction_desc?: string | undefined;
}, {
    transaction_type: "BusinessPayment" | "SalaryPayment" | "PromotionPayment";
    amount: number;
    phone_number: number;
    transaction_desc?: string | undefined;
}>;
/**
 * @name tPayoutRequestBody
 * @description the payout request body
 */
type tPayoutRequestBody = z.infer<typeof payout_request_body>;

type CallBackEvents = {
    /**
     * Emitted when a payout request is successful
     * this is where you can include logic for updating your database
     */
    'payout:success': tPayoutRequestCallbackBody;
    /**
     * Emitted when a payout request has a response code other than 0
     * this is where you can include logic for updating your database
     */
    'payout:error': tPayoutRequestCallbackBody;
    /**
     * Emitted when a payout request has an invalid body
     * this is where you can include logic for updating your database
     */
    'payout:invalid': {
        received: unknown;
        error: z.typeToFlattenedError<tPayoutRequestCallbackBody>;
    };
    /**
     * Emitted when a payment request is successful
     * this is where you can include logic for updating your database
     */
    'payment:success': tPaymentRequestCallbackBody;
    /**
     * Emitted when a payment request has a response code other than 0
     * this is where you can include logic for updating your database
     */
    'payment:error': tPaymentRequestCallbackBody;
    /**
     * Emitted when a payment request has an invalid body
     * this is where you can include logic for updating your database
     */
    'payment:invalid': {
        received: unknown;
        error: z.typeToFlattenedError<tPaymentRequestCallbackBody>;
    };
    /**
     * Emitted when an uncaught exception occurs
     * This is where tou can add your logging solution, e.g sentry
     */
    'uncaughtException': unknown;
    /**
     * Emmited when a payment request has successfully been sent to the mpesa api
     * This is where to include logic for updating your database
     */
    'payment-request:success': SendPaymentResponse;
    /**
     * Emmited when a payment request has failed to be sent to the mpesa api
     * This can be either due to an error in the request body or an error from the mpesa api, **Note** you need to include validation logic to know which error occured
     */
    'payment-request:error': {
        type: 'code' | 'unknown' | 'body-error';
        error: SendPaymentResponse | unknown | z.typeToFlattenedError<tPaymentRequestBody>;
    };
    /**
     * Emmited when a payout request has successfully been sent to the mpesa api
     * This is where to include logic for updating your database
     */
    'payout-request:success': SendPayoutResponse;
    /**
     * Emmited when a payout request has failed to be sent to the mpesa api
     * This can be either due to an error in the request body or an error from the mpesa api, **Note** you need to include validation logic to know which error occured
     */
    'payout-request:error': {
        type: 'code' | 'unknown' | 'body-error';
        error: SendPayoutRequest | unknown | z.typeToFlattenedError<tPayoutRequestBody>;
    };
};
/**
 * `ExpressMpesaEvents` class provides events and methods for handling MPesa events.
 *
 * @example
 * ```
 * const mpesaEvents = new ExpressMpesaEvents();
 * mpesaEvents.on('payout:success', data => { ... });
 * ```
 */
declare class ExpressMpesaEvents extends EventEmitter {
    client: MpesaClient;
    constructor();
    /**
     * Emits an event.
     *
     * @param event The event to emit.
     * @param data The data to pass to the event listeners.
     */
    emit: <K extends keyof CallBackEvents>(event: K, data: CallBackEvents[K]) => boolean;
    /**
     * Registers an event listener.
     *
     * @param event The event to listen for.
     * @param listener The callback function to run when the event is emitted.
     */
    on: <K extends keyof CallBackEvents>(event: K, listener: (data: CallBackEvents[K]) => void) => this;
    /**
     * @description Handles the callback from the mpesa api for payouts
     * @param req
     * @param res
     */
    payoutsCallbackHandler(req: Request, res: Response): Promise<void>;
    /**
     * @description Handles the callback from the mpesa api for payments
     * @param req
     * @param res
     */
    paymentsCallbackHandler(req: Request, res: Response): Promise<void>;
    /**
     * @name payoutRequestHandler
     * @description Handles the payment request from the client
     * @param req
     * @param res
     */
    paymentRequestHandler(req: Request, res: Response): Promise<void>;
    payoutRequestHandler(req: Request, res: Response): Promise<void>;
    /**
     * @name setTestUrl
     * @description Sets the test url for the client, this is for when your callback url will probably change dynamically e.g when testing with ngrok
     * @param url
     */
    setTestUrl(url: string): void;
    /**
     * @name init
     * @description Initializes the client with details, that cannot be automatically set using environment variables
     *              - **Note** be sure to call this at the start of your application or before you start using the client
     *
     * @param props
     */
    init(props: Partial<{
        env: 'production' | 'sandbox';
        c2b_business_name: string;
        b2c_business_name: string;
    }>): void;
}
declare const _default: ExpressMpesaEvents;

export { ExpressMpesaEvents, _default as default };
