import React, { Suspense } from 'react'
import dayjs from "dayjs"
import db from "db"
import { and, eq, gt, inArray, lt, sql } from 'db/utils'
import { CART, CART_ITEM, CHECKOUT, CUSTOMER, PAYMENT, PRODUCT } from 'db/schema'
import { stringifyDatesInJSON } from '@/lib/utils'
import { List, ListItem } from '@tremor/react'
import { PAYMENT as tPAYMENT, CUSTOMER as tCUSTOMER, PRODUCT as tPRODUCT } from 'zodiac'
import HomeDailyPurchases from '@/components/organisms/charts/home-daily-purchases'
import SuccessfulPayments from './components/successful-payments'
import FailedPayments from './components/failed-payments'
import MostPurchasedProducts from './components/most-purchased-products'
import RecentCustomers from './components/recent-customers'
import { SkeletonBlock } from '@/layouts/skeletons'
// import HomeDailyPurchases from '@/components/organisms/charts/home-daily-purchases'




async function StorePage(props: {params: {store_id: string}}) {
    const {  params: { store_id } } = props



  return (
                <div className="flex flex-col w-full h-full">

                    <div className="flex flex-col w-full space-y-3 pb-3 border-b-2 border-gray-200 mb-5">
                        <h1 className="text-lg font-semibold">
                            Your Overview
                        </h1>
                    </div>


                    <div className="flex flex-row items-start justify-between w-full border-b-2 border-gray-200 mb-5 pb-3">


                        <div className="flex flex-col w-[30%] space-y-2 h-full">
                            <Suspense fallback={<SkeletonBlock className='w-full h-full' />} >
                                <SuccessfulPayments
                                    store_id={store_id ?? ""}
                                />
                            </Suspense>
                        </div>

                        <div className="flex flex-row w-[60%] ">
                            <HomeDailyPurchases/>
                        </div>


                    </div>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-5 w-full h-full">

                        <div className="flex flex-col w-full space-y-2 rounded-md shadow-sm p-5">
                            <Suspense fallback={<SkeletonBlock className='w-full h-full' />} >
                                <FailedPayments
                                    store_id={store_id ?? ""}
                                />
                            </Suspense>
                        </div>

                        <div className="flex flex-col w-full space-y-2 rounded-md shadow-sm p-5">
                            <Suspense fallback={<SkeletonBlock className='w-full h-full' />} >
                                <MostPurchasedProducts
                                    store_id={store_id}
                                />
                            </Suspense>
                        </div>


                        <div className="flex flex-col w-full space-y-2 rounded-md shadow-sm p-5">
                            <Suspense fallback={<SkeletonBlock className='w-full h-full' />} >
                                <RecentCustomers
                                    store_id={store_id}
                                />
                            </Suspense>
                        </div>

                    </div>

                    

                </div>
      
  )
}

export default StorePage