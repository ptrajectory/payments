"use server"

import { stringifyDatesInJSON } from "@/lib/utils"
import db from "db"
import { CUSTOMER, PRODUCT, STORE } from "db/schema"
import ProductsClientTableWrapper from "./client-table-wrapper"
import { and, eq } from "db/utils"


async function getStoreProductsData(store_id: string) {

    try {

        const products = (await db.select({
            id: PRODUCT.id,
            name: PRODUCT.name,
            price: PRODUCT.price,
            image: PRODUCT.image,
            created_at: PRODUCT.created_at
        }).from(PRODUCT)
        .innerJoin(STORE, eq(STORE.id, PRODUCT.store_id))
        .where(and(eq(STORE.id, store_id), eq(STORE.environment, PRODUCT.environment)))
        .orderBy(PRODUCT.created_at)
        .limit(10)
        .offset(0)) ?? []

        return stringifyDatesInJSON(products)

    } catch (e)
    {
        return []
    }
    
}

export default async function ProductsServerTableWrapper(props: { store_id: string }) {

    const { store_id } = props 

    const data = await getStoreProductsData(store_id)


    return (
        <ProductsClientTableWrapper
            key={data?.length  ?? 0}
            initialData={data}
        />
    )

}