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
                inArray(pms.status, ["FAILED"])
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

interface FailedPaymentsProps {
    store_id: string
}

export default async function FailedPayments(props: FailedPaymentsProps){
    const { store_id } = props 
    const payments = await get_payments(store_id)
    return (
        <SimpleDisplayTable
            title="Failed Payments"
            data={payments?.map((payment)=>({
                id: payment.id,
                value: `${payment.currency} ${payment.amount}`
            }))}
            empty_message="No Failed Payments Yet!"
        />
    )
}