import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Separator } from '@/components/atoms/separator'
import { DataTable } from '@/components/headless/data-table'
import { CustomerPaymentMethodsColumns } from '@/components/headless/data-tables/customers/columns'
import CustomerPaymentColumns from '@/components/headless/data-tables/customers/payments'
import CreateProduct from '@/components/organisms/product-forms/create'
import { PageLayoutProps } from '@/lib/types'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button, Card, DateRangePicker, LineChart, Metric, Text } from '@tremor/react'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { CUSTOMER, PAYMENT, PAYMENT_METHOD } from 'zodiac'

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

const fake_payment_data: Array<PAYMENT> = [
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


const fake_payment_method_data: Array<PAYMENT_METHOD> = [
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

function index() {
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
                        James Dean
                    </span>

                    <span className="font-semibold text-sm">
                        Customer Since
                    </span>
                    <span>
                        February 2023
                    </span>

                    <span className="font-semibold text-sm">
                        Customer Email
                    </span>
                    <span>
                        jamesdean@gmail.com
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
                        KES 4050.43
                    </Metric>
                </Card>

                <Card>
                    <Text>
                        Total Purchased
                    </Text>
                    <Metric>
                        24
                    </Metric>
                </Card>
            </div>
        </div>
        <div className="flex flex-col w-full h-full space-y-5 p-5">

            

            <div className="flex flex-col w-full">
                <span className="text-2xl font-semibold">
                    Payment Methods
                </span>
                <DataTable
                    data={fake_payment_method_data}
                    columns={CustomerPaymentMethodsColumns}
                />
            </div>

            <div className="flex flex-col-w-full">
                <DateRangePicker/>
            </div>
            
            <div className="flex flex-col w-full">
                <span className="text-2xl font-semibold">
                    Product Purchase overview
                </span>
                <LineChart
                  data={chart_data}
                  index='day'
                  categories={['number_of_purchases', 'amount_purchased']}
                  colors={['amber','cyan']}
                />
            </div>


            
            <div className="flex flex-col w-full">
                <span className="text-2xl font-semibold">
                    Payment History
                </span>
                <DataTable
                    data={fake_payment_data}
                    columns={CustomerPaymentColumns}
                />
            </div>


        </div>
    </div>
  )
}

export default index


export const getServerSideProps: GetServerSideProps<PageLayoutProps> = async ()=> {
    return {
        props: {
            layout: "dashboard",
        }
    }
}