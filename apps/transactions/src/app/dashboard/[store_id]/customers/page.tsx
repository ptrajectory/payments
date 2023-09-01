"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { DataTable } from '@/components/headless/data-table'
import CustomerColumns from '@/components/headless/data-tables/customers/columns'
import CreateCustomer from '@/components/organisms/customer-forms/create'
import { Button } from '@tremor/react'
import { PlusIcon } from 'lucide-react'
import React from 'react'

function CustomerPage() {
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
                    data={[]}
                    columns={CustomerColumns}
                    
                />

            </div>
            

        </div>
  )
}

export default CustomerPage