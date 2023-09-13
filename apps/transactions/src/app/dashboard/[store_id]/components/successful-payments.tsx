"use server"

import SimpleDisplayTable from "@/components/organisms/simple-display-table"
import db from "db"
import { PAYMENT } from "db/schema"
import { inArray } from "db/utils"


const get_payments = async (store_id: string) => {

    try {   

        const payments = await db.query.PAYMENT.findMany({
            where: (pms, { eq, and }) => and(
                eq(pms.store_id, store_id),
                eq(pms.status, "SUCCESS")
            ),
            orderBy: PAYMENT.created_at,
            limit: 5,
            columns: {
                id: true,
                amount: true,
                currency: true
            }
        })

        return payments

    }
    catch (e)
    {
        console.log("SOMETHING WENT WRONG::",e)

        return []
    }

}

interface SuccessfulPaymentsProps {
    store_id: string
}

export default async function SuccessfulPayments(props: SuccessfulPaymentsProps){
    const { store_id } = props 
    const payments = await get_payments(store_id)
    return (
        <SimpleDisplayTable
            title="Successful Payments"
            data={payments?.map((payment)=>({
                id: `${payment.id?.slice(0,10)}...`,
                value: `${payment.currency ?? "KES"} ${payment.amount}`
            }))}
            empty_message="No Successful Payments Yet!"
        />
    )
}