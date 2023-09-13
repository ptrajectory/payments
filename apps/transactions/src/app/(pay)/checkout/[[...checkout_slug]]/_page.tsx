"use client"
import "ptrajectory-mpesa-payments-ui/styles.css"
import axios from 'axios'
import Image from 'next/image'
import { PaymentForm } from 'ptrajectory-mpesa-payments-ui'
import React, { useState } from 'react'
import { CART, CART_ITEM, CHECKOUT, CUSTOMER, PRODUCT, STORE } from 'zodiac'

function CheckoutMainPageSection( props:{data:  Partial<{
    cart: CART & { items: Array<CART_ITEM> } | null,
    checkout: CHECKOUT | null
    price: number | null
    customer: CUSTOMER | null
    store: STORE | null
    products: Array<PRODUCT>
} > | null}) {
    const { data } = props
  const [processing, setProcessing] = useState(false)
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-between">


      <div className="flex flex-col w-1/2 h-full items-center justify-center">
        <div className="flex flex-col w-4/5 h-4/5 space-y-5 ">

            <div className="flex flex-row items-center justify-start w-full">

                <div className="flex flex-row items-center justify-center relative shadow-sm w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={data?.store?.image ?? "/brand/placeholder_image.png"}
                        alt={data?.store?.name ?? "store image"}
                        fill 
                        sizes="48px"
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
                                        src={product?.image ?? "/brand/placeholder_image.png"} 
                                        sizes="40px"
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
          amount={data?.price ?? 0} 
          processing={processing}
          onFormSubmit={async (form_data)=>{
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

export default CheckoutMainPageSection