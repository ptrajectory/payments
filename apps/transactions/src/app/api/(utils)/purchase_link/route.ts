import { auth } from "@clerk/nextjs"
import db from "db"
import { CART, CART_ITEM, CHECKOUT } from "db/schema"
import { generate_dto, generate_unique_id } from "generators"
import { isNull, isUndefined } from "lodash"
import { NextResponse } from "next/server"
import { purchase_link } from "zodiac"
import { createPaymentClient } from "ptrajectory-payments-node"





export const POST = async (req: Request) => {

    const { userId } = auth()

    if(isNull(userId)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), {
        status: 401
    })

    const body = await req.json()

    const parsed = purchase_link.safeParse(body)

    if(!parsed.success) return NextResponse.json(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid Body", "error"), {
        status: 400
    })

    const {product_id, store_id, quantity, email, first_name, last_name, customer_id} = parsed.data

    try {

        const store = (await db.query.STORE.findFirst({
            where: (str, { eq, and }) =>  eq(str.id, store_id),
            with: {
                seller: {
                    where: (slr, {eq}) => eq(slr?.uid, userId)
                }
            },
            columns: {
                environment: true,
                test_secret_key: true,
                prod_secret_key: true
            }
        })) ?? null;

        if(isNull(store)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), {
            status: 403
        })

        if(isUndefined(store.seller)) return NextResponse.json(generate_dto(null, "Unauthorized", "error"), {
            status: 403
        })

        const key_to_use: string = store.environment === "production" ? store.prod_secret_key : store.test_secret_key 

        const temporaryPaymentClient = createPaymentClient(process.env.API_HOST as string, key_to_use )

        let customer = null 

        if(email && first_name && last_name){

            customer = await temporaryPaymentClient.customers.create({
                email,
                first_name,
                last_name
            })

        }

        const cart = await  temporaryPaymentClient.carts.create({
            customer_id: customer_id ?? customer?.id ?? undefined
        })

        if(!cart?.id) return NextResponse.json(generate_dto(null, "Unable to create cart", "error"), {
            status: 500
        })

        await temporaryPaymentClient.carts.addCartItem(cart?.id, {
            product_id,
            quantity
        })

        const checkout = await temporaryPaymentClient.checkouts.create({
            currency: "KES",
            purchase_type: "one_time",
            cart_id: cart?.id,
            customer_id: customer_id ?? customer?.id ?? undefined
        })


        if(isNull(checkout)) return NextResponse.json(generate_dto(null, "Unable to create checkout", "error"), {
            status: 500
        })

        return NextResponse.json(generate_dto(checkout, "success", "success"), {
            status: 201
        })

    }
    catch (e)
    {
        console.log("Error is::", e)
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"))
    }


}