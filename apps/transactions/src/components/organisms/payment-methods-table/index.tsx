"use client"
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { DataTable } from '@/components/headless/data-table'
import { CustomerPaymentMethodsColumns } from '@/components/headless/data-tables/customers/columns'
import React, { useEffect, useState } from 'react'
import { PAYMENT_METHOD as tPAYMENT_METHOD } from 'zodiac'
import CreatePaymentMethod from './create-payment-method-form'
import axios from 'axios'
import { useParams } from 'next/navigation'

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

function PaymentMethodsTable() {
    const [payment_methods, set_payment_methods] = useState<Array<tPAYMENT_METHOD>>([])
    const [loading, setLoading] = useState(false)
    const params = useParams()

    const fetch_payment_methods = async () => {
        setLoading(true)

        try {
            const data = (await axios.get("/api/payment_methods", {
                params: {
                    customer_id: params?.customer_id
                }
            })).data.data

            set_payment_methods(data)
            console.log("Incoming data", data)

        }
        catch (e)
        {
            console.log("something went wrong")
            // TODO: handle this error
        }
        finally
        {
            setLoading(false)
        }


    }


    useEffect(()=>{

        fetch_payment_methods()

    }, [])

  return (
    <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-row items-center justify-between">
            <span className="text-2xl font-semibold">
                Payment Methods
            </span>
            <Dialog modal onOpenChange={(open)=>{
                if(!open) return fetch_payment_methods()
            }} >
                <DialogTrigger asChild>
                    <Button>
                        Add Payment Method
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Create a new Payment Method
                        </DialogTitle>
                    </DialogHeader>
                    <CreatePaymentMethod/>
                </DialogContent>
            </Dialog>
        </div>
        <DataTable
            data={payment_methods}
            columns={CustomerPaymentMethodsColumns}
            paginationEnabled={false}
            loading={loading}
        />
    </div>
  )
}

export default PaymentMethodsTable