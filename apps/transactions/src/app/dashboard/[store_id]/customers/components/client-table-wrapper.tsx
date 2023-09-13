"use client"

import CustomerColumns from "@/components/headless/data-tables/customers/columns"
import AppTable from "@/components/organisms/app-table/app-table"
import { PaginationState } from "@tanstack/react-table"
import axios from "axios"
import { useParams } from "next/navigation"
import { CUSTOMER } from "zodiac"


interface CustomerClientTableWrapperProps {
    initialData: Array<CUSTOMER>
}

export default function CustomerClientTableWrapper(props: CustomerClientTableWrapperProps){
    const { initialData } = props
    const { store_id } = useParams()

    const fetch_customers = async (pagination?: PaginationState) => {
        const results = (await axios.get("/api/customers", {
            params: {
                page: (pagination?.pageIndex ?? 0) + 1 ,
                size: (pagination?.pageSize ?? 10),
                store_id
            }
        })).data

        return results?.data
    }


    return (
        <AppTable
            initialTableData={initialData}
            ColumnDefinitions={CustomerColumns}
            fetchFunction={fetch_customers}
        />
    )

}