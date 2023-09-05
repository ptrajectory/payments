import db from "db"
import { auth } from "@clerk/nextjs"
import { isNull } from "lodash"
import { SELLER, STORE as tSTORE, store } from "zodiac"
import { stringifyDatesInJSON } from "@/lib/utils"
import { MainDashboardPage } from "./_page"
import { CUSTOMER, PRODUCT, STORE } from "db/schema"
import { eq, sql } from "db/utils"






const getStores = async () => {

    const { userId } = auth()

    if(isNull(userId) ) return null

    let seller: SELLER | null = null

    try {

        seller = (await db.query.SELLER.findFirst({
            where: (sell, {eq}) => eq(sell.uid, userId)
        })) ?? null

    }
    catch (e)
    {
        console.log(e)
        console.log("SOMETHING WENT WRONG", e) 
        // TODO: better error handling
    }

    
    let stores: Array<tSTORE & { customers: number, products: number } > | null = null

    try {
        const result = await db.select({
            id: STORE.id,
            name: STORE.name,
            customers: sql<number>`count(distinct ${CUSTOMER.id})`.mapWith(Number),
            products: sql<number>`count(distinct ${PRODUCT.id})`.mapWith(Number),
            image: STORE.image,
            description: STORE.description
        })
        .from(STORE)
        .innerJoin(PRODUCT, eq(PRODUCT.store_id, STORE.id))
        .innerJoin(CUSTOMER, eq(CUSTOMER.store_id, STORE.id))
        .where(eq(STORE.seller_id, seller?.id))
        .groupBy(STORE.id)

        stores = result 
    }
    catch(e)
    {
        console.log("ee",e)
        console.log("Something went wrong")
        // TODO: better error handling
        
    }

    return stores
    

}


export default async function Page(){


    const data = await getStores()


    return (
        <MainDashboardPage 
            stores={data}
        />
    )

}