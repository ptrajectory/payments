import assert from "assert";
import { PaymentsClientHttpError, createPaymentClient } from "../src";
import { isNull } from "../src/lib/cjs/lodash";
import db from "db";
import { CART, CART_ITEM, CHECKOUT, CUSTOMER, PAYMENT, PAYMENT_METHOD, PRODUCT } from "db/schema";
import { eq } from "db/utils";



const client = createPaymentClient(process.env.URL as string, process.env.PUBLISHABLE_KEY as string)


let customer_id: string | null = null 
let product_id: string | null = null
let cart_id: string | null = null
let payment_method_id: string | null = null
let ephemeralKey: string | null = null
let checkout_id: string | null = null
let payment_id: string | null = null

describe("CHECKOUT", ()=>{

    before(async ()=>{

        const customer = await client.customers.create({
            email: "someone@email.com",
            first_name: "Jon",
            last_name: "Snow"

        })

        customer_id = customer?.id ?? null 

        const payment_method = customer_id ? await client.paymentMethods.create({
            customer_id,
            phone_number: "254711111111",
            type: "MPESA"
        }) : null


        payment_method_id = payment_method?.id ?? null


        const product = await client.products.create({
            name: "product_one",
            image: "NO IMAGE"
        })

        product_id = product?.id ?? null


        const cart = await client.carts.create({
            customer_id: customer?.id
        })

        cart_id = cart?.id ?? null

        
        cart?.id && await client.carts.addCartItem(cart?.id, {
            product_id: product?.id,
            quantity: 1
        })

    })


    it("Create checkout", (done)=>{

        if(isNull(cart_id) || isNull(customer_id) || isNull(payment_method_id)) return done(new Error("ID INVALID"))


        client.checkouts.create({
            cart_id: cart_id,
            currency: "KES",
            customer_id,
            purchase_type: 'one_time',
            payment_method_id
        })
        .then((checkout)=>{
            checkout_id = checkout?.id ?? null
            ephemeralKey = checkout?.ephemeralKey ?? null
            assert.strictEqual(checkout?.customer_id, customer_id)
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server Error::", e.code)
            }
            done(e)
        })


    })


    it("Makes the payment", (done)=>{

        if(isNull(ephemeralKey) || isNull(checkout_id)) return done(new Error('Ephemeral Key'))

        client.checkouts.pay(ephemeralKey, {
            checkout_id
        }).then((payment)=>{
            payment_id = payment?.id ?? null
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server Error::", e.code)
            }
            done(e)
        })

    })


    it("Check payment status", (done)=>{

        if(isNull(payment_id)) return done(new Error("PAYMENT ID IS NULL"))


        client.payments.confirm(payment_id).then((status)=>{
            assert.strictEqual(status, "SUCCESS")
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server Error::", e.code)
            }
            done(e)
        })   

    })


    it("Archive checkout", (done)=>{

        if(isNull(checkout_id)) return done(new Error("Checkout ID is null"))

        client.checkouts.archive(checkout_id) 
        .then((checkout)=>{
            assert.strictEqual(checkout?.status, "ARCHIVED") 
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server Error::", e.code)
            }
            done(e)
        })

    })


    


    after(async ()=>{

        // delete all cart items for the current cart

        cart_id && await db.delete(CART_ITEM)
        .where(eq(CART_ITEM.cart_id, cart_id))


        // delete product

        product_id && await db.delete(PRODUCT)
        .where(eq(PRODUCT.id, product_id))

        // delete cart

        cart_id && await db.delete(CART)
        .where(eq(CART.id, cart_id))

        // delete checkout

        checkout_id && await db.delete(CHECKOUT)
        .where(eq(CHECKOUT.id, checkout_id)) 

        // delete payment_method
        payment_method_id && await db.delete(PAYMENT_METHOD)
        .where(eq(PAYMENT_METHOD.id, payment_method_id))

        // delete  customer
        customer_id && await db.delete(CUSTOMER)
        .where(eq(CUSTOMER.id, customer_id))

        // delete payment
        payment_id && await db.delete(PAYMENT)
        .where(eq(PAYMENT.id, payment_id))

    })

})