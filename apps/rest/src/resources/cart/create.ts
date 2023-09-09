import { cart, cart_item } from "zodiac";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto, generate_unique_id } from "generators";
import { CART, CART_ITEM } from "db/schema";


export const createCart: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients 

    const body = req.body 

    const parsed = cart.safeParse(body) 

    if(!parsed.success) return res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))

    const data = parsed.data

    try {
        const result = await db?.insert(CART).values({
            id: generate_unique_id("crt"),
            customer_id: data.customer_id,
            updated_at: new Date(),
            create_at: new Date(),
            store_id: req.store.id,
            environment: req.env
        }).returning()

        res.status(201).send(generate_dto(result?.at(0), "Cart created successfully", "success"))
    }
    catch (e)
    {

        console.log("The actual error is::", e)
        res.status(500).send(generate_dto(e, "Unable to create cart", "error"))
    }


}

export const createCartItem: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients

    const body = req.body 

    const cart_id = req.params.cart_id 

    const parsed = cart_item.safeParse(body)

    if(!parsed.success) return res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid Body", "error"))

    const data = parsed.data

    console.log("Incoming cart item data::", data)

    try {
        const result = await db?.insert(CART_ITEM).values({
           id: generate_unique_id("crt_itm"),
           cart_id,
           ...data,
           updated_at: new Date(),
           created_at: new Date(),
           store_id: req.store.id,
           environment: req.env
        }).returning()

        return res.status(201).send(generate_dto(result?.at(0), "Something went wrong", "error"))

    }
    catch (e)
    {
        console.log("Here is what's actually going wrong::", e)
        return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
    }

}