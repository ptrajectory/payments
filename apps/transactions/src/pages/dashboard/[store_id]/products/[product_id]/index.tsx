import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Separator } from '@/components/atoms/separator'
import ProductForm from '@/components/organisms/product-forms/create'
import payments from '@/lib/resources/payments'
import { PageLayoutProps } from '@/lib/types'
import { stringifyDatesInJSON } from '@/lib/utils'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button, Card, DateRangePicker, LineChart, Metric, Text } from '@tremor/react'
import dayjs from 'dayjs'
import { CART, CART_ITEM, CHECKOUT, PAYMENT } from 'db/schema'
import { sql } from 'db/utils'
import { isNull, isString, isUndefined } from 'lodash'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { payment, PRODUCT as tPRODUCT } from 'zodiac'
import db from "db"
import ProductPurchaseOverview from '@/components/organisms/product-purchase-overview'

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

type ProductPageProps = {
    product: tPRODUCT | null 
    total_sales: number
    customers: number
}

function index(props: ProductPageProps) {

    const { product, total_sales, customers } = props

  return (
    <div className="flex flex-col w-full h-full">
        <div className="flex flex-col p-5 rounded-md shadow-sm space-y-4">
              <div className="flex flex-row items-start justify-between p-5 rounded-md">
                
                {/* left side */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <span className="font-semibold text-sm">
                        Product Name
                    </span>
                    <span>
                        {product?.name}
                    </span>

                    <span className="font-semibold text-sm">
                        Product Price
                    </span>
                    <span>
                        KES {product?.price}
                    </span>

                    <span className="font-semibold text-sm">
                        Product Description
                    </span>
                    <span>
                        {product?.description}
                    </span>

                    <span className="font-semibold text-sm">
                        Product Image
                    </span>
                    <div className="flex flex-row items-center justify-center relative w-12 h-12 rounded-sm overflow-hidden">
                        <Image
                            src={product?.image ?? camera_image}
                            alt='Camera Image'
                            fill 
                            style={{
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>

                {/* right side */}

                  <div className="flex flex-col items-end justify-start space-y-5 ">

                        <Dialog modal>
                            <DialogTrigger asChild>
                                <Button variant='secondary' className='w-full' >
                                    Edit
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                      Edit Product
                                  </DialogTitle>
                                </DialogHeader>
                                <>
                                    <ProductForm
                                        action='edit'
                                        {...product}
                                    />
                                </>
                            </DialogContent>
                        </Dialog>



                </div>

            </div>
            <Separator
                
            />
            <div className="flex flex-row items-center gap-x-5 justify-between w-full">
                <Card>
                    <Text>
                        Total Sales
                    </Text>
                    <Metric>
                        KES {total_sales}
                    </Metric>
                </Card>

                <Card>
                    <Text>
                        Customers
                    </Text>
                    <Metric>
                        {customers}
                    </Metric>
                </Card>
            </div>
        </div>
        <div className="flex flex-col w-full h-full space-y-3 p-5">

            <ProductPurchaseOverview/>


            {/* <div className="flex flex-col w-full">
                <span className="text-2xl font-semibold">
                    Product Purchase overview
                </span>
                <LineChart
                  data={chart_data}
                  index='day'
                  categories={['number_of_purchases', 'amount_purchased']}
                  colors={['amber','cyan']}
                />
            </div> */}


        </div>
    </div>
  )
}

export default index

const get_total_sales = (product_id: string) => sql`
    select SUM(pm.amount) as total_sales
    from ${PAYMENT} as pm 
    join ${CHECKOUT} as chk on chk.id = pm.checkout_id
    join ${CART} as crt on crt.id = chk.cart_id
    join ${CART_ITEM} as crt_itm on crt_itm.cart_id = crt.id
    where crt_itm.product_id = ${product_id}
    group by crt_itm.product_id
`

const get_total_customers = (product_id: string ) => sql`
    select COUNT(DISTINCT crt.customer_id) as customers 
    from ${CART} as crt
    join ${CART_ITEM} as crt_itm on crt_itm.cart_id = crt.id
    where crt_itm.product_id = ${product_id}

`


export const getServerSideProps: GetServerSideProps<PageLayoutProps & ProductPageProps> = async (context)=> {

    const { store_id, product_id } = context.query

    let product: tPRODUCT | null = null
    let total_sales: number = 0
    let customers: number = 0

    try {

        product = isString(product_id) ? (await payments.product?.getProduct(product_id) ?? null) : null

        product = stringifyDatesInJSON(product)

        console.log("THE PRODUC::", product)

        const sales = isString(product_id) ?  (await db.execute(get_total_sales(product_id)) as Array<{
            total_sales: null | string
        }> 
            ?? null
        ) : null 

        const sales_value = isNull(sales) ? 0 : sales.at(0)?.total_sales

        total_sales = (isNull(sales_value) || isUndefined(sales_value)) ? 0 : isNaN(Number(sales_value)) ? 0 : Number(sales_value)

        const total_customers = isString(product_id) ? (await db.execute<{
            customers: string | null
        }>(get_total_customers(product_id))) : null

        const customers_value = isNull(total_customers) ? 0 : total_customers?.at(0)?.customers

        customers = isString(customers_value) ? Number(customers_value) : 0
    }
    catch (e) {
        //TODO: handle this error

        console.log("SOMething went wrong::", e)
    }


    return {
        props: {
            layout: "dashboard",
            product,
            total_sales,
            customers
        }
    }
}