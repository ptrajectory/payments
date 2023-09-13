"use client"
import { DataTable } from '@/components/headless/data-table'
import CustomerPaymentColumns from '@/components/headless/data-tables/customers/payments'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { PAYMENT, PAYMENT as tPAYMENT } from 'zodiac'
import StorePaymentColumns from './columns'
import { useParams } from 'next/navigation'
import { PaginationState } from '@tanstack/react-table'
import AppTable from '@/components/organisms/app-table/app-table'

export default function StorePaymentsTable(props: { initialData: Array<PAYMENT> }) {
    const { initialData } = props
    const params = useParams()

    const fetch_payments = async (pagination?: PaginationState) => {
            const results = (await axios.get("/api/payments", {
                params: {
                    page: (pagination?.pageIndex ?? 0) + 1 ,
                    size: (pagination?.pageSize ?? 10),
                    store_id: params?.store_id
                }
            })).data

            return results?.data
    }


    

  return (
    <div className="flex flex-col w-full h-full space-y-5 ">

            <div className="flex flex-row w-full items-center justify-between">
                <span className="font-semibold text-xl">
                    Payments
                </span>


            </div>
            

            <div className="flex flex-col w-full h-full">


                <AppTable
                    ColumnDefinitions={StorePaymentColumns}
                    fetchFunction={fetch_payments}
                    initialTableData={initialData}
                />
                

            </div>

        </div>
  )
}
