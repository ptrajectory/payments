import z from "zod"

const customer = z.object({
    id: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    meta: z.any().nullable(),
    store_id: z.string().nullable().optional(),
    status: z.string().nullable().optional()
})

type CUSTOMER = z.infer<typeof customer>;


const payment_method = z.object({
    id: z.string().nullable().optional(),
    customer_id: z.string().nullable().optional(),
    type: z.enum(["mpesa", "airtel", "momo"]).nullable().optional(),
    phone_number: z.string().nullable().optional(),
    store_id: z.string().nullable().optional(),
    is_default: z.boolean().nullable().optional(),
    status: z.string().nullable().optional()
})

type PAYMENT_METHOD = z.infer<typeof payment_method>; 

const checkout = z.object({
    id: z.string().nullable().optional(),
    customer_id: z.string().nullable().optional(),
    status: z.enum(["pending_payment", "processing", "failed", "success"]).nullable().optional(),
    currency: z.enum(["KES", "EUR"]).nullable().optional(),
    payment_method_id: z.string().nullable().optional(),
    cart_id: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
    store_id: z.string().nullable().optional(),
    purchase_type: z.enum(['one_time', 'monthly_subscription', 'pre_order', 'backorder', 'pay_what_you_want']).nullable().optional()
})

type CHECKOUT = z.infer<typeof checkout>;

const product = z.object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(), 
    description: z.string().nullable().optional(),
    price: z.number().nullable().optional(), 
    image: z.string().nullable().optional(),
    store_id: z.string().nullable().optional(),
    status: z.enum(["draft", "published", "archived"]).nullable().optional(),
    type: z.enum(["physical", "digital", "service", "subscription", "bundle", "event_ticket", "discounted", "pay_what_you_want"]).nullable().optional()
})

type PRODUCT = z.infer<typeof product>;

const cart = z.object({
    id: z.string().nullable().optional(),
    customer_id: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    store_id: z.string().nullable().optional()
})

type CART = z.infer<typeof cart>; 

const cart_item = z.object({
    id: z.string().nullable().optional(),
    cart_id: z.string().nullable().optional(),
    product_id: z.string().nullable().optional(),
    quantity: z.number().nullable().optional(),
    store_id: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    customer_id: z.string().nullable().optional()
})

type CART_ITEM = z.infer<typeof cart_item>;


const payment = z.object({
    id: z.string().nullable().optional(),
    amount: z.number().nullable().optional(),
    token: z.string().nullable().optional(),
    state: z.enum(["processing", "failed", "success", "cancelled", "timed_out"]).nullable().optional(),
    payment_method_id: z.string().nullable().optional(),
    checkout_id: z.string().nullable().optional(),
    customer_id: z.string().nullable().optional(),
    store_id: z.string().nullable().optional()
})

type PAYMENT = z.infer<typeof payment>

const seller = z.object({
    id: z.string().nullable().optional(),
    uid: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    seller_name: z.string().nullable().optional()
})

type SELLER = z.infer<typeof seller>

const store = z.object({
    id: z.string().nullable().optional(),
    seller_id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    environment: z.enum(['production', 'testing']).nullable().optional()
})

type STORE = z.infer<typeof store>

const payment_input = z.object({
    checkout_id: z.string().optional(),
    payment_method_id: z.string().optional(),
    amount: z.number().optional(),
    phone_number: z.string().optional(),
    payment_option: z.enum(['mpesa']).optional().default("mpesa"),
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

const webhook_handler = z.object({
    id: z.string().optional(),
    store_id: z.string().optional(),
    url: z.string().optional(),
    custom_headers: z.record(z.string(), z.any()).optional(),
    enabled: z.boolean().optional(),
    subscriptions: z.array(z.string()).optional()
})

type WEBHOOK_HANDLER = z.infer<typeof webhook_handler>


const keys = z.object({
    id: z.string().nullable().optional(),
    store_id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    expiry: z.date().nullable().optional(),
    status: z.enum(["active", "inactive"]).nullable().optional(),
    value: z.string().nullable().optional(),
})

type KEYS = z.infer<typeof keys>

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
  webhook_handler,
  keys,
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
  CHECKOUT_PAY,
  WEBHOOK_HANDLER,
  KEYS
};