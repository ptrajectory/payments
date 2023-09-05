import db from "db"
import payments from "@/lib/resources/payments"
import { CART, CART_ITEM, PRODUCT } from "db/schema"
import { eq } from "db/utils"
import { CUSTOMER } from "zodiac"
import { stringifyDatesInJSON } from "@/lib/utils"
import CheckoutMainPageSection from "./_page"



const getCheckoutData = async (checkout_id: string) => {

    try {
        const checkout = await payments.checkout?.getCheckout(checkout_id)

        const cart = checkout?.cart_id ? await payments.cart?.getCart(checkout?.cart_id) : null

        const store = checkout?.store_id ? await db.query.STORE.findFirst({
            where: (str, {eq}) => eq(str.id, checkout?.store_id)
        }) : null

        const products = await db.select({
            name: PRODUCT.name,
            price: PRODUCT.price,
            quantity: CART_ITEM.quantity,
            image: PRODUCT.image,
            description: PRODUCT.description
        }).from(CART_ITEM)
        .innerJoin(PRODUCT, eq(PRODUCT.id, CART_ITEM.product_id))
        .where(eq(CART_ITEM.cart_id, cart?.id))

        const total_price = products?.reduce((prev, cur)=>{
            return prev + (Number(cur?.price ?? 0) * cur.quantity)
        },0)


        let customer: CUSTOMER | null = null

        if(checkout?.customer_id) {

            customer = await payments.customer?.getCustomer(checkout?.customer_id) ?? null
        }



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

    console.log("INCOMING DATA::", data)

    return (
        <CheckoutMainPageSection
            data={data}
        />
    )

}