/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { get_today_end, get_today_start } from '@/lib/utils'
import { DateRangePicker, DateRangePickerProps, DateRangePickerValue, LineChart } from '@tremor/react'
import axios from 'axios'
import dayjs from 'dayjs'
import { isUndefined } from 'lodash'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'


type CHART_DATA = {
    day: number | string,
    number_of_purchases: number
    amount_purchased: number
}

function PurchaseOverview() {

    const [range, set_range] = useState<DateRangePickerValue>()
    const params = useParams()
    const [chart_data, set_chart_data]= useState<Array<CHART_DATA>>([])

    const handleRangeChange = async (new_range?: DateRangePickerValue) => {

        if(isUndefined(new_range)) return 

        try {
            const result = (await axios.get(`/api/graphs/customers/purchase-overview`, {
                params: {
                    from: new_range.from?.toISOString(),
                    to: new_range.to?.toISOString(),
                    customer_id: params?.customer_id
                }
            })).data
            console.log("Here is the result::", result)
            set_chart_data(result.data)

        }
        catch (e)
        {
            // TODO: handle this error
        }
    }

    useEffect(()=>{
        handleRangeChange({
            from: get_today_start(),
            to: get_today_end()
        })
    },[])

  return (
    <div className="flex flex-col w-full space-y-2 mt-5">
        <DateRangePicker
            value={range}
            onValueChange={(new_range)=>{
                set_range(range)
                handleRangeChange(new_range)
            }}
        />
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
    </div>
    
  )
}

export default PurchaseOverview