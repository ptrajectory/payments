"use server"

import SimpleDisplayTable from "@/components/organisms/simple-display-table"
import db from "db"
import { CART, CART_ITEM, CHECKOUT, PAYMENT, PRODUCT } from "db/schema"
import { eq, sql } from "db/utils"


const get_most_purchased_products = async (store_id: string) => {

    try {
        const most_purchased = await db.select({
            id: PRODUCT.id,
            name: PRODUCT.name,
            total_payments: sql<number>`count(distinct ${PAYMENT.id})`.mapWith(Number)
        }).from(PRODUCT)
        .innerJoin(CART_ITEM, eq(CART_ITEM.product_id, PRODUCT.id))
        .innerJoin(CART,eq(CART.id, CART_ITEM.cart_id))
        .innerJoin(CHECKOUT,eq(CHECKOUT.cart_id, CART.id))
        .innerJoin(PAYMENT,eq(PAYMENT.checkout_id, CHECKOUT.id))
        .where(eq(PRODUCT.store_id, store_id))
        .groupBy(PRODUCT.id)
        .orderBy((aliases)=>aliases.total_payments)

        return most_purchased ?? []
    }
    catch (e)
    {
        console.log("SOMETHING WENT WRONG::", e)

        return []
    }

}

interface MostPurchasedProductsProps {
    store_id: string
}

export default async function MostPurchasedProducts(props: MostPurchasedProductsProps){
    const { store_id } = props
    const most_purchased = await get_most_purchased_products(store_id)

    return (
        <SimpleDisplayTable
            title="Most Purchased Products"
            data={most_purchased?.map((data)=>({
                id: data?.name,
                value: `${data?.total_payments} `
            }))}

            empty_message="No Products to Show here!!"
        />
    )
}