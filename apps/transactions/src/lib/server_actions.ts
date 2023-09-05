"use server"
import { PaginationState } from "@tanstack/react-table"
import db from "db"
import { CUSTOMER as tCUSTOMER } from "zodiac"

export const fetch_table_customers = async (paginationState: PaginationState, store_id: string) => {
    "use server"

    try {

        const customers = (await db.query.CUSTOMER.findMany({
            where: (cus, { eq }) => eq(cus.store_id, store_id),
            columns: {
                id: true,
                store_id: true,
                first_name: true,
                last_name: true,
                email: true
            }
        })) ?? null

        return customers as Array<tCUSTOMER>
    }
    catch (e)
    {
        //TODO: handle error
        console.log("SOMETHING WENT WRONG::", e)
        return []
    }

}