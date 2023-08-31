import payments from '@/lib/resources/payments'
import "ptrajectory-mpesa-payments-ui/styles.css"
import { isArray, isEmpty, isNull, isString, isUndefined } from 'lodash'
import { GetServerSideProps } from 'next'
import React, { useState } from 'react'
import { CART, CART_ITEM, CHECKOUT, CUSTOMER, PRODUCT, STORE, payment } from 'zodiac'
import db from "db"
import { inArray } from "db/utils"
import { generate_dto } from 'generators'
import { PaymentForm } from 'ptrajectory-mpesa-payments-ui'
import { ArrowLeftIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import Image from 'next/image'
import { stringifyDatesInJSON } from '@/lib/utils'
import axios from 'axios'

interface CheckoutPageProps {
    data: Partial<{
        cart: CART & { items: Array<CART_ITEM> },
        checkout: CHECKOUT
        price: number
        customer: CUSTOMER
        store: STORE
        products: Array<PRODUCT>
    }> | null
    message: string
    status: "error" | "success"
}

function CheckoutPage(props: CheckoutPageProps) {
  const { data, message, status } = props 
  const [processing, setProcessing] = useState(false)

  console.log("HERE IS THE DATA", data)
  console.log("HERE IS THE MESSAGE", message)
  console.log("HERE IS THE STATUS", status)

  return (
    <div className="w-screen h-screen flex flex-row items-center justify-between">


      <div className="flex flex-col w-1/2 h-full items-center justify-center">
        <div className="flex flex-col w-4/5 h-4/5 space-y-5 ">

            <div className="flex flex-row items-center justify-start w-full">

                <div className="flex flex-row items-center justify-center relative shadow-sm w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={data?.store?.image ?? ""}
                        alt={data?.store?.name ?? "store image"}
                        fill 
                        style={{
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <span
                    className='text-sm font-semibold'
                >
                    {data?.store?.name}
                </span>

            </div>

            <div className="flex flex-col w-full space-y-2">
                <h4 className='text-lg font-medium text-gray-400'>
                    Pay {data?.store?.name}
                </h4>
                <h3
                    className='text-2xl font-semibold text-black'
                >
                    { data?.checkout?.currency } { data?.price }
                </h3>
            </div>

            <div className="flex flex-col items-center justify-start w-full space-y-5 px-3">
                        
                {
                    data?.products?.map((product)=>{
                        return (
                            <div key={product?.id} className="flex flex-row items-start p-2 justify-start rounded-sm border-[1px]  hover:shadow-sm w-full space-x-5">
                                <div className="flex flex-col items-center justify-center relative rounded-md overflow-hidden w-10 h-10">
                                    <Image
                                        src={product?.image ?? ""}
                                        alt={product?.name ?? "product"}
                                        fill
                                        style={{
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col  h-full">
                                    <span className='text-lg font-semibold' >
                                        { product?.name }
                                    </span>
                                    <span className='text-sm font-medium text-gray-400' >
                                        {
                                            product?.description
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
          
        </div>
      </div>


      <div className="flex flex-col w-1/2 shadow-[15px_0px_30px_0px_rgba(0,0,0,0.18)] h-full">
      <div className="flex flex-col items-center justify-center w-4/5 h-4/5 space-y-5">
        <PaymentForm
          additional_fields={{
            email: {
              default_value: ""
            },
            first_name: {
              default_value: ""
            },
            last_name: {
              default_value: ""
            }
          }}
          amount={data?.price} 
          processing={processing}
          onFormSubmit={async (form_data)=>{
            console.log("HERE IS SOME DATA::", form_data)
            setProcessing(true)
            try {
                const result = (await axios.post('/api/purchase', {
                    ...form_data,
                    store_id: data?.store?.id,
                    checkout_id: data?.checkout?.id
                })).data

                const status = (await axios.get(`/api/purchase/${result.data.id}`)).data.data


                if(status === "SUCCESS"){
                    console.log("PAYMENT SUCCESSFULL")
                }
                else{
                    console.log("STATUS WAS::", status)
                }


            }
            catch (e)
            {
                //TODO: handle me
                console.log("SOMETHING WENT WRONG::", e)
            }
            finally {
                setProcessing(false)
            }
          }}
        />
      </div>
      </div>



    </div>
  )
}

export default CheckoutPage

export const getServerSideProps: GetServerSideProps = async (context) => {

    let customer: null | CUSTOMER = null
    let cart: null | CART & {
        items: Array<CART_ITEM>
    } = null 
    let price: number = 0
    let store: STORE | null
    let products: Array<PRODUCT> | null

    const { checkout_slug } = context.query

    const [checkout_id] = isArray(checkout_slug) ? checkout_slug : []


    if(isUndefined(checkout_id)) return { props: generate_dto(null, "Checkout ID is required", "error") }


    try {
        const checkout = await payments.checkout?.getCheckout(checkout_id)
    
        if(isUndefined(checkout?.cart_id) || isUndefined(checkout)) return { props: generate_dto(null, "Checkout empty", "error") }

        store = (await db.query.STORE.findFirst({
            where: (str, {eq}) => eq(str.id, checkout?.store_id)
        })) ?? null
    
        const purchase_cart = await payments.cart?.getCart(checkout.cart_id)
    
        cart = purchase_cart ?? null
    
        if(isNull(cart) || isEmpty(cart?.items)) return { props: generate_dto({
            checkout,
            price,
            store
        }, "Cart empty", "error") }
    
        const product_ids = cart?.items?.map(({product_id: id})=>id)?.filter((v)=>!isUndefined(v))
        
        const purchased_products = await db.query.PRODUCT.findMany({
            where: (products, {}) => inArray(products.id, product_ids),
        })

        console.log(purchased_products)
    
        if(isEmpty(purchased_products)) return { props: stringifyDatesInJSON(generate_dto({
            checkout,
            price,
            cart,
            store
        }, "Products empty", "error")) }
    
        const total = purchased_products.reduce((prev, cur)=> {
            return prev + cur.price
        }, 0)
    
        price = total

        products = purchased_products
    
        if(isString(checkout?.customer_id)) {
            const cus = await payments.customer?.getCustomer()
    
            if(!isUndefined(cus)){
                customer = cus
            }
        }

        return {
            props: stringifyDatesInJSON(generate_dto({
                checkout,
                customer,
                cart,
                price,
                store,
                products
            }, "success", "success"))
        }

    }
    catch (e)
    {
        //TODO: handle the error better
        return {
            props: generate_dto(null, "Something went wrong", "error")
        }
    }

}