"use client"
import { Card, DateRangePicker, DateRangePickerValue, LineChart, Title, Color } from '@tremor/react'
import React, { useState } from 'react'
import { isString } from 'lodash'
import { useParams } from 'next/navigation'
import { SkeletonBlock } from '@/layouts/skeletons'
import { useToast } from '@/components/atoms/use-toast'

interface AppChartProps<T = any> {
    initialData: Array<T>
    fetchFunction: (range?: DateRangePickerValue) => Promise<Array<T>>
    title: string
    lines: Array<string>
    colors: Array<Color>
    index: string
}

export default function AppLineChart(props: AppChartProps) {
  const { title, initialData, fetchFunction, lines, colors, index } = props 
  const { toast } = useToast()
  const [chart_data, set_chart_data] = useState(initialData ?? [])
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
        const data = await fetchFunction(range)

        set_chart_data(data)

    }
    catch (e)
    {
        toast({
            title: "Oops!!",
            description: "Something went wrong fetching the chart data. Please try again",
            variant: "destructive",
            duration: 3000
        })
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
                {title}
            </Title>
            { 
                loading ? <SkeletonBlock className='w-full h-[30vh]' /> :
                <LineChart
                    data={chart_data}
                    index={index}
                    categories={lines}
                    colors={colors}
                />
            }
        </Card>
    </div>
  )
}