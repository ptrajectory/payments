import React from 'react'
import dayjs from "dayjs"
import db from "db"
import { and, eq, gt, inArray, lt, sql } from 'db/utils'
import { CART, CART_ITEM, CHECKOUT, CUSTOMER, PAYMENT, PRODUCT } from 'db/schema'
import { stringifyDatesInJSON } from '@/lib/utils'
import { List, ListItem } from '@tremor/react'
import { PAYMENT as tPAYMENT, CUSTOMER as tCUSTOMER, PRODUCT as tPRODUCT } from 'zodiac'
import HomeDailyPurchases from '@/components/organisms/charts/home-daily-purchases'
// import HomeDailyPurchases from '@/components/organisms/charts/home-daily-purchases'


const get_most_purchased_products = async (store_id: string) => {

    try {
        const most_purchased = await db.select({
            id: PRODUCT.id,
            name: PRODUCT.name,
            total_payments: sql<number>`count(distinct ${PAYMENT.id})`.mapWith(Number)
        }).from(PRODUCT)
        .innerJoin(CART_ITEM, eq(CART_ITEM.product_id, PRODUCT.id))
        .innerJoin(CART,eq(CART.id, CART_ITEM.cart_id))
        .innerJoin(CHECKOUT,eq(CHECKOUT.cart_id, CART.id))
        .innerJoin(PAYMENT,eq(PAYMENT.checkout_id, CHECKOUT.id))
        .where(eq(PRODUCT.store_id, store_id))
        .groupBy(PRODUCT.id)
        .orderBy((aliases)=>aliases.total_payments)

        return stringifyDatesInJSON(most_purchased) as Array<{
            id: string,
            name: string
            total_payments: number
        }>
    }
    catch (e)
    {
        console.log("SOMETHING WENT WRONG::", e)

        return []
    }

}


const get_payments = async (status: "successful" | "failed", store_id: string) => {

    try {   

        const payments = await db.query.PAYMENT.findMany({
            where: (pms, { eq, and }) => and(
                eq(pms.store_id, store_id),
                inArray(pms.status,status === "successful" ? ["SUCCESS"] : ["FAILED", "PROCESSING"])
            ),
            orderBy: PAYMENT.created_at,
        })

        return stringifyDatesInJSON(payments) as Array<tPAYMENT>

    }
    catch (e)
    {
        console.log("SOMETHING WENT WRONG::",e)

        return []
    }

}

const get_recent_customers = async (store_id: string) => {

    try {

        const customers = await db.query.CUSTOMER.findMany({
            where: (cus, { eq, and }) => eq(cus.store_id, store_id),
            limit: 5,
            orderBy: CUSTOMER.created_at,
        })

        return stringifyDatesInJSON(customers) as Array<tCUSTOMER>

    }
    catch (e) 
    {
        console.log("SOMETHING WENT WRONG::",e)

        return null
    }

}


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

async function StorePage(props: {params: {store_id: string}}) {
    const {  params: { store_id } } = props
  
    const most_purchased = await get_most_purchased_products(store_id)
    const successful_payments = await get_payments("successful", store_id)
    const failed_payments = await get_payments("failed", store_id)
    const customers = await get_recent_customers(store_id)

    console.log({
        most_purchased,
        successful_payments,
        failed_payments,
        customers
    })


  return (
                <div className="flex flex-col w-full h-full">

                    <div className="flex flex-col w-full space-y-3 pb-3 border-b-2 border-gray-200 mb-5">
                        <h1 className="text-lg font-semibold">
                            Your Overview
                        </h1>
                    </div>


                    <div className="flex flex-row items-start justify-between w-full border-b-2 border-gray-200 mb-5 pb-3">


                        <div className="flex flex-col w-[30%] space-y-2">
                            <span className='text-sm font-medium' >
                                Successful Payments
                            </span>

                            <List className='w-full' >
                                {
                                    successful_payments?.map((payment, i)=>{
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
                            <HomeDailyPurchases/>
                        </div>


                    </div>

                    <div className="flex flex-row items-center justify-between w-full flex-wrap gap-x-5 gapy-y-5">

                        <div className="flex flex-col w-[45%] space-y-2 rounded-md shadow-sm p-5">
                            <span className='text-sm font-medium' >
                                Failed Payments
                            </span>

                            <List className='w-full' >
                                {
                                    failed_payments?.map((payment, i)=>{
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
                                    most_purchased?.map((product, i)=>{
                                        return (
                                        <ListItem key={i} >

                                            <span>
                                                {product?.name}
                                            </span>

                                            <span>
                                                KES {product?.total_payments}
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
                                    customers?.map((customer, i)=>{
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