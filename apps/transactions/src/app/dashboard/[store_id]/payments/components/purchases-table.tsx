"use client"
import { DataTable } from '@/components/headless/data-table'
import CustomerPaymentColumns from '@/components/headless/data-tables/customers/payments'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { PAYMENT as tPAYMENT } from 'zodiac'
import StorePaymentColumns from './columns'
import { useParams } from 'next/navigation'
import { PaginationState } from '@tanstack/react-table'

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

export default function StorePaymentsTable() {
    const [pageState, updater] = useReducer(page_state, {
        data: []
    })

    const params = useParams()

    const fetch_payments = async (pagination?: PaginationState) => {

        updater({
            type: "pending"
        })

        try{

            const results = (await axios.get("/api/payments", {
                params: {
                    page: (pagination?.pageIndex ?? 0) + 1 ,
                    size: (pagination?.pageSize ?? 10),
                    store_id: params?.store_id
                }
            })).data

            updater({
                type: "fullfilled",
                payload: results.data
            })

        }
        catch (e)
        {
            console.log("SOmething went wrong")
            updater({
                type: "rejected"
            })
        }
        

    }


    const handlePaginationChange = useCallback((state: PaginationState) => {
        fetch_payments(state)
    }, [])  

    useEffect(()=>{
        fetch_payments()
    },[])

  return (
    <div className="flex flex-col w-full h-full space-y-5 ">

            <div className="flex flex-row w-full items-center justify-between">
                <span className="font-semibold text-xl">
                    Payments
                </span>


            </div>
            

            <div className="flex flex-col w-full h-full">


                <DataTable
                    data={pageState.data ?? []}
                    loading={pageState.loading}
                    columns={StorePaymentColumns}
                    onPaginationStateChanged={handlePaginationChange}
                />
                

            </div>

        </div>
  )
}
