import z from 'zod'


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


export {
    payment_request_callback_body_schema,
    type tPaymentRequestCallbackBody
}