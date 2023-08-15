import { cart, cart_item } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto, generate_unique_id } from "generators";
import { CART, CART_ITEM } from "../../../lib/db/schema";


export const createCart: HandlerFn = async (req, res, clients) => {

    const { db } = clients 

    const body = req.body 

    const parsed = cart.safeParse(body) 

    if(!parsed.success) return res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))

    const data = parsed.data

    try {
        const result = await db?.insert(CART).values({
            id: generate_unique_id("crt"),
            customer_id: data.customer_id,
        }).returning()

        res.status(201).send(generate_dto(result?.at(0), "Cart created successfully", "success"))
    }
    catch (e)
    {
        res.status(500).send(generate_dto(e, "Unable to create cart", "error"))
    }


}

export const createCartItem: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const body = req.body 

    const cart_id = req.params.cart_id 

    const parsed = cart_item.safeParse(body)

    if(!parsed.success) return res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid Body", "error"))

    const data = parsed.data

    try {
        const cart_item = db?.insert(CART_ITEM).values({
           id: generate_unique_id("crt_itm"),
           cart_id,
           ...data
        }).returning()

        return res.status(201).send(generate_dto(cart_item, "Something went wrong", "error"))

    }
    catch (e)
    {
        return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
    }

}