import db from "db"
import { auth } from "@clerk/nextjs"
import { generate_dto, generate_unique_id } from "generators"
import { isEmpty, isNull, isString, isUndefined } from "lodash"
import { NextResponse } from "next/server"
import { and, eq } from "db/utils"
import { CUSTOMER, STORE } from "db/schema"
import { stringifyDatesInJSON } from "@/lib/utils"
import { customer as schema } from "zodiac"



export const GET = async  (request: Request,
    params: { customer_slug?: string[] }
    ) => {
    
    const { customer_slug } = params

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

    const customer_id = customer_slug?.at(0)

    if(!isUndefined(customer_id)) {

        try {
            const customer = await db.query.CUSTOMER.findFirst({
                where: (cus, {eq}) => eq(cus.id, customer_id),
                columns: {
                    email: true,
                    first_name: true,
                    last_name: true,
                    id: true
                }
            })


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
        const customers = await db.select({
            id: CUSTOMER.id,
            first_name: CUSTOMER.first_name,
            last_name: CUSTOMER.last_name,
            email: CUSTOMER.email,
            created_at: CUSTOMER.created_at
        }).from(CUSTOMER)
        .innerJoin(STORE, eq(STORE.id, CUSTOMER.store_id))
        .where(and(eq(STORE.id, store_id), eq(STORE.environment, CUSTOMER.environment)))
        .orderBy(CUSTOMER.created_at)
        .limit(Number(size))
        .offset((Number(page)  - 1) * Number(size))

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

    const parsed = schema.safeParse(body)

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"), {
        status: 400
    })

    const data = parsed.data

    console.log("Incoming data::", data)

    try {

        const store = await db.select({environment: STORE.environment}).from(STORE).where(eq(STORE.id, body.store_id))
        
        const customer = await db.insert(CUSTOMER).values({
            ...data,
            id: generate_unique_id("cus"),
            environment: store?.at(0)?.environment ?? "testing",
            updated_at: new Date(),
            created_at: new Date()
        }).returning({
            id: CUSTOMER.id,
            email: CUSTOMER.email,
            first_name: CUSTOMER.first_name,
            last_name: CUSTOMER.last_name
        })
        

        return NextResponse.json(generate_dto(customer, "New customer created", "success"), {
            status: 201
        })
    }   
    catch (e)
    {
        console.log("ERROR:",e)
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"), {
            status: 500
        })
    }

}

export const PUT = async (request: Request, reqProps:{ params: { customer_slug: string }}) => {
    const { params } = reqProps

    const customer_id = params.customer_slug?.at(0)

    if(!isString(customer_id) || isEmpty(customer_id)) return NextResponse.json(generate_dto(null, "Customer ID is required", "error"), { status: 400 })

    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), { status: 401 })

    const body = await request.json()


    const parsed = schema.safeParse(body)

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"), { status: 400 })

    const data = parsed.data
    


    try {
        const customer = ((await db.update(CUSTOMER).set(data).where(eq(CUSTOMER.id, customer_id)).returning()) ?? [])?.at(0) ?? null

        return NextResponse.json(generate_dto(customer, "Success", "success"))
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null || e, "Something went wrong ", "error"))
    }
}