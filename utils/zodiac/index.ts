import z from "zod"

const customer = z.object({
    id: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    meta: z.any().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})


const payment_method = z.object({
    id: z.string().optional(),
    customer_id: z.string().optional(),
    type: z.string().optional(),
    phone_number: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

const checkout = z.object({
    id: z.string().optional(),
    customer_id: z.string().optional(),
    status: z.string().optional(),
    currency: z.string().optional(),
    payment_method_id: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
})


export {
    checkout,
    customer,
    payment_method
}