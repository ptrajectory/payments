import { eq } from "drizzle-orm";
import db from "./db";
import { PAYMENT } from "./db/schema";
import { sleep } from "functions"
import { isUndefined } from "./cjs/lodash";


/**
 * 
 * @param payment_id - the payment id
 * @param iteration - initial value should be 0, its the number of recursions the function has been through
 * @description - this function's job is to validate a payment by making multiple repeated checks on the payment over the course of 20 seconds
 * @returns 
 */
async function validatePayment(payment_id: string, iteration: number = 0){

    try {
        const payment = await db.query.PAYMENT.findFirst({
            where: eq(PAYMENT.id, payment_id)
        }) 

        if(isUndefined(payment)) return Promise.reject(`UNABLE TO FIND PAYMENT ID: ${payment_id}`)

        if(payment.status !== "SUCCESS" && iteration < 20) {
            await sleep(1000)
            return validatePayment(payment_id, iteration + 1)
        }

        return payment.status

    }
    catch (e)
    {
        return Promise.reject(`UNABLE TO VALIDATE PAYMENT ID: ${payment_id}`)
    }
}


export {
    validatePayment
}