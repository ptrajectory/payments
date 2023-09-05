import payments from "@/lib/resources/payments"
import { isNumber, isString, isUndefined } from "lodash"
import { redirect } from "next/navigation"
import Redirect from "./redirect_component"




const getProductData = async (store_id: string, product_id: string, quantity: number) => {

    try {

        if(!isString(store_id)) throw new Error("STORE ID IS REQUIRED")
        
        if(!isString(product_id)) throw new Error("PRODUCT ID IS REQUIRED")

        if(!isNumber(quantity))  throw new Error("QUNATITY IS REQUIRED")

        const product = await payments.product?.getProduct(product_id) 

        if(isUndefined(product)) throw new Error("PRODUCT IS UNDEFINED")

        const new_cart = await payments.cart?.createCart({
            store_id
        })

        if(isUndefined(new_cart) || isUndefined(new_cart?.id)) throw new Error("UNABLE TO CREATE CART")

        const crt_item = await payments.cart?.addCartItem(new_cart?.id, {
            product_id: product.id,
            quantity,
            store_id
        })

        const checkout = await payments.checkout?.createCheckout({
            cart_id: new_cart?.id,
            store_id,
            currency: "KES"
        })

        return checkout?.id

    }
    catch (e)
    {
        console.log("ERROR:",e)
        // 😂 yeah yeah, I know why catch it in the first place
        throw new Error("SOMETHING WENT WRONG::")

    }

}


export default async function PurchasePage(props: { params: { purchase_slug: Array<string> }, searchParams: {store_id: string, quantity: string} }) {


    const { params, searchParams } = props 

    const { quantity = "1", store_id } = searchParams

    const { purchase_slug } = params
    const [ product_id ] = purchase_slug
    const checkout_id = await getProductData(store_id, product_id, Number(quantity ?? 0)) // TODO: add in validation

    return (
        <div className="w-screen h-screen items-center justify-center flex flex-col">
           {/* <CheckCircle className='text-green-500' /> */}
           <Redirect
            checkout_id={checkout_id}
           />
        </div>
    )

}