"use client"
import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import { HomeIcon, ShirtIcon, UserIcon } from 'lucide-react'
import React from 'react'

interface SideBarProps {
    store_id: string
}

function SideBar(props: SideBarProps) {
    const {store_id} = props
  return (
    <aside className="flex flex-col justify-start w-max fixed space-y-3">
        <DashboardSideBarButton
            path={`/dashboard/${store_id}`}
            icon={HomeIcon}
        >
            Home
        </DashboardSideBarButton>
        <DashboardSideBarButton
           path={`/dashboard/${store_id}/customers`}
            icon={UserIcon}
        >
            Customers
        </DashboardSideBarButton>
        <DashboardSideBarButton
            path={`/dashboard/${store_id}/products`}
            icon={ShirtIcon}
        >
            Products
        </DashboardSideBarButton>
    </aside>
  )
}

export default SideBar