/* eslint-disable react-hooks/exhaustive-deps */
import DashboardTopBar from '@/components/organisms/dashboard-topbar'
import React, { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode,
  params: {
    store_id?: string
    customer_id?: string
    product_id?: string
  }
}

function DashboardLayout(props: DashboardLayoutProps) {
  const { children, params } = props 


  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start space-y-4">
            <DashboardTopBar
                {...params}
            /> 

            <main className="flex flex-col w-full">



                {
                  children
                }
              



            </main>


    </div>
  )
}

export default DashboardLayout