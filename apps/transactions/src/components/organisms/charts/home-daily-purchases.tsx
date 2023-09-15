"use client"
import { Card, DateRangePicker, DateRangePickerValue, LineChart, Title } from '@tremor/react'
import React, { useEffect, useState } from 'react'
import { ChartData, fetch_home_daily_purchases_chart_data } from './utils'
import { isString } from 'lodash'
import { useParams } from 'next/navigation'
import { SkeletonBlock } from '@/layouts/skeletons'


interface Props {
    initialData: Array<ChartData>
}

function HomeDailyPurchases(props: Props) {
  const { initialData } = props
  const [chart_data, set_chart_data] = useState<Array<ChartData>>(initialData ?? [])
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
        const data = await fetch_home_daily_purchases_chart_data(query?.store_id as string,range ? {
            from: range.from?.toISOString(),
            to: range.to?.toISOString()
        }: undefined)

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
                Daily total purchases
            </Title>
            { 
                loading ? <SkeletonBlock className='w-full h-[30vh]' /> :
                <LineChart
                    data={chart_data}
                    index='day'
                    categories={['total_amount_spent']}
                    colors={['amber']}
                />
            }
        </Card>
    </div>
  )
}

export default HomeDailyPurchases