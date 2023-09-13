"use server"

import db from "db"
import { PAYMENT } from "db/schema"
import StorePaymentsTable from "./purchases-table"



async function getPurchaseTableData(store_id: string){

    try {
        const payments = (await db.query.PAYMENT.findMany({
            where: (pm, {eq}) => eq(pm.store_id, store_id),
            columns: {
                id: true,
                status: true,
                created_at: true,
                amount: true
            },
            with: {
                payment_method: true,
                customer: true,
                checkout: true
            },
            orderBy: PAYMENT.created_at,
            limit: 11,
            offset: 0
        })) ?? []

        return payments
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