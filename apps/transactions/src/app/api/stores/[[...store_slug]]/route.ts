import db from "db"
import { auth } from "@clerk/nextjs"
import { generate_dto, generate_unique_id } from "generators"
import { isNull, isUndefined } from "lodash"
import { NextResponse } from "next/server"
import { CUSTOMER, PRODUCT, STORE } from "db/schema"
import payments from "@/lib/resources/payments"
import { SELLER } from "zodiac"
import { eq, sql } from "db/utils"




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
    let user: any
    
    
    
    try{
        user = await db.query.SELLER.findFirst({
            where: (seller, {eq}) => eq(seller.uid, userId)
        })
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }

    if(!isUndefined(store_id)) {
        try {
    
            const store = await db.query.STORE.findFirst({
                where: (store, { eq, and }) => and(
                    eq(store.id, store_id),
                    eq(store.seller_id, user.id)
                )
            })

            return NextResponse.json(generate_dto(store, "success", "success"))
    
        }
        catch (e)
        {
            console.log("SOMETHING WENT WRONG::",e)
            return NextResponse.json(generate_dto(null, "Something went wrong", "error"))
        }

    }
    

    if(isUndefined(user)) return NextResponse.json(generate_dto(null, "USER DOES NOT EXIST", "error"))
    

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
        .where(eq(STORE.seller_id, user?.id))
        .groupBy(STORE.id)
        .limit(Number(size))
        .offset((Number(page) - 1) * Number(size))
        
    
        return NextResponse.json(generate_dto(stores, "success", "success"),{
            status: 200
        })
    }
    catch (e)
    {
        console.log('SOMETHING WENT WRONG::', e)

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


    const { userId } = auth()
    
    
    if(isNull(userId)) return NextResponse.json(generate_dto(null, "UNAUTHORIZED", "error"), { status: 401 })


    let user: SELLER | null = null 

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

        const new_store = await db.insert(STORE).values({
            ...body,
            id: generate_unique_id("str"),
            seller_id: user?.id,
            created_at: new Date(),
            updated_at: new Date()
        })


        return NextResponse.json(generate_dto(new_store, "success", "success"), {
            status: 201
        })

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }

}


