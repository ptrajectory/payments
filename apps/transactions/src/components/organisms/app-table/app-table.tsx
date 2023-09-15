"use client"

import { useToast } from "@/components/atoms/use-toast"
import { DataTable } from "@/components/headless/data-table"
import { ColumnDef, PaginationState } from "@tanstack/react-table"
import { useReducer } from "react"



const page_state = (state: any, action: {type: "pending" | "fullfilled" | "rejected", payload?: any})=>{

    switch(action.type){
        case "pending": {
            return {
                ...state,
                loading: true,
                rejected: false
            }
        }
        case "rejected": {
            return {
                ...state,
                loading: false,
                rejected: true
            }
        }
        case "fullfilled": {
            return {
                ...state,
                loading: false,
                rejected: false,
                data: action.payload
            }
        }
        default:
            return state
    }
}

interface AppTableProps<T = any> {
    ColumnDefinitions: Array<ColumnDef<T>>
    initialTableData: T[],
    fetchFunction: (pagination: PaginationState) => Promise<Array<T>>
}



export default function AppTable(props: AppTableProps) {
    const { ColumnDefinitions, initialTableData, fetchFunction } = props
    const [pageState, updater] = useReducer(page_state, {
        data: initialTableData
    })
    const { toast } = useToast()


    const handlePaginationChange = async (state: PaginationState) => {
        updater({
            type: "pending"
        })

        try {

            const data = await fetchFunction(state)


            updater({
                type: "fullfilled",
                payload: data
            })

        }
        catch (e)
        {
            updater({
                type: "rejected"
            })


            toast({
                title: "Oops!",
                description: "Something went wrong while fetching your data. Try refreshing the page.",
                variant: "destructive",
                duration: 3000
            })
        }

    }

    return (
        <div className="flex flex-col w-full">
            <DataTable
                data={pageState.data ?? []}
                columns={ColumnDefinitions}
                loading={pageState.loading}
                onPaginationStateChanged={handlePaginationChange}
            />
        </div>
    )

}