"use client"

import CustomerColumns from "@/components/headless/data-tables/customers/columns"
import ProductColumns from "@/components/headless/data-tables/products/columns"
import AppTable from "@/components/organisms/app-table/app-table"
import { PaginationState } from "@tanstack/react-table"
import axios from "axios"
import { useParams } from "next/navigation"
import { CUSTOMER, PRODUCT } from "zodiac"


interface ProductsClientTableWrapperProps {
    initialData: Array<PRODUCT>
}

export default function ProductsClientTableWrapper(props: ProductsClientTableWrapperProps){
    const { initialData } = props
    const { store_id } = useParams()

    const fetch_products = async (pagination?: PaginationState) => {
        const results = (await axios.get("/api/products", {
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
            ColumnDefinitions={ProductColumns}
            fetchFunction={fetch_products}
        />
    )

}