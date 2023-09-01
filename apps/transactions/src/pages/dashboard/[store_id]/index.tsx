import DashboardTopBar from '@/components/organisms/dashboard-topbar'
import { Card, DateRangePicker, DateRangePickerValue, LineChart, List, ListItem, Title } from '@tremor/react'
import { HomeIcon, ShirtIcon, UserIcon } from 'lucide-react'
import React, { useState } from 'react'
import dayjs from "dayjs"
import DashboardSideBarButton from '@/components/atoms/dashboard-sidebar-button'
import { GetServerSideProps } from 'next'
import { PageLayoutProps } from '@/lib/types'
import { useRouter } from 'next/router'
import db from "db"
import { gt, inArray, lt, sql } from 'db/utils'
import { CART, CART_ITEM, CHECKOUT, PAYMENT, PRODUCT } from 'db/schema'
import { CUSTOMER, PRODUCT as tPRODUCT, PAYMENT as tPAYMENT } from 'zodiac'
import { stringifyDatesInJSON } from '@/lib/utils'


const chart_data = [
    {
        total_purchases: 300,
        day: dayjs().day()
    },
    {
        total_purchased: 350,
        day: dayjs().subtract(1, "day").day()
    },
    {
        total_purchased: 250,
        day: dayjs().subtract(2, "day").day()
    },
    {
        total_purchased: 150,
        day: dayjs().subtract(3, "day").day()
    },
    {
        total_purchased: 30,
        day: dayjs().subtract(4, "day").day()
    },
    {
        total_purchased: 3350,
        day: dayjs().subtract(5, "day").day()
    },
    {
        total_purchased: 3540,
        day: dayjs().subtract(6, "day").day()
    },
]

function StorePage(props: {
    dashboard: DashboardPageData
}) {
  const { asPath, query, push, reload, } = useRouter()
    console.log(props.dashboard)
  const [currentDateRange, setCurrentDateRange ] = useState<DateRangePickerValue|undefined>((query.from && query.to) ? {
    from: new Date(query.from as string),
    to: new Date(query.to as string)
  }: undefined)


  console.log("the query", query)

  const handleDateRangeChange = (value: DateRangePickerValue) => {

    push(`/dashboard/${query.store_id}?from=${value.from?.toISOString()}&to=${value?.to?.toISOString()}` )

  }     

  return (
                <div className="flex flex-col w-full h-full">

                    <div className="flex flex-col w-full space-y-3 pb-3 border-b-2 border-gray-200 mb-5">
                        <h1 className="text-lg font-semibold">
                            Your Overview
                        </h1>

                        <DateRangePicker
                            onValueChange={(range)=>{
                                setCurrentDateRange(range)
                                handleDateRangeChange(range)
                            }}
                            value={currentDateRange}
                        />
                    </div>


                    <div className="flex flex-row items-start justify-between w-full border-b-2 border-gray-200 mb-5 pb-3">


                        <div className="flex flex-col w-[30%] space-y-2">
                            <span className='text-sm font-medium' >
                                Successful Payments
                            </span>

                            <List className='w-full' >
                                {
                                    props.dashboard?.successful_payments?.map((payment, i)=>{
                                        return (

                                            <ListItem key={i} >

                                                <span>
                                                    {payment.id}
                                                </span>

                                                <span>
                                                    KES {payment?.amount}
                                                </span>

                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </div>

                        <div className="flex flex-row w-[60%] ">
                        <Card>
                            <Title>
                                Daily total purchases
                            </Title>
                            <LineChart
                                data={props.dashboard.chart}
                                index='day'
                                categories={['total_purchased']}
                                colors={['amber']}
                            />
                        </Card>

                        </div>


                    </div>

                    <div className="flex flex-row items-center justify-between w-full flex-wrap gap-x-5 gapy-y-5">

                        <div className="flex flex-col w-[45%] space-y-2 rounded-md shadow-sm p-5">
                            <span className='text-sm font-medium' >
                                Failed Payments
                            </span>

                            <List className='w-full' >
                                {
                                    props.dashboard.failed_payments?.map((payment, i)=>{
                                        return (
                                            <ListItem key={i} >

                                                <span>
                                                    {payment?.id}
                                                </span>

                                                <span>
                                                    KES {payment?.amount}
                                                </span>

                                            </ListItem>

                                        )
                                    })
                                }
                            </List>
                        </div>

                        <div className="flex flex-col w-[45%] space-y-2 rounded-md shadow-sm p-5">
                            <span className='text-sm font-medium' >
                                Most Purchased Products
                            </span>

                            <List className='w-full' >
                                {
                                    props.dashboard.products?.map((product, i)=>{
                                        return (
                                        <ListItem key={i} >

                                            <span>
                                                {product?.name}
                                            </span>

                                            <span>
                                                KES {product?.price}
                                            </span>

                                        </ListItem>

                                        )
                                    })
                                }
                            </List>
                        </div>


                        <div className="flex flex-col w-[45%] space-y-2 rounded-md shadow-sm p-5">
                            <span className='text-sm font-medium' >
                                New Customers
                            </span>

                            <List className='w-full' >
                                {
                                    props.dashboard.customers?.map((customer, i)=>{
                                        return (
                                            <ListItem  key={i}> 

                                                <span>
                                                    {customer?.id}
                                                </span>

                                                <span>
                                                    {customer?.first_name} {customer?.last_name}
                                                </span>

                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </div>

                    </div>

                    

                </div>



      
  )
}

export default StorePage

const most_purchased_products = (from: string, to: string) => sql`
    select p.id, p.name, p.description, p.image, COUNT(*) as purchase_count
    from ${PRODUCT} p
    JOIN ${CART_ITEM} crt_itm on crt_itm.product_id = p.id
    JOIN ${CART} crt on crt.id = crt_itm.cart_id
    JOIN ${CHECKOUT} chk on chk.cart_id = crt.id
    JOIN ${PAYMENT} pa on pa.checkout_id = chk.id
    where pa.status = 'SUCCESS'
    and 
    pa.created_at > ${from}
    and 
    pa.created_at < ${to}
    GROUP BY p.id
    ORDER BY purchase_count DESC 
`


const getAllDaysBetweenDates = (from: Date | string, to: Date | string) => {

    try {
        console.log("FROM::", from)
        console.log("TO", to)
    
    
        let is_same_date = dayjs(from).isSame(to, "date")
    
        console.log("IS SAME DATE", is_same_date)
    
        if(is_same_date) {
    
            const sd = new Date()
            const day_start = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0, 0)
    
            console.log(day_start)
            const val = [
                ...Array(24).fill(0)
            ]?.map((_, i)=>{
                return dayjs(day_start).add(i, "hour").toISOString()
            })
    
            console.log("Same day values", val)

            return {
                is_same_date,
                val
            }
            
        }
    
        const days_between = dayjs(to).diff(from, "day")
    
        console.log(days_between)
    
        const val =  [
            ...Array(days_between).fill(0)
        ]?.map((_, i)=>{
            return dayjs(from).add(i, "day").toISOString()
        })

        
    
        return {
            is_same_date,
            val
        }

    }
    catch (e) {
        console.log("Something went wrong::", e)
        return {
            is_same_date: false,
            val: []
        }
    }



}


interface DashboardPageData {
    successful_payments: Array<tPAYMENT>
    failed_payments: Array<tPAYMENT>
    customers: Array<CUSTOMER>
    products: Array<tPRODUCT>
    chart: Array<{
        total_purchased?: number
        day?: number
    }>
}

export const getServerSideProps: GetServerSideProps<PageLayoutProps & {
    dashboard: Partial<DashboardPageData>
}> = async (context) => {
    const sd = new Date()
    const day_start = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(), 0, 0, 0, 0)
    const day_end = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate(),23, 59, 49, 999)
    let { from = day_start, to = day_end, store_id } = context.query as  {
        from?: string
        to?: string
        store_id: string
    }

    console.log("__store_id::", store_id)

    const dates_between = getAllDaysBetweenDates(from, to)

    const todays_successful_payments = await db.query.PAYMENT?.findMany({
        where: (payments, {and, eq }) => and(
            gt(payments.created_at, new Date(from)),
            lt(payments.created_at, new Date(to)),
            eq(payments.store_id, store_id),
            eq(payments.status, "SUCCESS")
        ),
        limit: 5
    })

    const todays_failed_payments = await db.query.PAYMENT?.findMany({
        where: (payments, {and, eq }) => and(
            gt(payments.created_at, new Date(from)),
            lt(payments.created_at, new Date(to)),
            eq(payments.store_id, store_id),
            inArray(payments.status, ["FAILED", "PROCESSING"])
        ),
        limit: 5
    })

    const todays_new_customers = await db.query.CUSTOMER.findMany({
        where: (customers, {eq, and}) => and(eq(
            customers.store_id, store_id
        )),
        limit: 5
    })


    const most_purchased_products_result = await db.execute(most_purchased_products(new Date(from).toISOString(), new Date(to).toISOString()))


    console.log("HERE IS THE STORE ID", store_id)
    
    let total_purchases_for_range = await db.query.PAYMENT?.findMany({
        where: (payments, { and, eq }) => and(
            eq(payments.store_id, store_id),
            gt(payments?.created_at, from),
            lt(payments?.created_at, to)
        )
    })

    const ready_for_graph = dates_between?.val?.map((date, i)=>{

        const correct_values = total_purchases_for_range?.reduce((prev, cur)=>{

            if(dates_between?.is_same_date){

                if(new Date(cur?.created_at).getHours() === new Date(date)?.getHours()) return prev + (cur?.amount ?? 0)

                return prev
            }

            const current = new Date(cur?.created_at)
            const this_date = new Date(date)

            if(current?.getDate() === this_date?.getDate() && current?.getMonth() === this_date?.getMonth() && current?.getFullYear() === this_date.getFullYear()) return prev + (cur?.amount ?? 0)

            return prev + 0

        }, 0)

        return {
            total_purchased: correct_values,
            day: dayjs(date).format(
                dates_between?.is_same_date ? "hh A" :"MMM D"
            )
        }

    })





    console.log("MOST PURCHASED PRODUCTS::", most_purchased_products_result)


    return {
        props: {
            layout: "dashboard",
            dashboard: {
                chart: stringifyDatesInJSON(ready_for_graph),
                customers: stringifyDatesInJSON(todays_new_customers),
                successful_payments: stringifyDatesInJSON(todays_successful_payments),
                failed_payments: stringifyDatesInJSON(todays_failed_payments),
                products: stringifyDatesInJSON(most_purchased_products_result)
            },
            skeleton: "dashboard-store-home"
        }
    }
}