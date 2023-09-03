import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Separator } from '@/components/atoms/separator'
import { DataTable } from '@/components/headless/data-table'
import { CustomerPaymentMethodsColumns } from '@/components/headless/data-tables/customers/columns'
import CustomerPaymentColumns from '@/components/headless/data-tables/customers/payments'
import ProductForm from '@/components/organisms/product-forms/create'
import payments from '@/lib/resources/payments'
import { PageLayoutProps } from '@/lib/types'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button, Card, DateRangePicker, LineChart, Metric, Text } from '@tremor/react'
import dayjs from 'dayjs'
import { CART, CART_ITEM, PAYMENT } from 'db/schema'
import { sql } from 'db/utils'
import { isString } from 'lodash'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { payment, CUSTOMER as tCUSTOMER, PAYMENT as tPAYMENT, PAYMENT_METHOD as tPAYMENT_METHOD } from 'zodiac'
import db from "db"
import PaymentMethodsTable from '@/components/organisms/payment-methods-table'
import PurchaseOverview from '@/components/organisms/purchase-overview/purchase-overview'
import CustomerPaymentHistory from '@/components/organisms/customer-payment-history'

const camera_image = "https://images.pexels.com/photos/414781/pexels-photo-414781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

const chart_data = [
    {
        day: dayjs().date(),
        number_of_purchases: 17,
        amount_purchased: 40560
    },
    {
        day: dayjs().subtract(1, "day").date(),
        number_of_purchases: 22,
        amount_purchased: 53000
    },
    {
        day: dayjs().subtract(2, "day").date(),
        number_of_purchases: 24,
        amount_purchased: 153000
    },
    {
        day: dayjs().subtract(3, "day").date(),
        number_of_purchases: 12,
        amount_purchased: 65000
    },
    {
        day: dayjs().subtract(4, "day").date(),
        number_of_purchases: 28,
        amount_purchased: 16300
    },
    {
        day: dayjs().subtract(5, "day").date(),
        number_of_purchases: 32,
        amount_purchased: 43560
    },
]

const fake_payment_data: Array<tPAYMENT> = [
    {
        id: "11",
        amount: 300,
        payment_method_id: "ppeer-s32",
        status: "PAID"
    },
    {
        id: "11",
        amount: 300,
        payment_method_id: "ppeer-s32",
        status: "PAID"
    },
    {
        id: "11",
        amount: 300,
        payment_method_id: "ppeer-s32",
        status: "PAID"
    },
    {
        id: "11",
        amount: 300,
        payment_method_id: "ppeer-s32",
        status: "PAID"
    },
    {
        id: "11",
        amount: 300,
        payment_method_id: "ppeer-s32",
        status: "PAID"
    },
]


const fake_payment_method_data: Array<tPAYMENT_METHOD> = [
    {
        id: "1111",
        phone_number: "078993993",
        type: "MPESA"
    },
    {
        id: "1111",
        phone_number: "078993993",
        type: "MPESA"
    },
    {
        id: "1111",
        phone_number: "078993993",
        type: "MPESA"
    },
    {
        id: "1111",
        phone_number: "078993993",
        type: "MPESA"
    },
    {
        id: "1111",
        phone_number: "078993993",
        type: "MPESA"
    },
]

interface CustomerPageProps {
    customer?: tCUSTOMER | null
    amount_spent?: number | null
    purchased_products?: number | null
}

function index(props: CustomerPageProps) {

    const { customer, amount_spent, purchased_products } = props

  return (
    <div className="flex flex-col w-full h-full">
        <div className="flex flex-col p-5 rounded-md shadow-sm space-y-4">
            <div className="flex flex-row justify-between p-5 rounded-md">
                
                {/* left side */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <span className="font-semibold text-sm">
                        Customer Name
                    </span>
                    <span>
                        {`${ customer?.first_name ?? "" } ${customer?.last_name ?? ""} `}
                    </span>

                    <span className="font-semibold text-sm">
                        Customer Since
                    </span>
                    <span>
                        {dayjs(customer?.created_at).format("MMM YYYY")}
                    </span>

                    <span className="font-semibold text-sm">
                        Customer Email
                    </span>
                    <span>
                        {customer?.email}
                    </span>
                </div>

                {/* right side */}

                <div className="flex flex-col items-center justify-center space-y-5 ">
                        
                        <Dialog modal>
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
                        </Dialog>

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
                        KES {amount_spent}
                    </Metric>
                </Card>

                <Card>
                    <Text>
                        Total Purchased
                    </Text>
                    <Metric>
                        {purchased_products}
                    </Metric>
                </Card>
            </div>
        </div>
        <div className="flex flex-col w-full h-full space-y-5 p-5">

            

            <PaymentMethodsTable/>

            <PurchaseOverview/>


            
            <CustomerPaymentHistory/>


        </div>
    </div>
  )
}

export default index

const get_amount_spent = (customer_id: string) => sql`
    select SUM(amount) as total_amount
    from ${PAYMENT}
    where customer_id = ${customer_id}
`

const get_products_purchased = (customer_id: string ) => sql`
    select COUNT(quantity) as product_count
    from ${CART_ITEM} as crt_itm
    join ${CART} as crt on crt.id = crt_itm.cart_id
    where crt.customer_id = ${customer_id};
    
`


export const getServerSideProps: GetServerSideProps<PageLayoutProps & CustomerPageProps> = async (context)=> {

    const { customer_id } = context.query

    let customer: tCUSTOMER | null = null 
    let amount_spent: number | null = 0 
    let purchased_products: number | null = 0

    try {

        console.log("customer_id", customer_id)
        customer = isString(customer_id) ? ( (await payments.customer?.getCustomer(customer_id)) ?? null) : null

        const total_amount = isString(customer_id) ? (await db.execute(get_amount_spent(customer_id)))?.at(0)?.total_amount : null
        amount_spent = isString(total_amount) ? Number(total_amount) : 0

        const total_purchased = isString(customer_id) ? (await db.execute(get_products_purchased(customer_id)))?.at(0)?.product_count : null

        purchased_products = isString(total_purchased) ? Number(total_purchased) : 0
    }
    catch (e) 
    {

    }

    return {
        props: {
            layout: "dashboard",
            customer,
            amount_spent,
            purchased_products
        }
    }
}