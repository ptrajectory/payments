import { cart, cart_item } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { CART, CART_ITEM } from "../../../lib/db/schema";
import { and, eq } from "drizzle-orm";


export const updateCart: HandlerFn = async (req, res, clients) => {

    const { db } = clients 

    const body = req.body 

    const parsed = cart.required({
        id: true
    }).safeParse(body)

    if(!parsed.success) return res.status(400).send(parsed.error.formErrors.fieldErrors) 

    const {id, ...data} = parsed.data

    try {
        const result = await db?.update(CART).set({
            ...data
        })
        .where(eq(CART.id, id)).returning()

        const dto = generate_dto(result?.at(0), "Cart updated successfully", "success")

        res.status(200).send(dto)
    }
    catch (e)
    {
        res.status(500).send(generate_dto(e, "Unable to update cart", "error"))
    }


}

export const updateCartItem: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const body = req.body

    const cart_id = req.params.cart_id

    const cart_item_id = req.params.cart_item_id

    const parsed = cart_item.safeParse(body)

    if (!parsed.success) return res.status(400).send(generate_dto(
        parsed.error.formErrors.fieldErrors,
        "Invalid body",
        "error"
    ))

    const data = parsed.data 

    try {

        const result = await db?.update(CART_ITEM).set({
            ...data
        })
        .where(
            and(eq(CART_ITEM.id, cart_item_id), eq(CART_ITEM.cart_id, cart_id))
        ).returning()

        res.status(200)
        .send(generate_dto(result?.at(0), "Successfully updated cart item", "success"))

    }
    catch (e) 
    {
        return res.status(500)
        .send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }

}