import z from "zod"

const customer = z.object({
    id: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    meta: z.any().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    store_id: z.string().optional(),
    status: z.string().optional()
})

type CUSTOMER = z.infer<typeof customer>;


const payment_method = z.object({
    id: z.string().optional(),
    customer_id: z.string().optional(),
    type: z.string().optional(),
    phone_number: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    store_id: z.string().optional(),
    is_default: z.boolean().optional(),
    status: z.string().optional()
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
    updated_at: z.string().optional(),
    store_id: z.string().optional(),
    purchase_type: z.enum(['one_time', 'monthly_subscription']).optional()
})

type CHECKOUT = z.infer<typeof checkout>;

const product = z.object({
    id: z.string().optional(),
    name: z.string().optional(), 
    description: z.string().optional(),
    price: z.number().optional(), 
    image: z.string().optional(),
    store_id: z.string().optional(),
    status: z.string().optional()
})

type PRODUCT = z.infer<typeof product>;

const cart = z.object({
    id: z.string().optional(),
    customer_id: z.string().optional(),
    status: z.string().optional(),
    store_id: z.string().optional()
})

type CART = z.infer<typeof cart>; 

const cart_item = z.object({
    id: z.string().optional(),
    cart_id: z.string().optional(),
    product_id: z.string().optional(),
    quantity: z.number().optional(),
    store_id: z.string().optional(),
    status: z.string().optional(),
    customer_id: z.string().optional()
})

type CART_ITEM = z.infer<typeof cart_item>;


const payment = z.object({
    id: z.string().optional(),
    amount: z.number().optional(),
    token: z.string().optional(),
    status: z.string().optional(),
    payment_method_id: z.string().optional(),
    checkout_id: z.string().optional(),
    customer_id: z.string().optional(),
    store_id: z.string().optional()
})

type PAYMENT = z.infer<typeof payment>

const seller = z.object({
    id: z.string().optional(),
    uid: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    avatar: z.string().optional(),
    email: z.string().email().optional(),
    seller_name: z.string().optional()
})

type SELLER = z.infer<typeof seller>

const store = z.object({
    id: z.string().optional(),
    seller_id: z.string().optional(),
    name: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    environment: z.enum(['production', 'testing']).optional()
})

type STORE = z.infer<typeof store>

const payment_input = z.object({
    checkout_id: z.string().optional(),
    payment_method_id: z.string().optional(),
    amount: z.number().optional(),
    phone_number: z.string().optional(),
    payment_option: z.enum(['MPESA']).optional().default("MPESA"),
    customer_id: z.string().optional()
})

type PAYMEN_INPUT = Partial<z.infer<typeof payment_input>>


const purchase_link = z.object({
    product_id: z.string(), 
    store_id: z.string(),
    quantity: z.number().positive().default(1),
    email: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    customer_id: z.string().optional()
})

type PURCHASE_LINK = z.infer<typeof purchase_link>


const checkout_pay = z.object({
    checkout_id: z.string(),
    phone_number: z.string(),
    email: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    customer_id: z.string().optional()
})

type CHECKOUT_PAY = z.infer<typeof checkout_pay>

export {
  checkout,
  customer,
  payment_method,
  product,
  cart,
  cart_item,
  payment,
  seller,
  store,
  payment_input,
  purchase_link,
  checkout_pay,
  PAYMENT_METHOD,
  CUSTOMER,
  CHECKOUT,
  PRODUCT,
  CART,
  CART_ITEM,
  PAYMENT,
  SELLER,
  STORE,
  PAYMEN_INPUT,
  PURCHASE_LINK,
  CHECKOUT_PAY
};