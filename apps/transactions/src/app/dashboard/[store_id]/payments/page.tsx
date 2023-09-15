import React, { Suspense } from 'react'
import PurchaseTableServerWrapper from './components/purchase-table-server-wrapper'
import { SkeletonBlock } from '@/layouts/skeletons'
import PurchaseVolumeServerWrapper from './components/purchase-volume-wrapper'

interface PaymentsPageProps {
  params: {
    store_id: string
  }
}

function PaymentsPage(props: PaymentsPageProps) {

  const { store_id } = props.params
  
  return (
    <div className="flex flex-col w-full h-full items-start justify-start p-5 pb-[200px]">

        <h1 className="text-2xl font-semibold">
            Payments
        </h1>
        <span className="text-sm">
            View and Manage payments made to your shop
        </span>

        <div className="flex flex-col w-full py-5 space-y-5">
            <Suspense
              fallback={<SkeletonBlock
                className='w-full h-[60vh]'
              />}
            >
              <PurchaseVolumeServerWrapper
                store_id={store_id}
              />
            </Suspense>
            <Suspense
              fallback={<SkeletonBlock
                className='w-full h-[40vh]'
              />}
            >
              <PurchaseTableServerWrapper
                store_id={store_id}
              />
            </Suspense>
        </div>
    </div>
  )
}

export default PaymentsPage