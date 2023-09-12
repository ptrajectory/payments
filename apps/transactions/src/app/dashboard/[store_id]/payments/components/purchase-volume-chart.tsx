"use client"
import { Card, DateRangePicker, DateRangePickerValue, LineChart, Title } from '@tremor/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { isString } from 'lodash'
import { useParams } from 'next/navigation'
import { SkeletonBlock } from '@/layouts/skeletons'
import axios from 'axios'

interface ChartData {
    day: string,
    "Successful Payments": number
    "Failed Payments": number

}

function PurchaseVolumeChart() {
  const [chart_data, set_chart_data] = useState<Array<ChartData>>([])
  const [loading, setLoading] = useState(false)
  const [currentDateRange, setCurrentDateRange ] = useState<DateRangePickerValue|undefined>({
      from: new Date(),
      to: new Date()
  })

  const query = useParams()

  const handleDailyPurchases = async (range?: DateRangePickerValue) => {
    setLoading(true)
    try {

        if(!isString(query?.store_id)) return
        const data = (await axios.get("/api/graphs/payments/purchase-volume", {
            params: {
                from: range?.from,
                to: range?.to,
                store_id: query?.store_id
            }
        }))?.data?.data

        console.log("HERE IS SOME CHART DATA::", data)

        set_chart_data(data)

    }
    catch (e)
    {
        //TODO: deal with error later
    }
    finally{
        setLoading(false)
    }
  }

  useEffect(()=>{
    handleDailyPurchases()
  }, [])

  return (
    <div className="flex flex-col w-full space-y-2 h-full">
        <div className="flex flex-row w-full items-center justify-start">
            <DateRangePicker
                onValueChange={(range)=>{
                    setCurrentDateRange(range)
                    handleDailyPurchases(range)
                }}
                value={currentDateRange}
            />
        </div>
        <Card>
            <Title>
                Purchase Volume
            </Title>
            { 
                loading ? <SkeletonBlock className='w-full h-[30vh]' /> :
                <LineChart
                    data={chart_data}
                    index='day'
                    categories={['Successful Payments', 'Failed Payments']}
                    colors={['blue', 'red']}
                />
            }
        </Card>
    </div>
  )
}

export default PurchaseVolumeChart