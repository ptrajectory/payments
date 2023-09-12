"use client"
import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import { CogIcon, CreditCardIcon, HomeIcon, KeySquare, ShirtIcon, UserIcon } from 'lucide-react'
import React from 'react'

interface SideBarProps {
    store_id: string
}

function SideBar(props: SideBarProps) {
    const {store_id} = props
  return (
    <aside className="flex flex-col justify-start w-max fixed space-y-5">
        <div className="flex flex-col w-full space-y-2">
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
            <DashboardSideBarButton
                path={`/dashboard/${store_id}/payments`}
                icon={CreditCardIcon}
            >
                Payments
            </DashboardSideBarButton>

        </div>

        <div className="flex flex-col items-start justify-start space-y-3">
            <span
                className='text-xs text-slate-400 uppercase'
            >
                Developers
            </span>

            <DashboardSideBarButton
                path={`/dashboard/${store_id}/credentials`}
                icon={KeySquare}
            >
                API Keys
            </DashboardSideBarButton>
        </div>

        <div className="flex flex-col items-start justify-start space-y-3">
            <span
                className='text-xs text-slate-400 uppercase'
            >
                Application
            </span>

            <DashboardSideBarButton
                path={`/dashboard/${store_id}/settings`}
                icon={CogIcon}
            >
               Settings
            </DashboardSideBarButton>
        </div>

    </aside>
  )
}

export default SideBar