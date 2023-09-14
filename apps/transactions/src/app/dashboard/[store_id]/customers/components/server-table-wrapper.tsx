"use server"

import { stringifyDatesInJSON } from "@/lib/utils"
import db from "db"
import { CUSTOMER, STORE } from "db/schema"
import CustomerClientTableWrapper from "./client-table-wrapper"
import { and, eq } from "db/utils"


async function getStoreCustomerData(store_id: string) {

    try {
        const customers = await db.select({
            id: CUSTOMER.id,
            first_name: CUSTOMER.first_name,
            last_name: CUSTOMER.last_name,
            email: CUSTOMER.email,
            created_at: CUSTOMER.created_at
        }).from(CUSTOMER)
        .innerJoin(STORE, eq(STORE.id, CUSTOMER.store_id))
        .where(and(eq(STORE.id, store_id), eq(STORE.environment, CUSTOMER.environment)))
        .orderBy(CUSTOMER.created_at)
        .limit(10)
        .offset(0)

        return stringifyDatesInJSON(customers ?? [])

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