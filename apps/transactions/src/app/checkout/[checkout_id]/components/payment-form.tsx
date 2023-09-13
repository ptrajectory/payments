"use client"
import "ptrajectory-mpesa-payments-ui/styles.css"
import { PaymentForm } from "ptrajectory-mpesa-payments-ui"
import { useState } from "react"
import { useToast } from "@/components/atoms/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"



export default function CheckoutPayForm (props: { pay: number | null, checkout_id: string })
{
    const { pay, checkout_id } = props
    const [isLoading, setLoading] = useState(false)
    const { toast } = useToast()
    const { push } = useRouter() // TODO: Redirect to dashboard for now

    const handlePay = async (data: any) => {

        setLoading(true)
        try {

            const payment = (await axios.post("/api/checkout/pay", {
                ...data,
                checkout_id
            })).data.data

            toast({
                title: "Check your phone",
                description: "You should have received a payment prompt.",
                duration: 2000
            })

            const status = (await axios.get("/api/checkout/pay", {
                params: {
                    checkout_id,
                    payment_id: payment?.id
                }
            })).data.data

            if(status === "SUCCESS"){
                toast({
                    title: "🎉 Transaction Successful",
                    description: "Transaction has been processed. Wait to be redirected",
                    duration: 3000
                })

                push("/dashboard")
            }
            else{
                toast({
                    title: "Oops!",
                    description: "Unable to complete transaction",
                    variant: "destructive",
                    duration: 3000
                }) 
            }



        }
        catch (e)
        {
            toast({
                title: "Oops!",
                description: "Something went wrong! try again",
                variant: "destructive",
                duration: 3000
            })  
        }
        finally{
            setLoading(false)
        }

    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <PaymentForm
                processing={isLoading}
                amount={pay ?? 0}
                onFormSubmit={(data)=>{
                    handlePay(data)
                }}
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
    )

}