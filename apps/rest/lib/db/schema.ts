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
    created_at: timestamp("created_at"), 
    updated_at: timestamp("updated_at")
})


export const customerRelations = relations(CUSTOMER, ({many})=>{
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
    created_at: timestamp("created_at"),
    updated_at: timestamp("updated_at"),
    customer_id: text("customer_id").references(()=>CUSTOMER.id)
})

export const payment_methodRelations = relations(PAYMENT_METHOD, ({one, many})=>{
    return {
        customer: one(CUSTOMER),
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
    created_at: timestamp("created_at"),
    updated_at: timestamp("updated_at"),
    customer_id: text("customer_id").references(()=>CUSTOMER.id),
    payment_method_id: text("payment_method_id").references(()=>PAYMENT_METHOD.id)
})

export const checkoutRelations = relations(CHECKOUT, ({one})=>{
    return {
        customer: one(CUSTOMER), 
        payment_method: one(PAYMENT_METHOD),
    }
})