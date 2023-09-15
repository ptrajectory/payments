import db from "db"
import { auth } from "@clerk/nextjs"
import { generate_dto, generate_unique_id } from "generators"
import { isEmpty, isNull, isString } from "lodash"
import { NextResponse } from "next/server"
import { and, eq } from "db/utils"
import { PRODUCT, STORE } from "db/schema"
import { product as schema } from "zodiac"




export const GET = async (request: Request, props:{params: { products_slug: Array<string>  }}) => {

    const { products_slug } = props.params
    const { userId } = auth()


    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), {
        status: 401
    }) 

    const product_id = products_slug?.at(0)

    const { searchParams: query } = new URL(request.url)


    const { page = "1", size = "10", store_id } = {
        page: query.get("page") ?? undefined,
        size: query.get("size") ?? undefined,
        store_id: query.get("store_id")
    }


    if(isString(product_id) && !isEmpty(product_id) ){

        try{
            const product = await db.query.PRODUCT.findFirst({
                where: (prd, {eq}) => eq(prd.id, product_id)
            }) 

            return NextResponse.json(generate_dto(product ?? null, "Success", "success"), {
                status: 200
            })

        }
        catch (e)
        {
            return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"), {
                status: 500
            })
        }
        
    }


    if(!isString(store_id) || isEmpty(store_id)) return NextResponse.json(generate_dto(null, "STORE ID IS REQUIRED", "error"))

    try {

        const products = await (await db.select({
            id: PRODUCT.id,
            name: PRODUCT.name,
            price: PRODUCT.price,
            image: PRODUCT.image,
            created_at: PRODUCT.created_at,
            store_id: PRODUCT.store_id,
            description: PRODUCT.description
        }).from(PRODUCT)
        .innerJoin(STORE, eq(STORE.id, PRODUCT.store_id))
        .where(and(eq(STORE.id, store_id), eq(STORE.environment, PRODUCT.environment)))
        .orderBy(PRODUCT.created_at)
        .limit(Number(size))
        .offset( (Number(page) - 1) * Number(size) ))

        return NextResponse.json(generate_dto(products, "success", "error"), {
            status: 200
        })

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"), {
            status: 500
        }) 
    }   

    


}

export const POST = async (request: Request) => {

    const body = await request.json()

    const { userId } = auth() 

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), {
        status: 401
    })

    const parsed = schema.safeParse(body)

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"), {
        status: 400
    })

    try {

        const data = parsed.data;

        const store_env = await db?.query.STORE.findFirst({where: (str, {eq})=>eq(str.id, body.store_id), columns: { environment: true }})

        const product = await db?.insert(PRODUCT)?.values({
            ...data,
            environment: store_env?.environment ?? "testing",
            id: generate_unique_id("pro"),
            created_at: new Date(),
            updated_at: new Date()
        })

        return NextResponse.json(generate_dto(product, "success", "success"), {
            status: 200
        })
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"), {
            status: 500
        })
    }


}

export const PUT = async (request: Request, props: {params: { products_slug: Array<string>  }}) => {

    const body = await request.json()

    const { products_slug } = props.params

    const product_id = products_slug?.at(0)

    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), {
        status: 401
    })

    if(!isString(product_id)) return NextResponse.json(generate_dto(null, "Product ID cannt be empty", "error"), {
        status: 400
    })

    const parsed = schema.safeParse(body)

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"), {
        status: 400
    })

    try {

        const data = parsed.data;

        const product = await db.update(PRODUCT).set(data)
        .where(eq(PRODUCT.id, product_id))

        return NextResponse.json(generate_dto(product, "Successfully updated", "success"))

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e, "Something went wrong", "error"))
    }

}