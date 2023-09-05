import db from "db"
import payments from "@/lib/resources/payments"
import { auth } from "@clerk/nextjs"
import { generate_dto } from "generators"
import { isEmpty, isNull, isString } from "lodash"
import { NextResponse } from "next/server"
import { eq } from "db/utils"
import { PRODUCT } from "db/schema"




export const GET = async (request: Request, {params}:{params: { products_slug: Array<string>  }}) => {

    const { products_slug } = params
    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error")) 

    const product_id = products_slug?.at(0)

    const { searchParams: query } = new URL(request.url)


    const { page = "1", size = "10", store_id } = {
        page: query.get("page") ?? undefined,
        size: query.get("size") ?? undefined,
        store_id: query.get("store_id")
    }


    if(isString(product_id) && !isEmpty(product_id) ){

        try{
            const product = await payments.customer?.getCustomer(product_id)

            return NextResponse.json(generate_dto(product, "Success", "success"))

        }
        catch (e)
        {
            return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"))
        }
        
    }


    if(!isString(store_id) || isEmpty(store_id)) return NextResponse.json(generate_dto(null, "STORE ID IS REQUIRED", "error"))

    try {

        const products = await db.query.PRODUCT.findMany({
            where: eq(PRODUCT.store_id, store_id),
            orderBy: PRODUCT.created_at,
            columns: {
                id: true,
                name: true,
                image: true,
                description: true,
                price: true,
                store_id: true
            },
            limit: Number(size),
            offset: (Number(page) - 1) * Number(size)
        })

        return NextResponse.json(generate_dto(products, "success", "error"))

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error")) 
    }   

    


}

export const POST = async (request: Request) => {

    const body = await request.json()

    const { userId } = auth() 

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"))

    try {
        const product = await payments.product?.createProduct(body)

        return NextResponse.json(generate_dto(product, "success", "success"))
    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e || null, "Something went wrong", "error"))
    }


}

export const PUT = async (request: Request, params: { products_slug: Array<string>  }) => {

    const body = await request.json()

    const { products_slug } = params

    const product_id = products_slug.at(0)

    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"))

    if(!isString(product_id)) return NextResponse.json(generate_dto(null, "Product ID cannt be empty", "error"))


    try {

        const product = await payments.product?.updateProduct(product_id, body)

        return NextResponse.json(generate_dto(product, "Successfully updated", "success"))

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(e, "Something went wrong", "error"))
    }

}