import db from "db"
import { generate_dto } from "generators"
import { isNull } from "lodash"
import { NextResponse } from "next/server"
import { createPaymentClient } from "ptrajectory-payments-node"
import { checkout_pay } from "zodiac"






export const POST = async (req: Request) => {

    const body = await req.json()

    const parsed = checkout_pay.safeParse(body)

    if(!parsed.success) return NextResponse.json(generate_dto(null, "Body Invalid", "error"), {
        status: 400
    })

    try {

        const checkout = await db.query.CHECKOUT.findFirst({ // TODO: Refactor, use the checkout amount directly
            where: (chk, {eq}) => eq(chk.id, parsed.data.checkout_id),
            columns: {
                id: true,
            },
            with: {
                store: true,
                cart: {
                    with: {
                        items: {
                            with: {
                                product: true
                            }
                        }
                    }
                }
            }
        })

        const total = (checkout as any)?.cart?.items?.reduce((prev: any, cur: any)=> {
            return prev + ((cur?.quantity  * cur?.product?.price) ?? 0)
        }, 0)

        if(total === 0) return NextResponse.json(generate_dto(null, "Invalid Checkout ID", "error"))

        const key = (checkout?.store as any)?.environment === "testing" ? (checkout?.store as any)?.test_secret_key : (checkout?.store as any)?.prod_secret_key

        
        const temporaryClient = createPaymentClient(process.env.API_HOST as string, key)

        const { customer_id, email, first_name, last_name } = parsed.data

        let customer = null

        if(email && first_name && last_name ){

            customer = await temporaryClient.customers.create({
                email,
                first_name,
                last_name
            })

        }

        if(customer?.id || customer_id) {

            console.log("HERE us ths customer", customer)

            const cart = await temporaryClient.carts.update((checkout?.cart as any)?.id as string, {
                customer_id: customer_id ?? customer?.id ?? undefined
            })

            console.log("HEre is the cart::",cart)

            const ck = await temporaryClient.checkouts.update(checkout?.id as string, {
                customer_id: customer_id ?? customer?.id ?? undefined
            });

            console.log("Here is the checkout::", ck)


        }

        const payment = await temporaryClient.payments.start({
            amount: total,
            phone_number: parsed.data.phone_number,
            checkout_id: checkout?.id,
            customer_id: customer_id ?? customer?.id ?? undefined
        })

        return NextResponse.json(generate_dto(payment, "success", "success"), {
            status: 200
        })

    }
    catch (e)
    {
        console.log("ERROR::",e)
        return NextResponse.json(generate_dto(null, "Something went wrong", "error"), {
            status: 500
        })
    }

}


export async function GET(req: Request){

    const { searchParams } = new URL(req.url)

    const checkout_id = searchParams.get("checkout_id")
    const payment_id = searchParams.get("payment_id")

    if(isNull(checkout_id) || isNull(payment_id)) return NextResponse.json(generate_dto(null, "Invalid Ids", "error"), {
        status: 400
    })

    try {

        const checkout = await db.query.CHECKOUT.findFirst({
            where: (chk, {eq}) => eq(chk.id, checkout_id),
            with: {
                store: true
            }
        })
    
        const key = (checkout?.store as any)?.environment === "testing" ? (checkout?.store as any)?.test_secret_key : (checkout?.store as any)?.prod_secret_key
    
        const temporaryClient = createPaymentClient(process.env.API_HOST as string, key)

        const status = await temporaryClient.payments.confirm(payment_id)

        return NextResponse.json(generate_dto(status, "success", "success"), {
            status: 200
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