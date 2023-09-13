"use server"

import { stringifyDatesInJSON } from "@/lib/utils"
import db from "db"
import { CUSTOMER } from "db/schema"
import ProductsClientTableWrapper from "./client-table-wrapper"


async function getStoreProductsData(store_id: string) {

    try {
        const products = (await db.query.PRODUCT.findMany({
            where: (prod, { eq, and }) => and(
                eq(prod.store_id, store_id),
            ),
            orderBy: CUSTOMER.created_at,
            columns: {
                id: true,
                name: true,
                price: true,
                image: true,
                created_at: true
            },
            limit: 11,
            offset: 0
        })) ?? []

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