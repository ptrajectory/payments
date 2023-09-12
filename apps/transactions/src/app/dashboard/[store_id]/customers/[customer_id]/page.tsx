import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Separator } from '@/components/atoms/separator'
import { DataTable } from '@/components/headless/data-table'
import { CustomerPaymentMethodsColumns } from '@/components/headless/data-tables/customers/columns'
import CustomerPaymentColumns from '@/components/headless/data-tables/customers/payments'
import ProductForm from '@/components/organisms/product-forms/create'

import { PageLayoutProps } from '@/lib/types'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button, Card, DateRangePicker, LineChart, Metric, Text } from '@tremor/react'
import dayjs from 'dayjs'
import { CART, CART_ITEM, PAYMENT } from 'db/schema'
import { eq, sql } from 'db/utils'
import { isString, isUndefined } from 'lodash'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { payment, CUSTOMER as tCUSTOMER, PAYMENT as tPAYMENT, PAYMENT_METHOD as tPAYMENT_METHOD } from 'zodiac'
import db from "db"
import PaymentMethodsTable from '@/app/dashboard/[store_id]/customers/[customer_id]/components/payment-methods-table'
import PurchaseOverview from '@/components/organisms/purchase-overview/purchase-overview'
import CustomerPaymentHistory from '@/components/organisms/customer-payment-history'
import { stringifyDatesInJSON } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import UpdateCustomerForm from './components/update-customer-details'


const getCustomerInfo = async (id?: string) => {

    if(isUndefined(id)) return null

    let customer

    try {
        customer = await db.query.CUSTOMER.findFirst({
            where: (cus, { eq }) => eq(cus.id, id)
        })

    }
    catch (e)
    {
        // TODO: deal with error
        return {
            customer: null,
            amount_spent: 0,
            purchased_products: 0
        }
    }

    let amount_data

    try {
        amount_data = await db.select({
            amount: sql<number>`sum(${PAYMENT.amount})`.mapWith(Number)
        }).from(PAYMENT)
        .where(eq(PAYMENT.customer_id, id))

    }
    catch(e)
    {
        // TODO: do something about this 
        console.log("SOMETHING WENT WRONG::",e)
        return {
            customer,
            amount_spent: 0,
            purchased_products: 0
        }
    }
    let products_amount_data

    try {
        products_amount_data = await db.select({
            product_count: sql<number>`count(${CART_ITEM.quantity})`.mapWith(Number)
        }).from(CART_ITEM)
        .innerJoin(CART, eq(CART.id, CART_ITEM.cart_id))
        .where(eq(CART.customer_id, id))
    }
    catch (e) 
    {
        // TODO: better error handling
        console.log("Something went wrong", e)

        return {
            customer,
            amount_spent: amount_data?.at(0)?.amount || 0,
            purchased_products: 0
        }
    }

    return {
        customer: stringifyDatesInJSON(customer),
        amount_spent: amount_data?.at(0)?.amount || 0,
        purchased_products: products_amount_data?.at(0)?.product_count || 0
    }

}



interface CustomerPageProps {
    customer?: tCUSTOMER | null
    amount_spent?: number | null
    purchased_products?: number | null
}

async function index(props: {
    params: {
        customer_id: string
        store_id: string
    }
}) {
    const { params: { customer_id, store_id } } = props

    const data = await getCustomerInfo(customer_id)


  return (
    <div className="flex flex-col w-full h-full justify-start">
        <div className="flex flex-row w-full items-center justify-start px-5">
            <Link href={`/dashboard/${store_id}/customers`} >
                <button className='bg-none outline-none' > 
                    <ArrowLeftIcon size="16px" />
                </button>
            </Link>
        </div>
        <div className="flex flex-col p-5 rounded-md shadow-sm space-y-4">
            <div className="flex flex-row justify-between p-5 rounded-md">
                
                {/* left side */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <span className="font-semibold text-sm">
                        Customer Name
                    </span>
                    <span>
                        {`${ data?.customer?.first_name ?? "" } ${data?.customer?.last_name ?? ""} `}
                    </span>

                    <span className="font-semibold text-sm">
                        Customer Since
                    </span>
                    <span>
                        {dayjs(data?.customer?.created_at).format("MMM YYYY")}
                    </span>

                    <span className="font-semibold text-sm">
                        Customer Email
                    </span>
                    <span>
                        {data?.customer?.email}
                    </span>
                </div>

                {/* right side */}

                <div className="flex flex-col items-center justify-center space-y-5 ">
                      <UpdateCustomerForm
                          data={data?.customer ?? null}
                      />
                        {/* <Dialog modal>
                            <DialogTrigger asChild>
                                <Button  className='w-full' >
                                    Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent>  
                                <DialogHeader>
                                    <DialogTitle>
                                        Delete Customer
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-row items-center justify-start p-2">
                                    Are you sure?
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button>
                                            Yes
                                        </Button>
                                    </DialogClose>

                                    <DialogClose asChild>
                                        <Button>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog> */}

                </div>

            </div>
            <Separator
                
            />
            <div className="flex flex-row items-center gap-x-5 justify-between w-full">
                <Card>
                    <Text>
                        Amount Spent
                    </Text>
                    <Metric>
                        KES {data?.amount_spent}
                    </Metric>
                </Card>

                <Card>
                    <Text>
                        Total Purchased
                    </Text>
                    <Metric>
                        {data?.purchased_products}
                    </Metric>
                </Card>
            </div>
        </div>
        <div className="flex flex-col w-full h-full space-y-5 p-5">

            

            <PaymentMethodsTable/>

            <PurchaseOverview/>


            
            {/* <CustomerPaymentHistory/> */}


        </div>
    </div>
  )
}

export default index