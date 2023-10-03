import { relations } from "drizzle-orm"
import { boolean, date, doublePrecision, json, pgTable, text, timestamp } from "drizzle-orm/pg-core"

// app environments
const environment = text('environment', { enum: ["production", "testing"] }).default("testing")

// product types
const product_types = text('product_types', {
    enum: [
        "physical",
        "digital",
        "service",
        "subscription",
        "bundle",
        "event_ticket",
        "discounted",
        "pay_what_you_want"
    ]
}).default("physical")

const purchase_type = text("purchase_type", {
    enum: [
        "monthly_subscription",
        "one_time",
        "pre_order",
        "backorder",
        "pay_what_you_want"
    ]
}).default("one_time")


const product_status = text("product_status", {
    enum: [
        "draft",
        "published",
        "archived"
    ]
}).default("draft")


const checkout_status = text("checkout_status", {
    enum: [
        "pending_payment",
        "processing",
        "failed",
        "success"
    ]
}).default("pending_payment")


const key_status = text("key_status", {
    enum: [
        "active",
        "inactive"
    ]
}).default("active")


const cart_status = text("cart_status", {
    enum: [
        "open",
        "closed"
    ]
})


const payment_status = text('payment_state',{
    enum: [
        "processing",
        "failed",
        "success",
        "cancelled",
        "timed_out"
    ]
})

const checkout_currency = text("currency", {
    enum: [
        "KES",
        "EUR"
    ]
}).default("KES")

const payment_method_type = text("type", {
    enum: [
        "mpesa",
        "momo",
        "airtel"
    ]
})

/**
 * Customer
 */
export const CUSTOMER = pgTable("Customer", {
    id: text("id").primaryKey(),
    first_name: text("first_name"), 
    last_name: text("last_name"),
    email: text("email"),
    meta: json("meta"),
    created_at: timestamp("created_at").defaultNow(), 
    updated_at: timestamp("updated_at").defaultNow(),
    store_id: text("store_id").references(()=>STORE.id),
    environment,
    status: text("status")
})


export const CUSTOMERRelations = relations(CUSTOMER, ({many, one})=>{
    return {
        payment_methods: many(PAYMENT_METHOD),
        checkouts: many(CHECKOUT),
        store: one(STORE, {
            fields: [CUSTOMER.store_id],
            references: [STORE.id]
        })
    }
})

/**
 * PaymentMethod
 */
export const PAYMENT_METHOD = pgTable("PaymentMethod", {
    id: text("id").primaryKey(),
    type: payment_method_type,
    phone_number: text("phone_number"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    customer_id: text("customer_id").references(()=>CUSTOMER.id),
    store_id: text("store_id").references(()=>STORE.id),
    environment,
    is_default: boolean("is_default").default(false),
    status: text("status")
})

export const PAYMENT_METHODRelations = relations(PAYMENT_METHOD, ({one, many})=>{
    return {
        customer: one(CUSTOMER, {
            fields: [PAYMENT_METHOD.customer_id],
            references: [CUSTOMER.id]
        }),
        checkouts: many(CHECKOUT),
        store: one(STORE, {
            fields: [PAYMENT_METHOD.store_id],
            references: [STORE.id]
        })
    }
})


/**
 * Checkout
 */
export const CHECKOUT = pgTable("Checkout", {
    id: text("id").primaryKey(),
    amount: doublePrecision("amount"),
    currency: checkout_currency,
    status: checkout_status,
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    customer_id: text("customer_id").references(()=>CUSTOMER.id),
    payment_method_id: text("payment_method_id").references(()=>PAYMENT_METHOD.id),
    cart_id: text("cart_id").references(()=>CART.id),
    store_id: text("store_id").references(()=>STORE.id),
    environment,
    purchase_type
})

export const CHECKOUTRelations = relations(CHECKOUT, ({one, many})=>{
    return {
        customer: one(CUSTOMER, {
            fields: [CHECKOUT.customer_id],
            references: [CUSTOMER.id]
        }), 
        payment_method: one(PAYMENT_METHOD, {
            fields: [CHECKOUT.payment_method_id],
            references: [PAYMENT_METHOD.id]
        }),
        cart: one(CART, {
            fields: [CHECKOUT.cart_id],
            references: [CART.id]
        }),
        payments: many(PAYMENT),
        store: one(STORE, {
            fields: [CHECKOUT.store_id],
            references: [STORE.id]
        })
    }
})

export const PRODUCT = pgTable("Product", {
    id: text("id").primaryKey(),
    name: text("name"), 
    description: text("description"),
    price: doublePrecision("price"),
    image: text("image"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    store_id: text("store_id").references(()=>STORE.id),
    environment,
    status: product_status,
    type: product_types
})

export const PRODUCTRelations = relations(PRODUCT, ({many, one})=>{
    return {
        cart_items: many(CART_ITEM),
        store: one(STORE, {
            fields: [PRODUCT.store_id],
            references: [STORE.id]
        })
    }
})

export const CART = pgTable("Cart", {
    id: text("id").primaryKey(),
    customer_id: text("customer_id").references(()=>CUSTOMER.id), 
    status: cart_status,
    create_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    store_id: text("store_id").references(()=>STORE.id),
    environment
})

export const CARTRelations = relations(CART, ({many, one})=>{
    return {
        items: many(CART_ITEM),
        customer: one(CUSTOMER, {
            fields: [CART.customer_id],
            references: [CUSTOMER.id]
        }),
        store: one(STORE, {
            fields: [CART.store_id],
            references: [STORE.id]
        })
    }
})

export const CART_ITEM = pgTable("CartItem", {
    id: text("id").primaryKey(),
    cart_id: text("cart_id").references(()=>CART.id), 
    product_id: text("product_id").references(()=>PRODUCT.id), 
    quantity: doublePrecision("quantity"), 
    created_at: timestamp("created_at").defaultNow(), 
    updated_at: timestamp("updated_at").defaultNow(),
    store_id: text("store_id").references(()=>STORE.id),
    environment,
    status: text("status")
})

export const CART_ITEMRelations = relations(CART_ITEM, ({one})=>{
    return {
        cart: one(CART, {
            fields: [CART_ITEM.cart_id],
            references: [CART.id]
        }),
        product: one(PRODUCT, {
            fields: [CART_ITEM.product_id],
            references: [PRODUCT.id]
        }),
        store: one(STORE, {
            fields: [CART_ITEM.store_id],
            references: [STORE.id]
        })
    }
})


export const PAYMENT = pgTable("Payment", {
    id: text("id").primaryKey(),
    amount: doublePrecision("amount"),
    token: text("token"),
    state: payment_status,
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    payment_method_id: text("payment_method_id").references(()=>PAYMENT_METHOD.id),
    checkout_id: text("checkout_id").references(()=>CHECKOUT.id),
    customer_id: text("customer_id").references(()=>CUSTOMER.id),
    store_id: text("store_id").references(()=>STORE.id),
    environment
})

export const PAYMENTRelations = relations(PAYMENT, ({one})=>{
    return {
        payment_method: one(PAYMENT_METHOD, {
            fields: [PAYMENT.payment_method_id],
            references: [PAYMENT_METHOD.id]
        }),
        checkout: one(CHECKOUT, {
            fields: [PAYMENT.checkout_id],
            references: [CHECKOUT.id]
        }),
        customer: one(CUSTOMER, {
            fields: [PAYMENT.customer_id],
            references: [CUSTOMER.id]
        }),
        store: one(STORE, {
            fields: [PAYMENT.store_id],
            references: [STORE.id]
        })
    }
})


export const SELLER = pgTable("Seller", {
    id: text("id").primaryKey(),
    first_name: text("first_name"),
    last_name: text("last_name"),
    avatar: text("avatar"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    email: text("email"),
    seller_name: text("seller_name"),
    uid: text("uid")
})

export const SELLERRelations = relations(SELLER, ({many})=>{
    return {
        stores: many(STORE)
    }
})


export const STORE = pgTable("Store", {
    id: text("id").primaryKey(),
    seller_id: text("seller_id").references(()=> SELLER.id),
    name: text("name"),
    image: text("image"),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    status: text("status"),
    environment
})

export const STORERelations = relations(STORE, ({many, one})=>{
    return {
        seller: one(SELLER, {
            fields: [STORE.seller_id],
            references: [SELLER.id]
        }),
        customers: many(CUSTOMER),
        payment_methods: many(PAYMENT_METHOD),
        products: many(PRODUCT),
        carts: many(CART),
        cart_items: many(CART_ITEM),
        payments: many(PAYMENT),
        checkouts: many(CHECKOUT),
        keys: many(KEYS)
    }
})


export const KEYS = pgTable("Keys", {
    id: text("id").primaryKey(),
    store_id: text("store_id").references(()=>STORE.id),
    name: text("name"),
    expiry: timestamp("expiry"),
    status: key_status,
    value: text("value"),
    environment
})
