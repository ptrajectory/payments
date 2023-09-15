import mpesaExpressClient from 'porkytheblack-mpesa/events/express'
import { clients } from '../../../lib/clients'
import { eq } from 'drizzle-orm'
import { PAYMENT } from 'db/schema'

mpesaExpressClient.init({
    b2c_business_name: 'testapi',
    c2b_business_name: 'testapi',
    env: process.env.APP_ENV === "production" ? "production" : "sandbox"
})

// TODO: update the way the callback url gets passed down to the client
mpesaExpressClient.client.set_callback_url("https://d713-41-80-117-206.ngrok-free.app")

mpesaExpressClient.on('payment:error', async (data)=>{
    console.log("Here is the payment  error::", data)
    await clients.db?.update(PAYMENT)
    .set({
        status: "FAILED"
    })
    .where(eq(PAYMENT.token, data?.Body?.stkCallback?.CheckoutRequestID))
})

mpesaExpressClient.on("payment:invalid", async (data)=> {
    console.log("PAYMENT INVALID", JSON.stringify(data))
    const checkout_request_id = (data.received as any)?.Body?.stkCallback?.CheckoutRequestID 

    await clients?.db?.update(PAYMENT)
    .set({
        status: "FAILED"
    })
    .where(eq(PAYMENT.token, checkout_request_id))
})

mpesaExpressClient.on('payment:success', async (data)=>{
    await clients.db?.update(PAYMENT)
    .set({
        status: "SUCCESS"
    })
    .where(eq(PAYMENT.token, data?.Body?.stkCallback?.CheckoutRequestID))
})

export default mpesaExpressClient

