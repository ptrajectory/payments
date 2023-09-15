

### How to use the express client
**Note** You need to have correctly set environment variables for this to work.
```env
# The consumer key for the app
C2B_MPESA_CONSUMER_KEY=

# The consumer secret for the app
C2B_MPESA_CONSUMER_SECRET=

# The pass key for the app
C2B_MPESA_PASSKEY=

# The short code for the app
C2B_MPESA_SHORTCODE=

# The business name for the app, will be used to identify the initiator
B2C_PASSWORD=

# The business name for the app, will be used to identify the initiator
B2C_SECURITY_CREDENTIAL=

# The business name for the app, will be used to identify the initiator
B2C_MPESA_CONSUMER_KEY=

# The business name for the app, will be used to identify the initiator
B2C_MPESA_CONSUMER_SECRET=

# The business name for the app, will be used to identify the initiator
B2C_MPESA_PASSKEY=

# The business name for the app, will be used to identify the initiator
B2C_MPESA_SHORTCODE=
```
```ts
import "dotenv/config"
import express from 'express'
import mpesaExpressClient from 'porkytheblack-mpesa/events/express' // This is a singleton instance of the mpesa express client
mpesaExpressClient.init({ // NOTE: you dont need to manually pass in any of your env variables since they'll automatically get picked up
    b2c_business_name: "testapi",
    c2b_business_name: "testapi",
    env: "sandbox",
    callback_url: "https://an_ngrok_url_if_testing.app" // BASE URL
})

process.on('uncaughtException', (e)=>{
    console.log("Error::", e)
})
const app = express()
app.use(express.json())

const router = express.Router()
/**
 * If a payment is successful, this callback will be called 
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payment:success', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payment is unsuccessful, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payment:error', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payment is invalid, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user    
 */
mpesaExpressClient.on("payment:invalid", (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payout is successful, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payout:success', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payout is unsuccessful, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payout:error', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payout is invalid, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on("payout:invalid", (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payment request is successful, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payment-request:success', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payment request is unsuccessful, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payment-request:error', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payout request is successful, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payout-request:success', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})
/**
 * If a payout request is unsuccessful, this callback will be called
 * This is where you can include code to update your database or send an inapp notification to your user
 */
mpesaExpressClient.on('payout-request:error', (data)=>{
    // TODO: Update your database or send an inapp notification to your user
})

/**
 * This is the endpoint that will be called by safaricom when a payment is made
 * This endpoint should be accessible to the internet i.e https://yourdomain.com/c2b/callback
 */
router.post('/c2b/callback', mpesaExpressClient.paymentsCallbackHandler)
/**
 * This is the endpoint that will be called by safaricom when a payout is made
 * This endpoint should be accessible to the internet i.e https://yourdomain.com/b2c/callback
 */
router.post('/b2c/result', mpesaExpressClient.payoutsCallbackHandler)
/**
 * This is the endpoint that will be called by safaricom when a payment request is made
 * This endpoint should be accessible to the internet i.e https://yourdomain.com/c2b/timeout
 */
router.post('/b2c/timeout', mpesaExpressClient.payoutsCallbackHandler)
/**
 * This endpoint will be called by your frontend to initiate a payment
 * This endpoint should be accessible to the internet i.e https://yourdomain.com/c2b/payment-request
 */
router.post('/c2b/payment-request', mpesaExpressClient.paymentRequestHandler)
/**
 * This endpoint will be called by your frontend to initiate a payout
 * This endpoint should be accessible to the internet i.e https://yourdomain.com/b2c/payout-request
 */
router.post('/b2c/payout-request', mpesaExpressClient.payoutRequestHandler)

app.use(router)

export default app
```

- Review the example in the [examples](../../examples/express-example) folder for a complete working example.


Note: Always ensure to secure your keys and secrets. The above example uses hard-coded strings for simplicity. In a real-life application, use environment variables or some other form of secure configuration.

## Development Notice

Please be aware that this library is currently under active development. I am working hard to make this library as robust, user-friendly, and feature-complete as possible.

As I continue to improve and expand the library, you may notice regular updates. These will often include bug fixes, performance improvements, and even new features. I strongly recommend keeping up to date with the latest versions to benefit from these improvements.

Please rest assured that every update is thoroughly tested to ensure compatibility and minimize any potential disruptions.

My goal is to provide you with a stable, reliable, and efficient tool for interacting with the Mpesa API. I appreciate your support and patience as I continue to enhance the library.
