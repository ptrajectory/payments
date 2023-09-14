import db from "db"
import { formatChartDate, getAllDaysBetweenDates, get_today_end, get_today_start, isSameDate, isSameHour } from "@/lib/utils"
import { CUSTOMER, PAYMENT } from "db/schema"
import { and, eq, gt, lt, sql } from "db/utils"
import { isNull } from "lodash"
import { NextResponse } from "next/server"
import { generate_dto } from "generators"
import dayjs from "dayjs"
import { auth } from "@clerk/nextjs"





export const GET = async (request: Request) => {

    const { userId, user } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"))

    const { searchParams } = new URL(request.url)

    const { from = get_today_start().toISOString(), to = get_today_end().toISOString(), customer_id} = {
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
        customer_id: searchParams.get("customer_id"),
    }

    if(isNull(customer_id)) return NextResponse.json(generate_dto(null," Customer ID is empty ", "error"))

    const graph_time_range = getAllDaysBetweenDates(from, to)



    try {

        const data = await db.select({
            id: PAYMENT.id,
            number_of_purchases: sql<number>`count(${PAYMENT.id})`.mapWith(Number),
            amount_purchased: sql<number>`sum(${PAYMENT.amount})`.mapWith(Number),
            day: PAYMENT.created_at
        }).from(PAYMENT)
        .innerJoin(CUSTOMER, eq(CUSTOMER.id, PAYMENT.id)) 
        .where(
            and(
                eq(CUSTOMER.id, customer_id),
                gt(PAYMENT.created_at, new Date(from)),
                lt(PAYMENT.created_at, new Date(to))
            )
        )
        .groupBy(PAYMENT.id)



        const categorized_data = graph_time_range?.val?.map((time)=>{

            const aggregate_number_of_purchases = data?.reduce((prev,customer_data)=>{
                
                if(graph_time_range.is_same_date) {

                    if(isSameHour(time, customer_data?.day ?? new Date())) return prev + (customer_data?.number_of_purchases ?? 0)

                    return prev
                }

                if(isSameDate(time, customer_data.day ?? new Date())) return prev + (customer_data?.number_of_purchases ?? 0)

                return prev
            }, 0)


            const aggregate_amount_purchased = data?.reduce((prev,customer_data)=>{
                
                if(graph_time_range.is_same_date) {

                    if(isSameHour(time, customer_data?.day ?? new Date())) return prev + (customer_data?.amount_purchased ?? 0)

                    return prev
                }

                if(isSameDate(time, customer_data.day ?? new Date())) return prev + (customer_data?.amount_purchased ?? 0)

                return prev
            }, 0)


            return {
                day: formatChartDate({
                    date: time,
                    is_same_date: graph_time_range?.is_same_date,
                    from,
                    to
                }),
                number_of_purchases: aggregate_number_of_purchases,
                amount_purchased: aggregate_amount_purchased
            }

        })


        return NextResponse.json(generate_dto(categorized_data, "chart data fetched", "success"))

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"))
    }



}