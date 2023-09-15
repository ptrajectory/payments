# Using Ptrajectory Payments Node Package with Express

This guide will walk you through the basic usage of the `ptrajectory-payments-node` package with an Express server.

#### 📝 This library is dependant on an api that is still under development, it isn't ready for usage!!

## Installation

First, ensure you have the package installed:

```bash
npm install ptrajectory-payments-node
```

## Setup

Import the necessary modules and initialize with your host url and publishable key.

```ts
import { createPaymentClient } from "ptrajectory-payments-node";

const paymentsClient = createPaymentClient(process.env.URL, process.env.PUBLISHABLE_KEY);
```


## How to use 

After the initial setup you'll be able to interact with  payments, products, carts, checkouts and customer objects:


```ts

const new_customer = await paymentsClient.customers.create(the_customer_object)

const new_product = await paymentsClient.products.create(the_product_object)

```

You can also initialize payments

```ts

const payment_reference = await paymentsClient.payments.start({
    ...payment related detail {refer to types}
})
```

Confirm if a payment was successfully, which uses polling under the hood to check consistently for about a minute before erroring out.

```ts
const payment_status = await paymentsClient.payments.confirm(payment_reference.id)

if(payment_status === "SUCCESS") {
    // do something
}
else
{
    // do something else
}
```


## Express example

```ts
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
```


-------



## Development Notice

Please be aware that this library is currently under active development. I am working hard to make this library as robust, user-friendly, and feature-complete as possible.

As I continue to improve and expand the library, you may notice regular updates. These will often include bug fixes, performance improvements, and even new features. I strongly recommend keeping up to date with the latest versions to benefit from these improvements.

Please rest assured that every update is thoroughly tested to ensure compatibility and minimize any potential disruptions.

My goal is to provide you with a stable, reliable, and efficient tool for interacting with the Mpesa API. I appreciate your support and patience as I continue to enhance the library.