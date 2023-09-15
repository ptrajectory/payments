import db from "db"
import { CART, CART_ITEM, PRODUCT } from "db/schema"
import { eq } from "db/utils"
import { CUSTOMER } from "zodiac"
import { stringifyDatesInJSON } from "@/lib/utils"
import CheckoutMainPageSection from "./_page"



const getCheckoutData = async (checkout_id: string) => {

    try {
        const checkout = await db.query.CHECKOUT.findFirst({
            where: (chk,  {eq}) => eq(chk.id, checkout_id),
            columns: {
                id: true,
                customer_id: true,
                cart_id: true,
                store_id: true,
                status: true, 
                environment: true,
            },
            with: {
                cart: {
                    with: {
                        items: {
                            with: {
                                product: true
                            }
                        }
                    }
                },
                store: true,
                customer: true
            }
        })

        const cart = checkout?.cart?.at(0) ?? null

        const store = checkout?.store ?? null

        const products = checkout?.cart?.at(0)?.items?.map(({product})=>product?.at(0)) ?? [];

        const total_price = products?.reduce((prev, cur, i)=>{
            return prev + (Number(cur?.price ?? 0) * (checkout?.cart?.at(0)?.items?.[i]?.quantity ?? 0))
        },0)


        let customer: CUSTOMER | null = checkout?.customer?.at(0) ?? null




        const data =  {
            checkout: checkout as typeof checkout,
            products,
            price: total_price,
            cart: cart as typeof cart,
            store: store as typeof store,
            customer: customer as typeof customer
        }

        return data
    }
    catch (e)
    {
        return null
    }

}


export default async function Page(props: { params: { checkout_slug: Array<string> } }){

    const {params} = props
    const [checkout_id] = params.checkout_slug

    const data = await getCheckoutData(checkout_id)

    return (
        <CheckoutMainPageSection
            data={data as any}
        />
    )

}