import 'dotenv/config'
import express from "express"
import morgan from "morgan"
import { createPaymentClient } from "ptrajectory-payments-node"

const app = express()
app.use(express.json())
app.use(morgan("combined"))



const paymentsClient = createPaymentClient(process.env.URL, process.env.PUBLISHABLE_KEY)

// Create a customet
app.post("/customer", async (req, res)=>{
    const body = req.body
    const new_customer = await paymentsClient.customers.create(body)

    return res.status(201).send(new_customer)
})

// get a customer
app.get("/customer/:customer_id", async (req, res) => {
    const id = req.params.customer_id

    const the_customer = await paymentsClient.customers.retrieve(id)

    return res.status(200).send(the_customer)
})

// update a customer
app.put("/customers/:customer_id", async (req, res)=>{
    const id = req.params.customer_id

    const body = req.body

    const the_updated_customer = await paymentsClient.customers.update(id, body)

    return res.status(200).send(the_updated_customer)
})

// archive a customer
app.patch("/customers/:customer_id", async (req, res)=>{

    const id = req.params.customer_id

    const the_archived_customer = await paymentsClient.customers.archive(id) 

    return res.status(200).send(the_archived_customer)

})

app.post("/products", async (req, res)=>{

    const body = req.body

    const new_product = await paymentsClient.products.create(body)

    return res.status(201).send(new_product)

})

app.get("/products/:product_id", async (req, res) =>{

    const id = req.params.product_id

    const the_product = await paymentsClient.products.retrieve(id)

    return res.status(200).send(the_product)

})

app.put("/products/:product_id", async (req, res)=>{

    const id = req.params.product_id 

    const body = req.body 

    const the_updated_product = await paymentsClient.products.update(id, body)

    return res.status(200).send(the_updated_product)

})

app.patch("/products/:product_id", async (req, res)=>{

    const id = req.params.product_id

    const the_archived_product = await paymentsClient.products.archive(id)

    return res.status(200).send(the_archived_product)

})

app.post("/carts", async (req, res)=>{

    const new_cart = await paymentsClient.carts.create(req.body)

    return res.status(201).send(new_cart)

})

app.put("/carts/:cart_id", async (req, res)=>{

    const updated_cart = await paymentsClient.carts.update(req.params.cart_id, req.body)

    return res.status(200).send(updated_cart)

})

app.post("/carts/:cart_id", async (req, res)=>{

    const new_cart_item = await paymentsClient.carts.addCartItem(req.params.cart_id, req.body)


    return res.status(200).send(new_cart_item)

})


app.put("/carts/:cart_id/:cart_item_id", async (req, res)=>{

    const updated_cart_item = await paymentsClient.carts.updateCartItem(req.params.cart_id, req.params.cart_item_id, req.body)

    return res.status(200).send(updated_cart_item)

})

app.delete("/carts/:cart_id/:cart_item_id", async (req, res)=>{
    const { cart_id, cart_item_id } = req.params
    const deleted_item =  await paymentsClient.carts.deleteCartItem(cart_id, cart_item_id)

    return res.status(200).send(deleted_item)

})


// .... you get the idea



app.listen(8090, ()=>{
    console.log("🚀 Huston we have ignition.")
})



const my_test_api_key = "test_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU3BvbmdlYm9iIEJpa2UgU3RvcmUiLCJpZCI6InN0cl9jOWI2ZWNmMjE5YWU1MzcxYzIwMTM3N2JkMzgwYjVmMCIsInNlbGxlcl9pZCI6InNsbF8yYTQ0MWM3Y2JlNjI4MDE4YjAzMWQyMzMyY2E4ZDJiNCIsImVudiI6InRlc3RpbmciLCJpYXQiOjE2OTQ3OTYwNDF9.zw5zbMaTJKjoSZb1MBFsRHYAxfPo1Dlxgp-q9Im5m5I"

const client = createPaymentClient("https://payments-api.ptrajectory.com", my_test_api_key);


(async()=>{


    const customer = await client.customers.create({
        first_name: "Jack",
        last_name: "Ryan",
        email: "jryan@cia.org"
    })

    console.log("NEW CUSTOMER CREATED::", customer)

    const payment_method = await client.paymentMethods.create({
        customer_id: customer?.id,
        phone_number: "254711111111",
        is_default: true,
        type: "MPESA"
    })

    console.log("NEW PAYMENT METHOD", payment_method)

    const product = await client.products.create({
        name: "Cool Bike For testing",
        description: "This is the coolest product ever",
        image: "",
        price: 10
    })

    const cart = await client.carts.create({
        customer_id: customer?.id
    })


    const new_cart_item = await client.carts.addCartItem(cart?.id, {
        cart_id: cart?.id,
        customer_id: customer?.id,
        quantity: 5,
        product_id: product?.id
    })


    const checkout = await client.checkouts.create({
        cart_id: cart?.id,
        currency: "KES",
        customer_id: customer?.id,
        purchase_type: "one_time",
        payment_method_id: payment_method?.id
    })


    // trigger payment

    const payment = await client.checkouts.pay(checkout?.ephemeralKey, {
        checkout_id: checkout?.id
    })

    // confirm if the payment was successful

    const status = await client.payments.confirm(payment.id)

    if(status === "SUCCESS"){
        console.log("Hooray 🎉🎉🎉🎉🎉🎉🎉🎉🎉")
    }
    else {
        console.log("Ohh No")
    }



})();