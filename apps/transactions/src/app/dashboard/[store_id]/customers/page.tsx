import React, { Suspense } from 'react'
import CreateCustomerForm from './components/create-customer-form'
import CustomerServerTableWrapper from './components/server-table-wrapper'
import { SkeletonBlock } from '@/layouts/skeletons'

interface PageProps {
    params: Partial<{
        store_id: string
    }>
}



function CustomerPage(props: PageProps) {
    const { params: { store_id } } = props 
    
  return (
    <div className="flex flex-col w-full h-full space-y-5 pb-[200px]">
            <div className="flex flex-row w-full items-center justify-between ">
                <span className="font-semibold text-xl">
                    Customers
                </span>
                    <CreateCustomerForm />
            </div>

            <Suspense 
                fallback={<SkeletonBlock className='w-full h-[40vh]' />}
            >
                <CustomerServerTableWrapper store_id={store_id ?? ""} />
            </Suspense>
            

        </div>
  )
}

export default CustomerPage