/* eslint-disable react-hooks/exhaustive-deps */
import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import DashboardTopBar from '@/components/organisms/dashboard-topbar'
import { PageLayoutProps, tSkeleton } from '@/lib/types'
import { route_matches } from '@/lib/utils'
import { isEmpty, isString, isUndefined } from 'lodash'
import { HomeIcon, Loader, ShirtIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useState } from 'react'
import { CustomerPageSkeleton, HomeSkeleton, ProductPageSkeleton, TablePageSkeleton } from './skeletons'

type DashboardLayoutProps = {
  children: ReactNode,
  pageProps: PageLayoutProps
}

function DashboardLayout(props: DashboardLayoutProps) {
  const [current_skeleton, set_current_skeleton] = useState<tSkeleton|"none">("none")
  const [loading, setLoading] = useState(false)
  const { children, pageProps } = props 

  const { events, query } = useRouter()
  const { store_id, customer_id, product_id } = query

  const handleChangeStart = (url: string) => {

    const skeleton = ((): tSkeleton | "none"=>{
      console.log("The customer id::", customer_id)
      if(!isString(store_id)) return "none"
      if(route_matches(url, store_id, `/dashboard/${store_id}`)) return "dashboard-store-home"
      if(route_matches(url, store_id, `/dashboard/${store_id}/customers`) && url?.includes("cus_")) return "dashboard-store-customers-customer"
      if(route_matches(url, store_id, `/dashboard/${store_id}/customers`)) return "dashboard-store-customers"
      if(route_matches(url, store_id, `/dashboard/${store_id}/products`) && url?.includes("pro_")) return "dashboard-store-products-product"
      if(route_matches(url, store_id, `/dashboard/${store_id}/products`)) return "dashboard-store-products"
      return "none"
    })()

    set_current_skeleton(skeleton)
    setLoading(true)
  }
  const handleChangeComplete = () => setLoading(false)
  const handleChangeError = () => setLoading(false)
  useEffect(()=>{


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

            </div>}



            {/* main content */}

            <main className="flex flex-col w-full">



                {
                  (loading) ? (
                    <>
                      {
                       current_skeleton == "none" ? (
                          <div className="flex flex-row w-full h-full items-center justify-center">
                            <Loader
                              className='animate-spin'
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full">
                            {
                              current_skeleton === "dashboard-store-home" && <HomeSkeleton/>
                            }
                            {
                              current_skeleton === "dashboard-store-customers" && <TablePageSkeleton/>
                            }
                            {
                              current_skeleton === "dashboard-store-products" && <TablePageSkeleton/>
                            }
                            {
                              current_skeleton === "dashboard-store-customers-customer" && <CustomerPageSkeleton/>
                            }
                            {
                              current_skeleton === "dashboard-store-products-product" && <ProductPageSkeleton/>
                            }
                          </div>
                        )
                      }
                    </>
                  ) :
                  children
                }
              



            </main>


        </div>
    </div>
  )
}

export default DashboardLayout