import { STORE as tSTORE, store } from "zodiac";
import { AuthenticatedRequest, ClerkAuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto, generate_unique_id } from "generators";
import { STORE } from "db/schema";
import { generateSecretKey } from "../../../lib/functions";
import { eq } from "drizzle-orm";
import { isUndefined } from "../../../lib/cjs/lodash";


const generateStoreSecrets = (store: tSTORE) => {

    const prod_secret_key = generateSecretKey({
        name: store.name,
        id: store.id,
        seller_id: store.seller_id
    }, "production")

    const test_secret_key = generateSecretKey({
        name: store.name,
        id: store.id,
        seller_id: store.seller_id
    }, "testing")

    const prod_publishable_key = generateSecretKey({
        name: store.name,
        id: store.id,
        seller_id: store.seller_id
    }, "production")

    const test_publishable_key = generateSecretKey({
        name: store.name,
        id: store.id,
        seller_id: store.seller_id
    }, "testing")

    return {
        prod_secret_key: `prod_${prod_secret_key}`,
        test_secret_key: `test_${test_secret_key}`,
        prod_publishable_key: `prod_${prod_publishable_key}`,
        test_publishable_key: `test_${test_publishable_key}`
    }
}

export const createStore: HandlerFn<ClerkAuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients 

    const body = req.body

    console.log("incoming body::", body)

    const parsed = store.safeParse(body)

    if(!parsed.success) return res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid store body", "error"))


    try{


        const result = await db?.insert(STORE)
        .values({
            id: generate_unique_id("str"),
            ...parsed.data,
            created_at: new Date(),
            updated_at: new Date(),
            seller_id: req.id,
            environment: "testing"
        }).returning()

       const store = result?.at(0)

       if(isUndefined(store)) return res.status(400).send(generate_dto(null, "Something went wrong", "error"))


       
       
       try {
           const store_secrets = generateStoreSecrets({
            id: store.id,
            name: store.name ?? "",
            seller_id: store.seller_id ?? ""
           })

           await db?.update(STORE).set({
            ...store_secrets
           })
           .where(eq(STORE.id, store.id))


           return res.status(201).send(generate_dto(store, "Success", "success"))


       }
       catch (e)
       {
        return res.status(500).send(generate_dto(null, "Unable to generate store secrets", "error"))
       }



    }
    catch (e)
    {
        return res.status(500).send(generate_dto(null, "Something went wrong", "error"))
    }
    

}

