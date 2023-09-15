import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { Separator } from '@/components/atoms/separator'
import ProductForm from '@/components/organisms/product-forms/create'
import { PageLayoutProps } from '@/lib/types'
import { stringifyDatesInJSON } from '@/lib/utils'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button, Card, DateRangePicker, LineChart, Metric, Text } from '@tremor/react'
import dayjs from 'dayjs'
import { CART, CART_ITEM, CHECKOUT, CUSTOMER, PAYMENT } from 'db/schema'
import { eq, sql } from 'db/utils'
import { isNull, isString, isUndefined } from 'lodash'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import React from 'react'
import { payment, PRODUCT as tPRODUCT } from 'zodiac'
import db from "db"
import ProductPurchaseOverview from '@/components/organisms/product-purchase-overview'
import ProductPageHero from './hero'

const getProductData = async (id?: string) => {

    if(!isString(id)) return { product: null, total_sales: 0, customers: 0 }

    try{

        const product = await db.query.PRODUCT.findFirst({
            where: (prod, {eq}) => eq(prod.id, id),
            
        })


        const sales_agg_data = await db.select({
            total_sales: sql<number>`sum(${PAYMENT.amount})`.mapWith(Number)
        }).from(PAYMENT)
        .innerJoin(CHECKOUT, eq(CHECKOUT.id, PAYMENT.checkout_id))
        .innerJoin(CART, eq(CART.id, CHECKOUT.cart_id))
        .innerJoin(CART_ITEM, eq(CART_ITEM.cart_id, CART.id))
        .where(eq(CART_ITEM.product_id, id))
        .groupBy(CART_ITEM.product_id)

        const customer_agg_data = await db.select({
            customers: sql<number>`count(distinct ${CART.customer_id})`.mapWith(Number)
        }).from(CART)
        .innerJoin(CART_ITEM, eq(CART_ITEM.cart_id, CART.id))
        .where(eq(CART_ITEM.product_id, id)) 
        
        console.log("HERE ARE THE CUSTOMERS", customer_agg_data)

        return {
            product: stringifyDatesInJSON(product),
            total_sales: sales_agg_data?.at(0)?.total_sales ?? 0,
            customers: customer_agg_data?.at(0)?.customers ?? 0
        }

    }
    catch (e)
    {
        console.log("SOMETHING WENT WRONG:: ", e)
        //TODO: handle error better
        return { product: null, total_sales: 0, customers: 0 }
    }


}


async function index(props: { params: { store_id: string, product_id: string } }) {
    const {params: { product_id }} = props
    const data = await getProductData(product_id)

  return (
    <div className="flex flex-col w-full h-full pb-[200px]">
        <ProductPageHero
            {...data}
        />
        <div className="flex flex-col w-full h-full space-y-3 p-5">

            <ProductPurchaseOverview/>


        </div>
    </div>
  )
}

export default index
