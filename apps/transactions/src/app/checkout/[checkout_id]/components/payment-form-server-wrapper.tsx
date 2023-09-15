"use server"

import db from "db"
import { CART, CART_ITEM, CHECKOUT, PRODUCT } from "db/schema"
import { eq, sql } from "db/utils"
import CheckoutPayForm from "./payment-form"


const getFormData = async (id: string) => {

        try {

           const checkout = await db.query.CHECKOUT.findFirst({
                where: (chk, {eq}) => eq(chk.id, id),
                with: {
                    cart: {
                        columns: {
                            id: true,
                        },
                        with: {
                            items: {
                                columns: {
                                    id: true,
                                    quantity: true,
                                },
                                with: {
                                    product: {
                                        columns: {
                                            price: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
           })

           const total = (checkout as any)?.cart?.items?.reduce((prev: any, cur: any)=> {
            return prev + ((cur?.quantity  * cur?.product?.price) ?? 0)
           }, 0)

           return total
        }   
        catch (e)
        {
            // TODO: handle better
            return null 
        }
}


export default async function PaymentFormServerWrapper(props: { id: string  }){

    const { id } = props

    const amount = await getFormData(id)

    return <CheckoutPayForm
        pay={amount}
        checkout_id={id}
    />

}