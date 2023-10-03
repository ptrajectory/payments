import mpesaExpressClient from 'porkytheblack-mpesa/events/express'
import { clients } from '../../../lib/clients'
import { eq } from 'drizzle-orm'
import { PAYMENT } from 'db/schema'
import events from '../../../lib/events'
import { PAYMENT as tPAYMENT } from 'zodiac'

mpesaExpressClient.init({
    b2c_business_name: process.env.MPESA_BUSINESS_NAME,
    c2b_business_name: process.env.MPESA_BUSINESS_NAME,
    env: process.env.APP_ENV === "production" ? "production" : "sandbox",
    callback_url: process.env.MPESA_CALLBACK_URL
})

// TODO: update the way the callback url gets passed down to the client

mpesaExpressClient.on('payment:error', async (data)=>{
    console.log("Here is the payment  error::", data)



    await clients.db?.update(PAYMENT)
    .set({
        status: "FAILED"
    })
    .where(eq(PAYMENT.token, data?.Body?.stkCallback?.CheckoutRequestID)).returning()
})

mpesaExpressClient.on("payment:invalid", async (data)=> {
    console.log("PAYMENT INVALID", JSON.stringify(data))
    const checkout_request_id = (data.received as any)?.Body?.stkCallback?.CheckoutRequestID 

    const updated = await clients?.db?.update(PAYMENT)
    .set({
        status: "FAILED"
    })
    .where(eq(PAYMENT.token, checkout_request_id)).returning()

    const payment  = updated?.at(0) ?? null

    events.emit("payment.success", payment as tPAYMENT)
})

mpesaExpressClient.on('payment:success', async (data)=>{
    await clients.db?.update(PAYMENT)
    .set({
        status: "SUCCESS"
    })
    .where(eq(PAYMENT.token, data?.Body?.stkCallback?.CheckoutRequestID))
})

export default mpesaExpressClient

