import { stringifyDatesInJSON } from "@/lib/utils"
import { auth } from "@clerk/nextjs"
import db from "db"
import { PAYMENT } from "db/schema"
import { generate_dto } from "generators"
import { isEmpty, isNull, isString, isUndefined } from "lodash"
import { NextResponse } from "next/server"



export const GET = async  (request: Request,
    props: {params: { payment_slug?: string[] }}
    ) => {
    
    const { payment_slug } = props.params

    const { userId, user } = auth()

    if(isEmpty(userId) || isUndefined(userId)) return NextResponse.json(generate_dto(null, "UNAUTHORIZED", 'error'), {
        status: 401
    })

    
    const { searchParams } = new URL(request.url)

    const { page = "1", size = "10", store_id } = {
        page: searchParams.get("page") ?? undefined,
        size: searchParams.get("size") ?? undefined,
        store_id: searchParams.get("store_id") ?? undefined
    }

    const payment_id = payment_slug?.at(0)


    if(!isUndefined(payment_id)){


        try {
            const payment  = (await db.query.PAYMENT.findFirst({
                where: (pm, {eq}) => eq(pm.id, payment_id),
                columns: {
                    id: true,
                    status: true,
                    created_at: true,
                    amount: true
                },
                with: {
                    payment_method: true,
                    customer: true,
                    checkout: true
                }
            })) ?? null


            if(isNull(payment)) return NextResponse.json(generate_dto(null, "Not found", "error"), {
                status: 404
            })

            return NextResponse.json(generate_dto(stringifyDatesInJSON(payment), "Success", "success"))

        }       
        catch (e)
        {
            return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
                status: 500
            })
        }

    }


    if(!isEmpty(store_id)) {

        try {
            const payments = (await db.query.PAYMENT.findMany({
                where: (pm, {eq}) => eq(pm.store_id, store_id),
                columns: {
                    id: true,
                    status: true,
                    created_at: true,
                    amount: true
                },
                with: {
                    payment_method: true,
                    customer: true,
                    checkout: true
                },
                orderBy: PAYMENT.created_at,
                limit: Number(size),
                offset: ( Number(page) - 1 ) * Number(size)
            })) ?? []

            return NextResponse.json(generate_dto(stringifyDatesInJSON(payments), "Success", "success"))

        }
        catch (e)
        {
            return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
                status: 500
            })
        }



    }


    return NextResponse.json(generate_dto(null, "No Specifier used", "error"), {
        status: 405
    })
    


}