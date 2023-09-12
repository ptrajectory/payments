import React from 'react'
import PurchaseVolumeChart from './components/purchase-volume-chart'
import StorePaymentsTable from './components/purchases-table'

function PaymentsPage() {
  return (
    <div className="flex flex-col w-full h-full items-start justify-start p-5 pb-[200px]">

        <h1 className="text-2xl font-semibold">
            Payments
        </h1>
        <span className="text-sm">
            View and Manage payments made to your shop
        </span>

        <div className="flex flex-col w-full py-5 space-y-5">
            <PurchaseVolumeChart/>
            <StorePaymentsTable/>
        </div>
    </div>
  )
}

export default PaymentsPage