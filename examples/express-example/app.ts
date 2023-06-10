import "dotenv/config"
import express from 'express'
import mpesaExpressClient from 'porkytheblack-mpesa/events/express'
mpesaExpressClient.init({
    b2c_business_name: "testapi",
    c2b_business_name: "testapi",
    env: "sandbox",
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