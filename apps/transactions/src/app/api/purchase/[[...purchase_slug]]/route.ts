import payments from "@/lib/resources/payments"
import { generate_dto } from "generators"
import { isArray, isUndefined } from "lodash"
import { NextResponse } from "next/server"
import { CUSTOMER, PAYMENT_METHOD } from "zodiac"





export const GET = async (request: Request, { params }: {params: { purchase_slug: Array<string> }}) => {
    console.log("PARAMS",params)
    const { purchase_slug } = params

    console.log("PURCHASE SLUG", purchase_slug)

    const [payment_id] = isArray(purchase_slug)  ? purchase_slug : []

    if(isUndefined(payment_id)) return NextResponse.json(generate_dto(null, "PAYMENT ID IS REQUIRED", "error"))

    try {

        const payment_status = await payments.payment?.confirmPayment(payment_id)

        return NextResponse.json(
            generate_dto(payment_status, payment_status ?? "Something went wrong", payment_status === "SUCCESS" ? "success" : "error"),
            {
                status: 500
            }
        )

    }
    catch (e)
    {
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }

}



export const POST = async (request: Request) => {

    let body

    try {
        body = await request.json()
    }
    catch (e)
    {
        return NextResponse.json(
            generate_dto(
                null, 
                "Unable to read request body",
                "error"
            ),
            {
                status: 400
            }
        )
    }

    const customer_id = body.customer_id
    let customer: CUSTOMER | null = null
    let payment_method: PAYMENT_METHOD | null = null


    if(isUndefined(customer_id)) {
        customer =(await payments.customer?.createCustomers({
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            store_id: body.store_id,
        }) ) ?? null
        
        payment_method = ( await payments.payment_method?.createPaymentMethod({
            customer_id: customer?.id,
            phone_number: body?.phone_number,
            store_id: body?.store_id,
            type: "MPESA",
        })) ?? null
    }
    
    try {
        const payment_res = await payments.payment?.createPayment({
            amount: body.amount,
            customer_id: customer?.id,
            payment_method_id: payment_method?.id,
            store_id: body?.store_id,
            checkout_id: body?.checkout_id
        }) 
        return NextResponse.json(generate_dto(payment_res, "SUCCESS", "error"), {
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