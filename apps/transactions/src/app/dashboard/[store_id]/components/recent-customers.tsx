"use server";

import SimpleDisplayTable from "@/components/organisms/simple-display-table";
import db from "db";
import { CUSTOMER } from "db/schema";


const get_recent_customers = async (store_id: string) => {

    try {
        const store = await db.query.STORE.findFirst({
            where: (str, {eq}) => eq(str.id, store_id),
            columns: {
                environment: true 
            }
        })

        const customers = await db.query.CUSTOMER.findMany({
            where: (cus, { eq, and }) => and(eq(cus.store_id, store_id), eq(cus.environment, store?.environment)),
            limit: 5,
            orderBy: CUSTOMER.created_at,
            columns: {
                id: true,
                email: true,
                first_name: true,
                last_name: true
            }
        })

        return customers

    }
    catch (e) 
    {
        

        return []
    }

}

interface RecentCustomersProps {
    store_id: string
}

export default async function RecentCustomers(props: RecentCustomersProps){
    const { store_id } = props
    const customers = await get_recent_customers(store_id)


    return <SimpleDisplayTable
        title="Recent Customers"
        data={customers?.map((customer)=>({
            id: `${customer?.first_name} ${customer?.last_name}`,
            value: customer?.email
        }))}

        empty_message="No Customers yet!!"
    />
}