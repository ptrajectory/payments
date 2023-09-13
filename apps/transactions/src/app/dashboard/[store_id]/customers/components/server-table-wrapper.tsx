"use server"

import { stringifyDatesInJSON } from "@/lib/utils"
import db from "db"
import { CUSTOMER } from "db/schema"
import CustomerClientTableWrapper from "./client-table-wrapper"


async function getStoreCustomerData(store_id: string) {

    try {
        const customers = (await db.query.CUSTOMER.findMany({
            where: (cus, { eq, and }) => and(
                eq(cus.store_id, store_id),
            ),
            orderBy: CUSTOMER.created_at,
            columns: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                created_at: true
            },
            limit: 11,
            offset: 0
        })) ?? []

        return stringifyDatesInJSON(customers)

    } catch (e)
    {
        return []
    }
    
}

export default async function CustomerServerTableWrapper(props: { store_id: string }) {

    const { store_id } = props 

    const data = await getStoreCustomerData(store_id)


    return (
        <CustomerClientTableWrapper
            key={data?.length ?? 0}
            initialData={data}
        />
    )

}