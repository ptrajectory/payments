import db from "db"
import events from "."
import { CUSTOMER, PAYMENT, STORE, WEBHOOK_HANDLER } from "db/schema"
import { eq } from "drizzle-orm"
import eventHandler from "../lhe"

events.on("payment.success", async (data)=>{

    if(!data?.store_id) return

    const store_id = data?.store_id 


    const webhooks = await db.query.WEBHOOK_HANDLER.findMany({
        where: (whh, { eq, and }) => and(
            eq(whh.store_id, store_id),
            eq(whh.enabled, true)
        )
    })

    for (const webhook of webhooks){
        if(webhook.url && webhook?.store_id){
            eventHandler.createWebhook({
                type: "payment.success",
                payload: {
                    type: "payments.success",
                    resource: "payments",
                    object: data
                },
                receiver: {
                    headers: webhook?.custom_headers ?? {} as any,
                    url: webhook.url
                },
                sender: {
                    email: "",
                    id: webhook?.store_id,
                    name: "PAYMENTS"
                }
            })

        }else{
            continue
        }
    }

    const customer_id = data?.customer_id
    if(customer_id){
        const customer = await db.query.CUSTOMER.findFirst({
            where: (cus, { eq }) => eq(cus.id, customer_id),
            with: {
                store: true
            }
        })


        if(customer?.email){
            eventHandler.createEmail({
                receiver: {
                    email: customer?.email
                },
                payload: {
                    body: "",
                    from: customer?.email,
                    subject: "Your Payment Was Successful."
                },
                sender: {
                    email: "payments@ptrajectory.com",
                    id: customer?.store_id ?? "",
                    name: customer?.store?.name ?? "Ptrajectory Payments"
                }
            })

        }
    }

})




events.on("payment.failed", async (data)=> {

    if(!data?.store_id) return

    const store_id = data?.store_id 


    const webhooks = await db.query.WEBHOOK_HANDLER.findMany({
        where: (whh, { eq, and }) => and(
            eq(whh.store_id, store_id),
            eq(whh.enabled, true)
        )
    })

    for (const webhook of webhooks){
        if(webhook.url && webhook?.store_id){
            eventHandler.createWebhook({
                type: "payment.success",
                payload: {
                    type: "payments.success",
                    resource: "payments",
                    object: data
                },
                receiver: {
                    headers: webhook?.custom_headers ?? {} as any,
                    url: webhook.url
                },
                sender: {
                    email: "",
                    id: webhook?.store_id,
                    name: "PAYMENTS"
                }
            })

        }else{
            continue
        }
    }

    const customer_id = data?.customer_id
    if(customer_id){
        const customer = await db.query.CUSTOMER.findFirst({
            where: (cus, { eq }) => eq(cus.id, customer_id),
            with: {
                store: true
            }
        })


        if(customer?.email){
            eventHandler.createEmail({
                receiver: {
                    email: customer?.email
                },
                payload: {
                    body: "",
                    from: customer?.email,
                    subject: "Your Payment Was UNSuccessful."
                },
                sender: {
                    email: "payments@ptrajectory.com",
                    id: customer?.store_id ?? "",
                    name: customer?.store?.name ?? "Ptrajectory Payments"
                }
            })

        }
    }

})