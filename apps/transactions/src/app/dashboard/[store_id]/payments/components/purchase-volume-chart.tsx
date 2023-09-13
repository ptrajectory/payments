"use client"
import { DateRangePickerValue } from '@tremor/react'
import React from 'react'
import { isString } from 'lodash'
import { useParams } from 'next/navigation'
import axios from 'axios'
import AppLineChart from '@/components/organisms/app-line-chart'

interface ChartData {
    day: string,
    "Successful Payments": number
    "Failed Payments": number

}

interface Props {
    initialData: Array<ChartData>
}

function PurchaseVolumeChart(props: Props) {
  const { initialData } = props

  const query = useParams()

  const handleDailyPurchases = async (range?: DateRangePickerValue) => {
        if(!isString(query?.store_id)) return
        const data = (await axios.get("/api/graphs/payments/purchase-volume", {
            params: {
                from: range?.from,
                to: range?.to,
                store_id: query?.store_id
            }
        }))?.data?.data

        return data
  }


  return <AppLineChart 
    title="Purchase Volume"
    lines={["Successful Payments", "Failed Payments"]}
    colors={["blue", "red"]}
    fetchFunction={handleDailyPurchases}
    index="day"
    initialData={initialData}
  />
}

export default PurchaseVolumeChart