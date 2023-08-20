import "ptrajectory-mpesa-payments-ui/styles.css"
import { PaymentForm } from "ptrajectory-mpesa-payments-ui"
import Cost from '@/componenets/organisms/cost'
import Header from '@/componenets/organisms/header'
import React from 'react'
import CartItem from "@/componenets/organisms/cart-item"

function CheckoutPage() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-between">


      <div className="flex flex-col w-1/2 h-full items-center justify-center">
        <div className="flex flex-col items-center w-4/5 h-4/5 space-y-5">
            <Header/>
            <Cost/>
            <div className="flex flex-col space-x-1">
                <CartItem/>
                
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
        />
      </div>
      </div>



    </div>
  )
}

export default CheckoutPage