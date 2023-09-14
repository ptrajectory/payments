/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { DataTable } from '@/components/headless/data-table'
import ProductColumns from '@/components/headless/data-tables/products/columns'
import ProductForm from '@/components/organisms/product-forms/create'
import { PaginationState } from '@tanstack/react-table'
import { Button } from '@tremor/react'
import axios from 'axios'
import { PlusIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useReducer } from 'react'
import { PRODUCT } from 'zodiac'
import CreateProductForm from './components/create-product-form'

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

interface Props {
    products: Array<PRODUCT>
}


function ProductsTable(props: Props) {
    const { products } = props

    const [pageState, updater] = useReducer(page_state, {
        data: products ?? []
    })

    const params = useParams()

    const fetch_products = async (pagination?: PaginationState) => {

        updater({
            type: "pending"
        })

        try{

            const results = (await axios.get("/api/products", {
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
        fetch_products(state)
    }, [])  

    useEffect(()=>{
        fetch_products()
    },[])


  return (
    <div className="flex flex-col w-full h-full space-y-5 pb-[200px]">

            <div className="flex flex-row w-full items-center justify-between">
                <span className="font-semibold text-xl">
                    Products
                </span>

               <CreateProductForm/>

            </div>
            

            <div className="flex flex-col w-full h-full">


                <DataTable
                    data={pageState.data ?? []}
                    loading={pageState.loading}
                    columns={ProductColumns}
                    onPaginationStateChanged={handlePaginationChange}
                />
                

            </div>

        </div>
  )
}

export default ProductsTable