import assert from "assert";
import { PaymentsClientHttpError, createPaymentClient } from "../src";
import { isNull, isUndefined } from "../src/lib/cjs/lodash";
import db from "db"
import { CART, CUSTOMER, PRODUCT } from "db/schema";
import { eq, and } from "db/utils"



const client = createPaymentClient(process.env.URL as string, process.env.PUBLISHABLE_KEY as string)

let customer_id: string | null = null 
let product_id: string | null = null
let cart_id: string | null = null 
let cart_item_id: string | null = null 


describe("CART", ()=> {

    before(async ()=>{

        const customer = await client.customers.create({
            last_name: "bob",
            first_name: "bob",
            email: "bob@builder.com",  
        })

        customer_id = customer?.id ?? null


        const product = await client.products.create({
            name: "Cool Product",
            description: "A cool product",
            image: "NO IMAGE",
            price: 300,
        })

        product_id = product?.id ?? null


    })


    it("CREATE A CART", (done)=>{
        if(isNull(customer_id)) return done(new Error("CUSTOMER ID IS INVALID"))

        client.carts.create({
            customer_id
        }).then((cart)=>{
            assert(!isUndefined(cart?.id))
            cart_id = cart?.id ?? null
            done()
        })
        .catch((e)=>{
            if(e  instanceof PaymentsClientHttpError){
                console.log("SERVER RESPONDED WITH", e.code)

            }

            done(e)
        })

    })


    it("Add a cart item", (done)=> {

        if(isNull(cart_id) || isNull(product_id)) return done(new Error("Invalid ID specified"))

        client.carts.addCartItem(cart_id, {
            product_id,
            quantity: 5
        }).then((cart_item)=>{

            assert.strictEqual(cart_item?.cart_id, cart_id)
            cart_item_id = cart_item?.id ?? null
            done()

        })
        .catch((e)=>{
            if(e  instanceof PaymentsClientHttpError){
                console.log("SERVER RESPONDED WITH", e.code)

            }

            done(e)
        })

    })


    it("Get the cart with items", (done)=>{

        if(isNull(cart_id)) return done(new Error("Invalid cart id"))

        client.carts.retrieve(cart_id)
        .then((cart_data)=>{

            assert.strictEqual(cart_data?.id, cart_id)
            assert.strictEqual(cart_data?.items?.length, 1)

            done()

        })
        .catch((e)=>{
            if(e  instanceof PaymentsClientHttpError){
                console.log("SERVER RESPONDED WITH", e.code)

            }

            done(e)
        })

    })


    it("Update the cart", (done)=>{

        if(isNull(cart_id)) return done(new Error("Invalid cart id"))

        client.carts.update(cart_id, {
            status: "ACTIVE"
        }).then((cart)=>{
            assert.strictEqual(cart?.id, cart_id)
            assert.strictEqual(cart?.status, "ACTIVE")
            done()
        })
        .catch((e)=>{
            if(e  instanceof PaymentsClientHttpError){
                console.log("SERVER RESPONDED WITH", e.code)

            }
            done(e)
        })

    })

    it("Update cart item", (done)=>{

        if(isNull(cart_id) || isNull(cart_item_id)) return done(new Error("Invalid ID"))

        client.carts.updateCartItem(cart_id,cart_item_id, {
            quantity: 10
        }).then((cart_item)=>{
            assert.strictEqual(cart_item?.cart_id, cart_id)
            assert.strictEqual(cart_item_id, cart_item?.id) 
            assert.strictEqual(cart_item?.quantity, 10)
            done()
        })
        .catch((e)=>{
            if(e  instanceof PaymentsClientHttpError){
                console.log("SERVER RESPONDED WITH", e.code)

            }
            done(e)
        })

    })

    it("Delete cart item", (done)=> {

        if(isNull(cart_id) || isNull(cart_item_id)) return done(new Error("Invalid ID"))

        client.carts.deleteCartItem(cart_id, cart_item_id)
        .then((cart_item)=>{
            assert.strictEqual(cart_item?.cart_id, cart_id)
            assert.strictEqual(cart_item_id, cart_item?.id) 
            done()
        })
        .catch((e)=>{
            if(e  instanceof PaymentsClientHttpError){
                console.log("SERVER RESPONDED WITH", e.code)

            }
            done(e)
        })

    })


    after(async ()=>{

        // // cart item already deleted

        // // delete cart
        // cart_id && await db.delete(CART)
        // .where(eq(CART.id, cart_id))


        // // delete product
        // product_id && await db.delete(PRODUCT)
        // .where(eq(PRODUCT.id, product_id ))

        // // delete customer
        // customer_id && await db.delete(CUSTOMER)
        // .where(eq(CUSTOMER.id, customer_id))

    })

})