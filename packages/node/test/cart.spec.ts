import assert from "assert"
import Payments from "../src/index.ts"
import { isEmpty, isNull } from "../src/lib/cjs/lodash.ts"

const payments = new Payments("")
let customer_id: string | null = null 
let product_id: string | null = null
let cart_id: string | null = null
let cart_item_id: string | null = null 
const camera_image = "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

describe("CART", ()=>{

    before(async ()=>{

        const customer = await payments.customer?.createCustomers({
            email: "janedoe@email.com",
            first_name: "Jane",
            last_name: "Doe",
        })

        customer_id = customer?.id ?? null 

        const product = await payments.product?.createProduct({
            image: camera_image,
            name: "camera",
            price: 450.99,
            description: "Capture the universe"
        })

        product_id = product?.id ?? null

    })


    describe("BASIC CRUD", ()=>{


        it("Create a cart", (done)=>{

            payments.cart?.createCart({
                customer_id: customer_id ?? ""
            }).then((cart)=>{
                console.log("CART::", cart)
                assert.match((cart.id ?? ""), /crt/)
                assert.strictEqual(cart?.customer_id, customer_id)
                cart_id = cart?.id ?? null
                done()
            })
            .catch((e)=>{
                console.log("Error:", e)
                done(e)
            })

        })


        it("Add an item to the cart", (done)=>{

            if(isNull(cart_id)) return done(Error("CART ID is EMPTY"))

            payments.cart?.addCartItem(cart_id, {
                product_id: product_id ?? "",
                quantity: 2
            })
            .then((cart_item)=>{
                console.log("CART ITEM", cart_item)
                cart_item_id = cart_item?.id ?? null
                done()
            })
            .catch((e)=>{
                console.log("Error:", e)
                done(e)
            })
            
        })


        it("Get the cart", (done)=>{

            if(isNull(cart_id)) return done(Error("CART ID is EMPTY"))

            payments.cart?.getCart(cart_id).then((cart)=>{
                console.log("CART", cart)
                assert.strictEqual(cart.items.length, 1)
                assert.strictEqual(cart.id, cart_id)
                done()
            })
            .catch((e)=>{
                console.log("Error:", e)
                done(e)
            })

        })

        it("Update a cart items", (done)=>{

            if(isNull(cart_item_id) || isNull(cart_id)) return done(Error("Cart Item ID or CART ID is empty"))

            payments.cart?.updateCartItem(cart_item_id, cart_id, {
                quantity: 5
            }).then((data)=>{
                console.log("CART ITEM::", data)

                assert.strictEqual(data.quantity, 5)
                done()
            })
            .catch((e)=>{
                console.log("Error:", e)
                done(e)
            })
        })

        it("Update a cart", (done)=>{

            if(isNull(cart_id)|| isEmpty(cart_id)) return done(Error("Cart ID is empty"))

            payments.cart?.updateCart(cart_id, {
                status: "PURCHASED"
            }).then((data)=>{
                assert.strictEqual(data.status, "PURCHASED")
                done()
            })
            .catch((e)=>{
                console.log("Error:", e)
                done(e)
            })


        })


        it("Delete cart item", (done)=>{

            if(isNull(cart_id) || isNull(cart_item_id)) return done(Error("CART ID or CART ITEM ID is empty"))

            payments.cart?.deleteCartItem(cart_item_id, cart_id)
            .then((data)=>{
                assert.strictEqual(data.id, cart_item_id)
                done()
            })
            .catch((e)=>{
                console.log("Error:", e)
                done(e)
            })
        })


        it("Delete cart", (done)=>{

            if(isNull(cart_id)) return done(Error("CART ID is empty"))

            payments.cart?.deleteCart(cart_id)
            .then((data)=>{
                assert.strictEqual(data.id, cart_id)
                done()
            })
            .catch((e)=>{
                console.log("Error:", e)
                done(e)
            })
        })


    

    })


    after(async ()=>{

        // delete the customer
        await payments.customer?.deleteCustomer(customer_id)

        // delete the product
        await payments.product?.deleteProduct(product_id ?? "")

    })

})