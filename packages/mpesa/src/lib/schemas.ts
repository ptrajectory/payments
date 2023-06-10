import z from 'zod'

/**
 * @name payout_request_callback_body_schema
 * @description Schema for the body of the payout request callback
 * @type {zod.Schema}
 */
const payout_request_callback_body_schema = z.object({
    Result: z.object({
        ResultType: z.number().optional(),
        ResultCode: z.number().optional(),
        ResultDesc: z.string().optional(),
        OriginatorConversationID: z.string().optional(),
        ConversationID: z.string().optional(),
        TransactionID: z.string().optional(),
        ReferenceData: z.object({
            ReferenceItem: z.object({
                Key: z.string().optional(),
                Value: z.string().optional()
            }).optional()
        }).optional()
    }).optional()
})

type tPayoutRequestCallbackBody = z.infer<typeof payout_request_callback_body_schema>


/**
 * @name payment_request_callback_body_schema
 * @description Schema for the body of the payment request callback 
 * @type {zod.Schema}
 */
const payment_request_callback_body_schema = z.object({
    Body: z.object({
        stkCallback: z.object({
            MerchantRequestID: z.string(),
            CheckoutRequestID: z.string(),
            ResultCode: z.number().optional(),
            ResultDesc: z.string().optional(),
            CallbackMetadata: z.object({
                Item: z.array(z.object({
                    Name: z.string(),
                    Value: z.string()
                })).optional()
            }).array().optional()
        })
    })
})

type tPaymentRequestCallbackBody = z.infer<typeof payment_request_callback_body_schema> 


/**
 * @name payment_request_body 
 * @description Schema for the body of the payment request body 
 * @type {zod.Schema}
 */
const payment_request_body = z.object({
    amount: z.number().min(0, {
        message: "Amount cann't be 0 or less"
    }),
    phone_number: z.number(),
    transaction_desc: z.string().optional(),
    transaction_type: z.enum(['CustomerPayBillOnline', 'CustomerBuyGoodsOnline'])
})
/**
 * @name tPaymentRequestBody 
 * @description the payment request body type
 */
type tPaymentRequestBody = z.infer<typeof payment_request_body>

/**
 * @name payout_request_body
 * @description Schema for the body of a payout request
 * @type {zod.Schema}
 */
const payout_request_body = z.object({
    amount: z.number().min(0, {
        message: "Amount cann't be 0 or less"
    }),
    phone_number: z.number(),
    transaction_desc: z.string().optional(),
    transaction_type: z.enum(["BusinessPayment","SalaryPayment","PromotionPayment"])
})

/**
 * @name tPayoutRequestBody 
 * @description the payout request body 
 */
type tPayoutRequestBody = z.infer<typeof payout_request_body>


export {
    payment_request_callback_body_schema,
    type tPaymentRequestCallbackBody,
    payout_request_callback_body_schema,
    type tPayoutRequestCallbackBody,
    payment_request_body,
    type tPaymentRequestBody,
    payout_request_body,
    type tPayoutRequestBody
}