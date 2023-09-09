import db from "db"
import payments from "@/lib/resources/payments"
import { auth } from "@clerk/nextjs"
import { generate_dto } from "generators"
import { isEmpty, isNull, isString, isUndefined } from "lodash"
import { NextResponse } from "next/server"
import { and, eq } from "db/utils"
import { CUSTOMER } from "db/schema"
import { stringifyDatesInJSON } from "@/lib/utils"



export const GET = async  (request: Request,
    params: { customer_slug?: string[] }
    ) => {
    
    const { customer_slug } = params

    const { userId, user } = auth()

    console.log("Here is the USER ID::", userId)

    if(isEmpty(userId) || isUndefined(userId)) return NextResponse.json(generate_dto(null, "UNAUTHORIZED", 'error'), {
        status: 401
    })

    // const body = await request.json()
    console.log("Verified ID", userId)

    
    const { searchParams } = new URL(request.url)

    const { page = "1", size = "10", store_id } = {
        page: searchParams.get("page") ?? undefined,
        size: searchParams.get("size") ?? undefined,
        store_id: searchParams.get("store_id") ?? undefined
    }

    const customer_id = customer_slug?.at(0)

    if(!isUndefined(customer_id)) {

        try {
            const customer = await payments.customer?.getCustomer(customer_id)

            console.log("CUSTOMERS::", customer)

            return NextResponse.json(generate_dto(stringifyDatesInJSON(customer), "success", "success"), {
                status: 200
            })

        }
        catch (e)
        {
            console.log("SOME ERROR::",e)
            return NextResponse.json(generate_dto( null, "Something went wrong", "error"), {
                status: 500
            })

        }


    }

    if(!isString(store_id) || isEmpty(store_id)) return NextResponse.json(
        generate_dto(null, "STORE ID NOT SPECIFIED", "error"),
        {
            status: 400
        }
    ) 


    try {
        const customers = await db.query.CUSTOMER.findMany({
            where: (cus, { eq, and }) => and(
                eq(cus.store_id, store_id),
            ),
            orderBy: CUSTOMER.created_at,
            columns: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                created_at: true
            },
            limit: Number(size),
            offset: (Number(page) - 1) * Number(size)
        })

        console.log("CUSTOMERS::", customers)

        return NextResponse.json(generate_dto(customers || [], "success", "success"), {
            status: 200
        })

    }
    catch (e)
    {
        console.log("ERROR::", e)

        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })

    }
    


}

export const POST = async (request: Request) => {

    const body = await request.json()

    try {

        const customer = await payments.customer?.createCustomers(body)

        return NextResponse.json(generate_dto(customer, "New customer created", "success"), {
            status: 201
        })
    }   
    catch (e)
    {
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"), {
            status: 500
        })
    }

}

export const PUT = async (request: Request, params: { customer_slug: string }) => {
    const { customer_slug } = params

    const customer_id = customer_slug.at(0)

    if(!isString(customer_id) || isEmpty(customer_id)) return NextResponse.json(generate_dto(null, "Customer ID is required", "error"))

    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), { status: 401 })

    const body = await request.json()


    try {
        const customer = await payments.customer?.updateCustomer(customer_id, body)

        return NextResponse.json(generate_dto(customer, "Success", "success"))
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null || e, "Something went wrong ", "error"))
    }
}