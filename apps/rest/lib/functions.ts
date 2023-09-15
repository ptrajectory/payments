import { eq } from "drizzle-orm";
import db from "db";
import { PAYMENT } from "db/schema";
import { sleep } from "functions"
import { isUndefined } from "./cjs/lodash";
import { STORE } from "zodiac";
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";


/**
 * 
 * @param payment_id - the payment id
 * @param iteration - initial value should be 0, its the number of recursions the function has been through
 * @description - this function's job is to validate a payment by making multiple repeated checks on the payment over the course of 20 seconds
 * @returns 
 */
export async function validatePayment(payment_id: string, iteration: number = 0){

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

type environment = "production" | "testing"


export function generatePublishableKey(store: STORE, env: environment){
    const privateKey = process.env.PRIVATE_KEY ?? fs.readFileSync("./keys/privateKey.pem", { encoding: 'utf-8' })
    const publishableKey = jwt.sign({
        ...store,
        env
    }, privateKey, {
        algorithm: 'RS256'
    })

    return publishableKey

}



export function generateSecretKey(store: STORE, env: environment){

    const privateKey = process.env.SECRET_KEY ?? fs.readFileSync("./keys/secretKey.txt", { encoding: 'utf-8' })

    const secretKey = jwt.sign({
        ...store,
        env
    }, privateKey, {
        algorithm: 'HS256'
    })

    return secretKey

}


export function verifyPublishableKey(token: string): Promise<STORE & { env: environment } >{
    
    const publicKey = process.env.PUBLIC_KEY ?? fs.readFileSync("./keys/publicKey.pem", { encoding: 'utf-8' })

    return new Promise((res, rej)=>{
        jwt.verify(token, publicKey, (err, store)=>{
            
            if(err) return rej("Unable to verify")

            return res(store as any)
        }) 

    })

}

export function verifySecretKey(token: string): Promise<STORE & {env: environment}>{
    
    const privateKey = process.env.SECRET_KEY ?? fs.readFileSync("./keys/secretKey.txt", { encoding: 'utf-8' })

    return new Promise((res, rej)=>{
        jwt.verify(token, privateKey, (err, store)=>{
            
            if(err) return rej("Unable to verify with private key")

            return res(store as any)
        }) 

    })

}

export const generateCheckoutEphemeralKey = (checkout_id: string) => {

    const privateKey = process.env.PRIVATE_KEY ?? fs.readFileSync("./keys/privateKey.pem", { encoding: 'utf-8' })
    const publishableKey = jwt.sign({
        checkout_id
    }, privateKey, {
        algorithm: 'RS256'
    })

    return publishableKey

}


export const verifyCheckoutEphemeralKey = (token: string) => {
    const publicKey = process.env.PUBLIC_KEY ?? fs.readFileSync("./keys/publicKey.pem", { encoding: 'utf-8' })

    return new Promise((res, rej)=>{
        jwt.verify(token, publicKey, (err, chk)=>{
            
            if(err) return rej("Unable to verify")

            return res((chk as any)?.checkout_id)
        }) 

    })
}