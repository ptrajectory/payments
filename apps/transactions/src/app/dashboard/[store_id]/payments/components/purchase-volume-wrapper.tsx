"use server"
import { formatChartDate, getAllDaysBetweenDates, get_today_end, get_today_start, isSameDate, isSameHour } from "@/lib/utils"
import db from "db"
import { PAYMENT } from "db/schema"
import { and, eq, gt, lt } from "db/utils"
import PurchaseVolumeChart from "./purchase-volume-chart"




const getPurchaseVolumeData = async (store_id: string) => {
    const from = get_today_start()
    const to = get_today_end()
    const graph_time_range = getAllDaysBetweenDates(from, to)

    try {

        const store = (await db.query.STORE.findFirst({
            where: (str, {eq}) => and(  eq(str.id, store_id) ),
            columns: {
                environment: true
            }
        })) ?? null

        const results = (await db.select({
            amount: PAYMENT.amount,
            day: PAYMENT.created_at,
            status: PAYMENT.status
        }).from(PAYMENT)
        .where(
            and(
                eq(PAYMENT.store_id, store_id),
                eq(PAYMENT.environment, store?.environment),
                gt(PAYMENT.created_at, new Date(from)),
                lt(PAYMENT.created_at, new Date(to))
            )
        )) ?? []

        
        const categorized_payment_data =  graph_time_range.val?.map((date)=>{

            const aggregate_successful_payments = results?.filter(({status})=>status === "SUCCESS")?.reduce((prev, cur)=>{


                    if(graph_time_range.is_same_date){

                        if(isSameHour(cur?.day, date)){
                            return prev + (cur?.amount ?? 0)
                        }

                        return prev
                    }

                    if(isSameDate(date, cur?.day)) {
                        return prev + (cur?.amount ?? 0)
                    }

    
                return prev

            }, 0)



            const aggregate_failed_payments = results?.filter(({status})=>status === "FAILED")?.reduce((prev, cur)=>{


                    if(graph_time_range.is_same_date){

                        if(isSameHour(cur?.day, date)){
                            return prev + (cur?.amount ?? 0)
                        }

                        return prev
                    }

                    if(isSameDate(date, cur?.day)) {
                        return prev + (cur?.amount ?? 0)
                    }


                return prev

            }, 0)


            return {
                day: formatChartDate({
                    date,
                    from,
                    to,
                    is_same_date: graph_time_range.is_same_date
                }),
                "Successful Payments": aggregate_successful_payments,
                "Failed Payments": aggregate_failed_payments
            }

            

        })


        return categorized_payment_data


    }
    catch (e)
    {
        //TODO: handle error better
        return []
    }
}


export default async function PurchaseVolumeServerWrapper (props: { store_id: string }){
    const { store_id } = props
    const data = await getPurchaseVolumeData(store_id)

    return (
        <PurchaseVolumeChart
            initialData={data}
        />
    )
}