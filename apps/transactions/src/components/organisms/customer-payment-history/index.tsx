import { DataTable } from '@/components/headless/data-table'
import CustomerPaymentColumns from '@/components/headless/data-tables/customers/payments'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { PAYMENT as tPAYMENT } from 'zodiac'

const fake_payment_data: Array<any> = [
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


function CustomerPaymentHistory() {
    const [payments, set_payments] = useState<Array<tPAYMENT>>([])
    const { query: { customer_id, store_id } } = useRouter()

    const fetch_customer_payment_hostory = async () => {

        try {

            const result = (await axios.get("/api/payments", {
                params: {
                    customer_id
                }
            }))?.data 

            console.log("Here is the result::", result )

            set_payments(result?.data)

        }
        catch (e)
        {
            //TODO: handle this error later
        }

    }


    useEffect(()=>{
        fetch_customer_payment_hostory()
    }, [])

  return (
    <div className="flex flex-col w-full">
        <span className="text-2xl font-semibold">
            Payment History
        </span>
        <DataTable
            data={payments}
            columns={CustomerPaymentColumns}
        />
    </div>
  )
}

export default CustomerPaymentHistory