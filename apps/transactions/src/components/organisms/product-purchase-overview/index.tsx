import { get_today_end, get_today_start } from '@/lib/utils'
import { DateRangePicker, DateRangePickerValue, LineChart } from '@tremor/react'
import axios from 'axios'
import dayjs from 'dayjs'
import { isUndefined } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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


type CHART_DATA = {
    day: number | string,
    number_of_purchases: number
    amount_purchased: number
}

function ProductPurchaseOverview() {

    const [range, set_range] = useState<DateRangePickerValue>()
    const { query: {product_id, store_id} } = useRouter()
    const [chart_data, set_chart_data]= useState<Array<CHART_DATA>>([])

    const handleRangeChange = async (new_range?: DateRangePickerValue) => {

        if(isUndefined(new_range)) return 

        try {
            const result = (await axios.get(`/api/products/${product_id}`, {
                params: {
                    from: new_range.from?.toISOString(),
                    to: new_range.to?.toISOString(),
                    section: "product_purchase_overview"
                }
            })).data
            
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
    <div className="flex flex-col w-full">
        <div className="flex flex-col-w-full">
                <DateRangePicker
                    value={range}
                    onValueChange={(new_range)=>{
                        set_range(range)
                        handleRangeChange(new_range)
                    }}
                />
            </div>
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
  )
}

export default ProductPurchaseOverview