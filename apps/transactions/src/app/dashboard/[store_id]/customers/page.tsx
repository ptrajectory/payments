"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { DataTable } from '@/components/headless/data-table'
import CustomerColumns from '@/components/headless/data-tables/customers/columns'
import CreateCustomer from '@/components/organisms/customer-forms/create'
import { fetch_table_customers } from '@/lib/server_actions'
import { PaginationState } from '@tanstack/react-table'
import { Button } from '@tremor/react'
import { isString, isUndefined } from 'lodash'
import { PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { CUSTOMER } from 'zodiac'

interface PageProps {
    params: Partial<{
        store_id: string
    }>
}

function CustomerPage(props: PageProps) {
    const [customers, setCustomers ] = useState<Array<CUSTOMER>>([])
    const { params: { store_id } } = props
    const [loading, setLoading] = useState<boolean>(false)

    const handlePaginationChange = async (pagination?: PaginationState) => {
        if(!isString(store_id)) return 
        const pag: PaginationState = isUndefined(pagination) ? {
            pageIndex: 0,
            pageSize: 10
        } : pagination

        setLoading(true)
        const new_customers = await fetch_table_customers(pag, store_id)
        setCustomers(new_customers)
        setLoading(false)

    }


    useEffect(()=>{
        handlePaginationChange()
    },[])

  return (
    <div className="flex flex-col w-full h-full space-y-5">
            <div className="flex flex-row w-full items-center justify-between ">
                <span className="font-semibold text-xl">
                    Customers
                </span>
                <Dialog modal onOpenChange={(open)=>{
                    
                }} >
                    <DialogTrigger asChild>
                        <Button
                            size="xs"
                            icon={()=> <PlusIcon
                                size="16px"
                            />}
                        >
                            Create Customers
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Create Customer
                            </DialogTitle>
                        </DialogHeader>
                        <CreateCustomer/>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col w-full">

                <DataTable
                    data={customers}
                    columns={CustomerColumns}
                    onPaginationStateChanged={handlePaginationChange}
                    loading={loading}
                />

            </div>
            

        </div>
  )
}

export default CustomerPage