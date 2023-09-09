import { formatChartDate, getAllDaysBetweenDates, get_today_end, get_today_start, isSameDate, isSameHour, stringifyDatesInJSON } from "@/lib/utils"
import { auth } from "@clerk/nextjs"
import { generate_dto } from "generators"
import { isNull } from "lodash"
import { NextResponse } from "next/server"
import db from "db"
import { CART, CART_ITEM, CHECKOUT, PAYMENT, PRODUCT } from "db/schema"
import { and, eq, gt, lt, sql } from "db/utils"



export const GET = async (request: Request) => {

    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"))

    const { searchParams: query } = new URL(request.url)

    const { from = get_today_start().toISOString(), to = get_today_end().toISOString(), product_id} = {
        from: query.get("from") ?? undefined,
        to: query.get("to") ?? undefined,
        product_id: query.get("product_id")
    }

    if(isNull(product_id)) return NextResponse.json(generate_dto(null, "MISSING PRODUCT ID", "error"))

    try{

        const time_range_categories = getAllDaysBetweenDates(from, to)


        const data = await db.select({
            number_of_purchases: sql<number>`count(${PAYMENT.id})`,
            amount_purchased: sql<number>`sum(${PAYMENT.amount})`,
            day: PAYMENT.created_at
        }).from(PAYMENT)
        .innerJoin(CHECKOUT, eq(CHECKOUT.id, PAYMENT.checkout_id))
        .innerJoin(CART, eq(CART.id, CHECKOUT.cart_id))
        .innerJoin(CART_ITEM, eq(CART_ITEM.cart_id, CART.id))
        .where(and(
            eq(CART_ITEM.product_id, product_id),
            gt(PAYMENT.created_at, new Date(from)),
            lt(PAYMENT.created_at, new Date(to)) 
        ))
        .groupBy(PAYMENT.id)


        const chart_data = time_range_categories.val?.map((time)=>{

            const aggregate_of_total_purchases = data?.reduce((prev, cur)=>{

                if(time_range_categories?.is_same_date){
                    if(isSameHour(cur?.day, time)){
    
                        return prev + (cur?.number_of_purchases ?? 0)
    
                    }

                    return prev
                }

                if(isSameDate(cur?.day, time)) {

                    return prev + (cur?.number_of_purchases ?? 0) 
                }


                return prev
            }, 0)


            const aggregate_of_amount_spent = data?.reduce((prev, cur)=>{

                if(time_range_categories?.is_same_date){

                    if(isSameHour(cur?.day, time)) {
                        return prev + (cur?.amount_purchased ?? 0)
                    }

                    return prev
                }

                if(isSameDate(cur?.day, time)){

                    return prev + (cur?.amount_purchased ?? 0)
                }

                return prev

            }, 0)


            return {
                number_of_purchases: aggregate_of_total_purchases ?? 0,
                amount_purchased: aggregate_of_amount_spent ?? 0,
                day: formatChartDate({
                    from,
                    to,
                    is_same_date: time_range_categories.is_same_date,
                    date: time
                })
            }

        })

        return NextResponse.json(generate_dto(stringifyDatesInJSON(chart_data), "success", "success"), {
            status: 200
        })
        

    }
    catch (e)
    {
        console.log("SOMETHING WENT WRONG::", e)
        // TODO: better error handling
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"), {
            status: 500
        })
    }
    


}