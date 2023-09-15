import { formatChartDate, getAllDaysBetweenDates, get_today_end, get_today_start, isSameDate, isSameHour } from "@/lib/utils"
import { auth } from "@clerk/nextjs"
import db from "db"
import { PAYMENT } from "db/schema"
import { and, eq, gt, lt } from "db/utils"
import { generate_dto } from "generators"
import { isNull } from "lodash"
import { NextResponse } from "next/server"






export const GET = async (request: Request) => {

    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), {
        status: 401
    })


    const { searchParams } = new URL(request.url)


    const { from = get_today_start().toISOString(), to = get_today_end().toISOString(), store_id} = {
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
        store_id: searchParams.get("store_id"),
    }



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


        return NextResponse.json(generate_dto(categorized_payment_data, "Successful ", "success"), {
            status: 200
        })


    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e, "Something went wrong", "error"))
    }



    


}