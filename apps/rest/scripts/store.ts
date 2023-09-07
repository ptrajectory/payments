import { STORE as tSTORE } from "zodiac";
import { generateSecretKey } from "../lib/functions";
import db from "db";
import { SELLER, STORE } from "db/schema";
import { generate_unique_id } from "generators";
import { eq } from "drizzle-orm";
import { isUndefined } from "../lib/cjs/lodash";

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
};

(async()=>{


    console.log("GENERATING TEST STORE")

    try {
        const seller = (await db.insert(SELLER).values({
            id: generate_unique_id("sll"),
            uid: "uid",
            first_name: "TEST",
            last_name: "SELLER",
            created_at: new Date(),
            updated_at: new Date()
        }).returning())?.at(0)
    
        const store = (await db.insert(STORE).values({
            id: generate_unique_id("str"),
            name: "TESTING STORE",
            description: "THIS IS MEANT FOR TESTING",
            seller_id: seller?.id,
            created_at: new Date(),
            updated_at: new Date(),
        }).returning())?.at(0)
    
        if(isUndefined(store)) return console.log("STORE IS UNDEFINED ")
        
        const test_keys = generateStoreSecrets(store as any)
    
        const updated_store = await db.update(STORE).set({
            ...test_keys
        }).where(eq(STORE.id, store?.id))?.returning()
    
        console.log(JSON.stringify(updated_store?.at(0) ?? null))

        process.exit(0)

    }
    catch (e){

        console.log("SOMETHING WENT WRONG::",e)

        process.exit(1)

    }

})()