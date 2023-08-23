import { isEmpty, isNull } from "lodash"
import Payments from "../src"
import assert from "assert"



const payments = new Payments("")
let customer_id: string | null = null 
let product_id: string | null = null
let cart_id: string | null = null
let cart_item_id: string | null = null
let payment_method_id: string | null = null
let checkout_id: string | null = null 
const camera_image = "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

describe.only("PAYMENT", ()=>{

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

        const cart = await payments.cart?.createCart({
            customer_id: customer_id ?? ""
        })

        cart_id = cart?.id ?? null

        const cart_item = await payments.cart?.addCartItem((cart_id ?? ""), {
            product_id: product_id ?? "",
            quantity: 5
        })

        cart_item_id = cart_item?.id ?? null

        const payment_method = await payments.payment_method?.createPaymentMethod({
            customer_id: customer_id ?? "",
            phone_number: "254794699065",
            type: "MPESA"
        })

        payment_method_id = payment_method?.id ?? null


        const checkout = await payments.checkout?.createCheckout({
            cart_id: cart_id ?? "",
            payment_method_id: payment_method_id ?? "",
            customer_id: customer_id ?? "",
            currency: "KES",
        })

        checkout_id = checkout?.id ?? null
    })

    describe("BASIC INTERGRATION TESTING", ()=>{


        it("Initialize a PAYMENT", (done)=>{


            if(isNull(checkout_id) || isNull(customer_id) || isNull(payment_method_id)) return done(Error("IDS are required"))


            payments.payment?.createPayment({
                checkout_id: checkout_id,
                customer_id: customer_id,
                payment_method_id: payment_method_id
            }).then((data)=>{
                assert.strictEqual(data.status, "PROCESSING")
                assert(!isEmpty(data.token))
                done()
            })
            .catch((e)=>{

                console.log("Error", e)
                done(e)

            })

        })


    })


    after(async ()=>{
        // delete the customer
        await payments.customer?.deleteCustomer(customer_id)

        // delete the product
        await payments.product?.deleteProduct(product_id ?? "")

        // delete the cart item
        await payments.cart?.deleteCartItem((cart_item_id ?? ""), (cart_id ?? ""))

        // delete the cart
        await payments.cart?.deleteCart(cart_id ?? "")

    })

})