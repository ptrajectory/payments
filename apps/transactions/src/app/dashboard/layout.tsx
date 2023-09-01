/* eslint-disable react-hooks/exhaustive-deps */
import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import DashboardTopBar from '@/components/organisms/dashboard-topbar'
import { CustomerPageSkeleton, HomeSkeleton, ProductPageSkeleton, TablePageSkeleton } from '@/layouts/skeletons'
import { PageLayoutProps, tSkeleton } from '@/lib/types'
import { route_matches } from '@/lib/utils'
import { isEmpty, isString, isUndefined } from 'lodash'
import { HomeIcon, Loader, ShirtIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/router'
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



            {/* sidebar */}
            {/* {!pageProps.hide_sidebar && <div className="flex flex-col w-[200px] pt-[100px] relative">
                <aside className="flex flex-col justify-start w-max fixed space-y-3">

                    <DashboardSideBarButton
                        path={`/dashboard/${query.store_id}`}
                        icon={HomeIcon}
                        loading={loading}
                    >
                        Home
                    </DashboardSideBarButton>

                    <DashboardSideBarButton
                       path={`/dashboard/${query.store_id}/customers`}
                        icon={UserIcon}
                        loading={loading}
                    >
                        Customers
                    </DashboardSideBarButton>

                    <DashboardSideBarButton
                        path={`/dashboard/${query.store_id}/products`}
                        icon={ShirtIcon}
                        loading={loading}
                    >
                        Products
                    </DashboardSideBarButton>

                </aside>

            </div>} */}



            {/* main content */}

            <main className="flex flex-col w-full">



                {
                  children
                }
              



            </main>


    </div>
  )
}

export default DashboardLayout