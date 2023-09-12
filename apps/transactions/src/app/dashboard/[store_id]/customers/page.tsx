"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { DataTable } from '@/components/headless/data-table'
import CustomerColumns from '@/components/headless/data-tables/customers/columns'
import CreateCustomer from '@/components/organisms/customer-forms/create'
import Modal from '@/components/organisms/modal'
import { fetch_table_customers } from '@/lib/server_actions'
import { PaginationState, TableState } from '@tanstack/react-table'
import { Button } from '@tremor/react'
import axios from 'axios'
import { isString, isUndefined } from 'lodash'
import { PlusIcon } from 'lucide-react'
import React, { useCallback, useEffect, useReducer } from 'react'
import CreateCustomerForm from './components/create-customer-form'

interface PageProps {
    params: Partial<{
        store_id: string
    }>
}

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



function CustomerPage(props: PageProps) {
    const [pageState, updater] = useReducer(page_state, {})
    const { params: { store_id } } = props 

    const fetch_customers = async (pagination?: PaginationState) => {

        updater({
            type: "pending"
        })

        try {
            const results = (await axios.get("/api/customers", {
                params: {
                    page: (pagination?.pageIndex ?? 0) + 1 ,
                    size: (pagination?.pageSize ?? 10),
                    store_id
                }
            })).data

            console.log("CUSTOMER RESULTS",results)

            updater({
                type: "fullfilled",
                payload: results.data
            })

        }
        catch (e) 
        {
            console.log("Something went wrong::", e)
            updater({type: "rejected"})
        }


    }

    const handlePaginationChange = useCallback((state: PaginationState) => {
        fetch_customers(state)
    }, [])   

    useEffect(()=>{
        fetch_customers()
    },[])
    

  return (
    <div className="flex flex-col w-full h-full space-y-5">
            <div className="flex flex-row w-full items-center justify-between ">
                <span className="font-semibold text-xl">
                    Customers
                </span>
                    <CreateCustomerForm
                        onClose={()=>{
                            fetch_customers()
                        }}
                    />
            </div>

            <div className="flex flex-col w-full">

                <DataTable
                    data={pageState.data ?? []}
                    columns={CustomerColumns}
                    loading={pageState.loading}
                    onPaginationStateChanged={handlePaginationChange}
                />

            </div>
            

        </div>
  )
}

export default CustomerPage