import { relations } from "drizzle-orm"
import { date, doublePrecision, json, pgTable, text, timestamp } from "drizzle-orm/pg-core"

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
    updated_at: timestamp("updated_at").defaultNow()
})


export const CUSTOMERRelations = relations(CUSTOMER, ({many})=>{
    return {
        payment_methods: many(PAYMENT_METHOD),
        checkouts: many(CHECKOUT)
    }
})

/**
 * PaymentMethod
 */
export const PAYMENT_METHOD = pgTable("PaymentMethod", {
    id: text("id").primaryKey(),
    type: text("type"),
    phone_number: text("phone_number"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    customer_id: text("customer_id").references(()=>CUSTOMER.id)
})

export const PAYMENT_METHODRelations = relations(PAYMENT_METHOD, ({one, many})=>{
    return {
        customer: one(CUSTOMER, {
            fields: [PAYMENT_METHOD.customer_id],
            references: [CUSTOMER.id]
        }),
        checkouts: many(CHECKOUT)
    }
})


/**
 * Checkout
 */
export const CHECKOUT = pgTable("Checkout", {
    id: text("id").primaryKey(),
    amount: doublePrecision("amount"),
    currency: text("currency"),
    status: text("status"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    customer_id: text("customer_id").references(()=>CUSTOMER.id),
    payment_method_id: text("payment_method_id").references(()=>PAYMENT_METHOD.id),
    cart_id: text("cart_id").references(()=>CART.id)
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
        payments: many(PAYMENT)
    }
})

export const PRODUCT = pgTable("Product", {
    id: text("id").primaryKey(),
    name: text("name"), 
    description: text("description"),
    price: doublePrecision("price"),
    image: text("image"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
})

export const PRODUCTRelations = relations(PRODUCT, ({many})=>{
    return {
        cart_items: many(CART_ITEM)
    }
})

export const CART = pgTable("Cart", {
    id: text("id").primaryKey(),
    customer_id: text("customer_id").references(()=>CUSTOMER.id), 
    status: text("status"),
    create_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
})

export const CARTRelations = relations(CART, ({many, one})=>{
    return {
        items: many(CART_ITEM),
        customer: one(CUSTOMER, {
            fields: [CART.customer_id],
            references: [CUSTOMER.id]
        })
    }
})

export const CART_ITEM = pgTable("CartItem", {
    id: text("id").primaryKey(),
    cart_id: text("cart_id").references(()=>CART.id), 
    product_id: text("product_id").references(()=>PRODUCT.id), 
    quantity: doublePrecision("quantity"), 
    created_at: timestamp("created_at").defaultNow(), 
    updated_at: timestamp("updated_at").defaultNow()
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
        })
    }
})


export const PAYMENT = pgTable("Payment", {
    id: text("id").primaryKey(),
    amount: doublePrecision("amount"),
    token: text("token"),
    status: text("status"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
    payment_method_id: text("payment_method_id").references(()=>PAYMENT_METHOD.id),
    checkout_id: text("checkout_id").references(()=>CHECKOUT.id),
    customer_id: text("customer_id").references(()=>CUSTOMER.id)
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
        })
    }
})