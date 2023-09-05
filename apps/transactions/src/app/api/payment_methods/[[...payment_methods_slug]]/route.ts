import db from "db"
import payments from "@/lib/resources/payments"
import { auth } from "@clerk/nextjs"
import { generate_dto } from "generators"
import { isEmpty, isNull, isString } from "lodash"
import { NextResponse } from "next/server"
import { stringifyDatesInJSON } from "@/lib/utils"
import { PAYMENT_METHOD } from "db/schema"




// TODO: ADDD IN BETTER ERROR HANDLING
export const GET = async (request: Request, {params}:{params: {payment_methods_slug: Array<string>}}) => {

    const { userId } = auth() 

    if(isNull(userId)) return NextResponse.json(
        generate_dto(
            null,
            "Something went wrong",
            "error"
        )
    )

    const { payment_methods_slug } = params

    const [payment_method_id] = payment_methods_slug

    const { searchParams: query } = new URL(request.url)

    const { page = "1", size = "10", customer_id } = {
        page: query.get("page") ?? undefined,
        size: query.get("size") ?? undefined,
        customer_id: query.get("customer_id")
    }


    if(isString(payment_method_id) && !isEmpty(payment_method_id)) {


        try {

            const payment_method = await payments.payment_method?.getPaymentMethod(payment_method_id)

            return NextResponse.json(generate_dto(payment_method, "success", "success")) 
        }
        catch (e)
        {
            return NextResponse.json(generate_dto(null, "SOMETHING WENT WRONG", "error"), {
                status: 500
            })
        }

    }

    if(isNull(customer_id)) return NextResponse.json(generate_dto(null, "CUSTOMER REQUIRED", "error"),{
        status: 400
    })


    try {

        const payment_methods = await db.query.PAYMENT_METHOD.findMany({
            where: (pms, {eq}) => eq(pms.customer_id, customer_id),
            limit: Number(size),
            offset: (Number(page) - 1) * Number(size),
            orderBy: PAYMENT_METHOD.created_at
        })

        return NextResponse.json(generate_dto(stringifyDatesInJSON(payment_methods), "Success", "success"), {
            status: 200
        })

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "SOMETHING WENT WRONG", "error"), {
            status: 500
        })
    }


    

}