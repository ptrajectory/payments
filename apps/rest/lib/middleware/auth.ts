import { MiddleWareFn } from "../handler";
import { generate_dto } from "generators";
import { verifyCheckoutEphemeralKey, verifyPublishableKey, verifySecretKey } from "../functions";
import db from "db";
import { EphemeralPaymentKeys, SELLER } from "db/schema";
import { eq } from "drizzle-orm";
import { isEmpty, isNull, isString, isUndefined } from "../cjs/lodash";
import Clerk from "@clerk/clerk-sdk-node/esm/instance"


const clerk = Clerk({
    secretKey: process.env.CLERK_SECRET
})



export const storeSecretAuth: MiddleWareFn = async (req, res, next) => {

    const authorization = req.headers.authorization
    console.log(req.headers)
    const store_token = authorization?.split(" ")?.at(1)?.replace("prod_", "")?.replace("test_", "") // JUST IN CASE THE PREFIXES HADNT BEEN REMOVED 
    if(isUndefined(store_token)) return res.status(401).send(generate_dto(null, "Access Unauthorized", "error"))

    try{
        const store = await verifySecretKey(store_token)

        // @ts-ignore
        req.token = store_token
        // @ts-ignore
        req.store = store
        // @ts-ignore
        req.env = store.env

        next()

    }
    catch (e)
    {
        console.log("THE ERROR", e)
        return res.status(500).send(generate_dto(null, "Something went wrong", "error"))
    }
 
}

const doubleCheck =  async (store_token: string) => {
    let store
    try {
        return await verifyPublishableKey(store_token)
    }
    catch (e)
    {

        // JUST INCASE the request is coming from the backend
        try {
            return await verifySecretKey(store_token)
        }
        catch (e)
        {
            throw e
        }

    }
}


export const storePublicAuth: MiddleWareFn = async (req, res, next) => {

    const authorization = req.headers.authorization
    const store_token = authorization?.split(" ")?.at(1)?.replace("prod_", "")?.replace("test_", "") // JUST IN CASE THE PREFIXES HADNT BEEN REMOVED 

    if(isUndefined(store_token)) return res.status(401).send(generate_dto(null, "Access Unauthorized", "error"))

    try{
        const store = await doubleCheck(store_token)

        // @ts-ignore
        req.token = store_token
        // @ts-ignore
        req.store = store
        // @ts-ignore
        req.env = store.env

        next()

    }
    catch (e)
    {
        console.log("PUBLIC ERROR", e)
        return res.status(500).send(generate_dto(null, "Something went wrong", "error"))
    }
 
}

export const withEphemeralKey: MiddleWareFn = async (req, res, next) => {

    const ephemeral_key = req.headers?.["x-ephemeral-key"] as string

    if(!isString(ephemeral_key) || isEmpty(ephemeral_key)) return storeSecretAuth(req, res, next)

    try {

        const key =( await db.delete(EphemeralPaymentKeys).where(eq(EphemeralPaymentKeys.id, ephemeral_key)).returning())?.at(0) // DELETE so it doesn't get used again
        

        if(isNull(key?.id) || isUndefined(key?.id)) return res.status(403).send(generate_dto(null, "Invalid Ephemeral Key", "error"))

        // @ts-ignore
        const checkout_id = await verifyCheckoutEphemeralKey(key?.id)

        req.body.checkout_id = checkout_id

        return storePublicAuth(req,res,next)
    }
    catch (e)
    {   
        console.log("Ephemeral Validation error::",e)
        return res.status(403).send(generate_dto(null, "Ephemeral Key Failed", "error"))

    }

}


export const clerkAuth: MiddleWareFn = async (req, res, next) => {


    const clerk_session_id = req.headers?.["x-session-id"] as string

    if(!isString(clerk_session_id) || isEmpty(clerk_session_id) ) return res.status(401).send(generate_dto(null, "Unauthorized", "error"))

    try {
        const session = await clerk.sessions.getSession(clerk_session_id)

        const seller = await db.select({
            id: SELLER.id
        }).from(SELLER)
        .where(
            eq(SELLER.uid, session.userId)
        )
        const data = seller?.at(0)
        if(data) {
            // @ts-ignore 
            req.id = data?.id
            //@ts-ignore
            req.uid = session.userId 

            next()
        }
        else
        {
            return res.status(403).send(generate_dto(null, "Unauthorized", "error"))
        }
    }
    catch (e)
    {
        return res.status(401).send(generate_dto(null, "Unauthorized", "error"))
    }

}