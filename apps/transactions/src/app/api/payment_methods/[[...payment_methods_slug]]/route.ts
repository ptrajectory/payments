import db from "db"
import { auth } from "@clerk/nextjs"
import { generate_dto, generate_unique_id } from "generators"
import { isEmpty, isNull, isString } from "lodash"
import { NextResponse } from "next/server"
import { stringifyDatesInJSON } from "@/lib/utils"
import { PAYMENT_METHOD } from "db/schema"
import { payment_method } from "zodiac"




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

    const [payment_method_id] = payment_methods_slug ?? []

    const { searchParams: query } = new URL(request.url)

    const { page = "1", size = "10", customer_id } = {
        page: query.get("page") ?? undefined,
        size: query.get("size") ?? undefined,
        customer_id: query.get("customer_id")
    }


    if(isString(payment_method_id) && !isEmpty(payment_method_id)) {


        try {

            const payment_method = await db.query.PAYMENT_METHOD.findFirst({
                where: (pm, { eq }) => eq(pm.id, payment_method_id),
                columns: {
                    id: true,
                    type: true,
                    customer_id: true,
                    status: true,
                    phone_number: true,
                    environment: true
                },
                orderBy: PAYMENT_METHOD.created_at
            })

            return NextResponse.json(generate_dto(payment_method ?? null, "success", "success")) 
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


export const POST = async (request: Request, {params}:{params: {payment_methods_slug: Array<string>}}) => {
    const { userId } = auth() 

    if(isNull(userId)) return NextResponse.json(
        generate_dto(
            null,
            "Unauthorized",
            "error"
        ),
        {
            status: 401
        }
    )

    const body = await request.json()

    const parsed = payment_method.safeParse(body)

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "body Invalid", "error"), { status: 400 })

    try{
        const store = (await db.query.STORE.findFirst({
            where: (str, {eq}) => eq(str.id, body.store_id),
            columns: {
                environment: true
            }
        })) ?? null 

        const result = await db.insert(PAYMENT_METHOD).values({
            id: generate_unique_id("pm"),
            ...body,
            created_at: new Date(),
            updated_at: new Date(),
            environment: store?.environment ?? "testing"
        }).returning({
            id: PAYMENT_METHOD.id
        })

        return NextResponse.json(generate_dto(result?.at(0), "Success", "success"), {
            status: 201
        })

    }
    catch (e)
    {
        // TODO: better error handling

        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }
}