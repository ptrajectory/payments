'use server'

import { getAllDaysBetweenDates, get_today_end, get_today_start, isSameDate, isSameHour } from "@/lib/utils"
import db from "db"
import { DateRangePickerValue } from "@tremor/react"
import { PAYMENT } from "db/schema"
import { and, eq, gt, lt } from "db/utils"
import { PAYMENT as tPAYMENT } from "zodiac"
import dayjs from "dayjs"

export type ChartData = {
    total_amount_spent?: number
    day: number | string | Date
}


export const fetch_home_daily_purchases_chart_data= async (store_id: string, range: Partial<{from: string, to: string}> | undefined ): Promise<Array<ChartData>>  => {

    try {

        const store = await db.query.STORE.findFirst({
            where: (str, {eq}) => eq(str.id, store_id),
            columns: {
                environment: true 
            }
        })

        // vvalidate the start and end dates
        const { from = get_today_start().toISOString(), to = get_today_end().toISOString() } = range ? range : {}
    
        // get all the payments between those dates
    
        let all_payments: Array<tPAYMENT & { created_at?: string }> | null = (await db.select().from(PAYMENT).where(
            and(
                gt(PAYMENT.created_at, new Date(from)),
                lt(PAYMENT.created_at, new Date(to)),
                eq(PAYMENT.environment, store?.environment),
                eq(PAYMENT.store_id, store_id)
            ),
        )) ?? null
    
        const date_categories = getAllDaysBetweenDates(from, to)
    
        // transform the data into a format that can go into the chart
    
        const date_categorized_chart_data = date_categories?.val?.map((date)=>{
    
            const payment_aggregation = all_payments?.reduce((prev, cur, i)=>{
    
                if(date_categories?.is_same_date) {
                    if(isSameHour(date, cur.created_at ?? new Date())) return prev + (cur?.amount ?? 0)
    
                    return prev + 0
                }
    
                if(isSameDate(date, cur.created_at ?? new Date())) return prev + (cur?.amount ?? 0)
    
                return prev + 0
            }, 0) ?? 0
    
    
            return {
                day: dayjs(date).format(
                    date_categories?.is_same_date ? "hh A" :"MMM D"
                ),
                total_amount_spent: payment_aggregation
            }
    
        })
    
        return date_categorized_chart_data
    }
    catch (e)
    {
        //TODO: add better error handling
        return []
    }

}