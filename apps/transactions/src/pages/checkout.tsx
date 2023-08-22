import "ptrajectory-mpesa-payments-ui/styles.css"
import { PaymentForm } from "ptrajectory-mpesa-payments-ui"
import Cost from '@/componenets/organisms/cost'
import Header from '@/componenets/organisms/header'
import React from 'react'
import CartItem from "@/componenets/organisms/cart-item"
import { ArrowLeftIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/componenets/atoms/avatar"

function CheckoutPage() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-between">


      <div className="flex flex-col w-1/2 h-full items-center justify-center">
        <div className="grid grid-cols-[20px_1fr] w-4/5 gap-x-2 h-4/5">
          <div className="flex flex-row items-start justify-center w-full h-full py-1" >
            <button className="outline-none background-none rounded-full p-1">
              <ArrowLeftIcon
                className="text-gray-400"
                size={18}
              />
            </button>

            

          </div>
          <div className="flex flex-col items-center justify-start w-full ">


              <div className="flex flex-row items-center justify-start w-full">
                <Avatar>
                  <AvatarImage
                    src="https://www.iamonyino.com/brand/ptrajectory.svg"
                    className="p-1"
                  />
                  <AvatarFallback>
                    ptrajectory
                  </AvatarFallback>
                </Avatar>
                <h1
                  className="font-semibold"
                >
                  ptrajectory
                </h1>
              </div>


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