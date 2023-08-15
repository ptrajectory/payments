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

type CUSTOMER = z.infer<typeof customer>;


const payment_method = z.object({
    id: z.string().optional(),
    customer_id: z.string().optional(),
    type: z.string().optional(),
    phone_number: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

type PAYMENT_METHOD = z.infer<typeof payment_method>; 

const checkout = z.object({
    id: z.string().optional(),
    customer_id: z.string().optional(),
    status: z.string().optional(),
    currency: z.string().optional(),
    payment_method_id: z.string().optional(),
    cart_id: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional()
})

type CHECKOUT = z.infer<typeof checkout>;

const product = z.object({
    id: z.string().optional(),
    name: z.string().optional(), 
    description: z.string().optional(),
    price: z.number().optional(), 
    image: z.string().optional()
})

type PRODUCT = z.infer<typeof product>;

const cart = z.object({
    id: z.string().optional(),
    customer_id: z.string().optional(), 
})

type CART = z.infer<typeof cart>; 

const cart_item = z.object({
    id: z.string().optional(),
    cart_id: z.string().optional(),
    product_id: z.string().optional(),
    quantity: z.number().optional(),
})

type CART_ITEM = z.infer<typeof cart_item>;


export {
  checkout,
  customer,
  payment_method,
  product,
  cart,
  cart_item,
  PAYMENT_METHOD,
  CUSTOMER,
  CHECKOUT,
  PRODUCT,
  CART,
  CART_ITEM
};