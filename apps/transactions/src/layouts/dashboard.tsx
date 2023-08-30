/* eslint-disable react-hooks/exhaustive-deps */
import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import DashboardTopBar from '@/components/organisms/dashboard-topbar'
import { PageLayoutProps } from '@/lib/types'
import { HomeIcon, Loader, ShirtIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'

type DashboardLayoutProps = {
  children: ReactNode,
  pageProps: PageLayoutProps
}

function DashboardLayout(props: DashboardLayoutProps) {
  const [loading, setLoading] = useState(false)
  const { children, pageProps } = props 

  const { events, query } = useRouter()

  useEffect(()=>{

    const handleChangeStart = () => setLoading(true)
    const handleChangeComplete = () => setLoading(false)
    const handleChangeError = () => setLoading(false)

    events.on("routeChangeStart", handleChangeStart)
    events.on("routeChangeComplete", handleChangeComplete)
    events.on("routeChangeError", handleChangeError)

  }, [])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start space-y-4">
            <DashboardTopBar/> 


        <div className="flex flex-row justify-start w-full px-5 py-5 gap-x-10">


            {/* sidebar */}
            {!pageProps.hide_sidebar && <div className="flex flex-col w-[200px] pt-[100px] relative">
                <aside className="flex flex-col justify-start w-max fixed space-y-3">

                    <DashboardSideBarButton
                        path={`/dashboard/${query.store_id}`}
                        icon={HomeIcon}
                    >
                        Home
                    </DashboardSideBarButton>

                    <DashboardSideBarButton
                       path={`/dashboard/${query.store_id}/customers`}
                        icon={UserIcon}
                    >
                        Customers
                    </DashboardSideBarButton>

                    <DashboardSideBarButton
                        path={`/dashboard/${query.store_id}/products`}
                        icon={ShirtIcon}
                    >
                        Products
                    </DashboardSideBarButton>

                </aside>

            </div>}



            {/* main content */}

            <main className="flex flex-col w-full">



                {
                  loading ? (
                    <div className="flex flex-row w-full h-full items-center justify-center">
                      <Loader
                        className='animate-spin'
                      />
                    </div>
                  ) :
                  children
                }
              



            </main>


        </div>
    </div>
  )
}

export default DashboardLayout