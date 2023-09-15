"use server"

import db from "db"
import { PAYMENT, STORE } from "db/schema"
import StorePaymentsTable from "./purchases-table"
import { and, eq, ne } from "db/utils"



async function getPurchaseTableData(store_id: string){

    try {

        const payments = await db.select({
            id: PAYMENT.id,
            status: PAYMENT.status,
            created_at: PAYMENT.created_at,
            amount: PAYMENT.amount
        }).from(PAYMENT)
        .innerJoin(STORE, eq(STORE.id, PAYMENT.store_id))
        .where(and(
            eq(STORE.id, store_id),
            eq(PAYMENT.environment, STORE.environment),
            ne(PAYMENT.status, "PROCESSING")
        ))
        .limit(10)
        .offset(0)
        

        return payments ?? []
    }
    catch (e)
    {
        // TODO: deal with this error later
        return []
    }

}


export default async function PurchaseTableServerWrapper(props: {store_id: string}){
    const { store_id } = props
    const data = await getPurchaseTableData(store_id)


    return <StorePaymentsTable
        initialData={data}
    />

}