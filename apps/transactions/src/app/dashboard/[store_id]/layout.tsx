import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import { LayoutProps } from '@/lib/types'
import { HomeIcon, ShirtIcon, UserIcon } from 'lucide-react'
import React from 'react'
import SideBar from '../../../components/organisms/dashboard-topbar/side'



function Layout(props: LayoutProps<{
    store_id?: string
    customer_id?: string
    product_id?: string
}>) {

  const { params: {store_id, customer_id, product_id} ,children } = props 
  return (
    <div className="flex flex-row justify-start w-full px-5 py-5 gap-x-10">
        <div className="flex flex-col w-[200px] pt-[100px] relative">
            <SideBar store_id={store_id ?? ""} />
        </div>
        {
            children
        }
    </div>
  )
}

export default Layout