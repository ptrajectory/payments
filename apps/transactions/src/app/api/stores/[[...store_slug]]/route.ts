import db from "db"
import { auth } from "@clerk/nextjs"
import { generate_dto, generate_unique_id } from "generators"
import { isNull, isString, isUndefined } from "lodash"
import { NextResponse } from "next/server"
import { CUSTOMER, PRODUCT, SELLER, STORE } from "db/schema"
import { SELLER as tSELLER, store as schema } from "zodiac"
import { and, eq, sql } from "db/utils"




// TODO: better error handling
export const GET = async (request: Request, {params}:{params: { store_slug: Array<string> }}) => {

    const { store_slug } = params

    const { userId } = auth() 

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "UNAUTHORIZED", "error"), {
        status: 401
    })

    const [ store_id ] = store_slug

    
    const { searchParams: query } = new URL(request.url)
    
    const { page = "1", size = "10" } = {
        page: query.get("page") ?? undefined,
        size : query.get("size") ?? undefined
    }
    

    if(!isUndefined(store_id)) {
        try {
    
            const store = await db.select({
                id: STORE.id,
                name: STORE.name,
                customers: sql<number>`count(distinct ${CUSTOMER.id})`.mapWith(Number),
                products: sql<number>`count(distinct ${PRODUCT.id})`.mapWith(Number),
                image: STORE.image,
                description: STORE.description,
                environment: STORE.environment
            })
            .from(STORE)
            .leftJoin(PRODUCT, eq(PRODUCT.store_id, STORE.id))
            .leftJoin(CUSTOMER, eq(CUSTOMER.store_id, STORE.id))
            .leftJoin(SELLER, eq(SELLER.id,  STORE.seller_id))
            .where(and(eq(STORE.id, store_id),eq(SELLER.uid, userId)))
            .groupBy(STORE.id)
            .limit(1)

            return NextResponse.json(generate_dto(store?.at(0), "success", "success"))
    
        }
        catch (e)
        {
            return NextResponse.json(generate_dto(null, "Something went wrong", "error"))
        }

    }
    
    

    try{
        const stores = await db.select({
            id: STORE.id,
            name: STORE.name,
            customers: sql<number>`count(distinct ${CUSTOMER.id})`.mapWith(Number),
            products: sql<number>`count(distinct ${PRODUCT.id})`.mapWith(Number),
            image: STORE.image,
            description: STORE.description
        })
        .from(STORE)
        .innerJoin(PRODUCT, eq(PRODUCT.store_id, STORE.id))
        .innerJoin(CUSTOMER, eq(CUSTOMER.store_id, STORE.id))
        .innerJoin(SELLER, eq(SELLER.id,  STORE.seller_id))
        .where(eq(SELLER.uid, userId))
        .groupBy(STORE.id)
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size))
        
    
        return NextResponse.json(generate_dto(stores, "success", "success"),{
            status: 200
        })
    }
    catch (e)
    {

        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }

}



export const POST = async (request: Request) => {

    let body: any 

    try {
        body = await request.json()
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "Unable to read the request body", "error"), {
            status: 400
        })
    }

    const parsed = schema.safeParse(body) 

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"), {
        status: 400
    })


    const { userId, sessionId } = auth()
    
    
    if(isNull(userId)) return NextResponse.json(generate_dto(null, "UNAUTHORIZED", "error"), { status: 401 })


    let user: tSELLER | null = null 

    try {
        user = (await db.query.SELLER.findFirst({
            where: (sell, {eq}) => eq(sell.uid, userId)
        })) ?? null
    }
    catch (e) 
    {
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"))
    }


    if(isNull(user)) return NextResponse.json(generate_dto(null, "USER NOT FOUND", "error"), {
        status: 401
    })


    try {

        const result = await fetch(`${process.env.API_HOST}/api/stores`, {
            method: "POST",
            headers: {
                "x-session-id": sessionId ?? "",
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const data = await result.json()
        if(result.ok) {
            return NextResponse.json(generate_dto(data.data, "success", "success"), {
                status: 201
            })
        }

        return NextResponse.json(data, {
            status: result.status
        })

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }

}


export const PUT = async (request: Request, props: { params: { store_slug: string[] } }) => {


    const { store_slug } = props.params

    const store_id = store_slug?.at(0) ?? undefined

    let body: any 

    try {
        body = await request.json()
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "Unable to read the request body", "error"), {
            status: 400
        })
    }

    const parsed = schema.safeParse(body) 

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"), {
        status: 400
    })


    const { userId, sessionId } = auth()
    
    
    if(isNull(userId)) return NextResponse.json(generate_dto(null, "UNAUTHORIZED", "error"), { status: 401 })


    let user: tSELLER | null = null 

    try {
        user = (await db.query.SELLER.findFirst({
            where: (sell, {eq}) => eq(sell.uid, userId)
        })) ?? null
    }
    catch (e) 
    {
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"))
    }


    if(isNull(user)) return NextResponse.json(generate_dto(null, "USER NOT FOUND", "error"), {
        status: 401
    })

    if(!isString(store_id)) return NextResponse.json(generate_dto(null, "STORE ID INVALID", "error"), {
        status: 400
    })


    try {

        const result = await db.update(STORE).set(parsed.data).where(eq(STORE.id, store_id)).returning()

        return NextResponse.json(generate_dto(result.at(0) ?? null, "Success", "success"), {
            status: 200
        })
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }

}


