import { cart, cart_item } from "zodiac";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { CART, CART_ITEM } from "db/schema";
import { and, eq } from "drizzle-orm";
import { isEmpty } from "../../../lib/cjs/lodash";


export const updateCart: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients 

    const body = req.body 

    console.log("THE BODY::", body)

    const id = req.params.cart_id 

    if(isEmpty(id)) return res.status(400).send(generate_dto(
        null,
        "ID IS REQUIRED",
        "error"
    ))

    const parsed = cart.safeParse(body)

    if(!parsed.success) return res.status(400).send(parsed.error.formErrors.fieldErrors) 

    const parsedData = parsed.data

    try {
        const result = await db?.update(CART).set({
            ...parsedData
        })
        .where(and(
            eq(CART.id, id),
            // @ts-ignore
            eq(CART.store_id, req.store.id),
            eq(CART.environment, req.env)
        )).returning()

        const dto = generate_dto(result?.at(0), "Cart updated successfully", "success")

        res.status(200).send(dto)
    }
    catch (e)
    {
        console.log("Here is the error::",e)
        res.status(500).send(generate_dto(e, "Unable to update cart", "error"))
    }


}

export const updateCartItem: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

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
            and(
                eq(CART_ITEM.id, cart_item_id), 
                eq(CART_ITEM.cart_id, cart_id),
                //@ts-ignore
                eq(CART_ITEM.store_id, req.store.id),
                eq(CART_ITEM.environment, req.env)
            )
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


export const deleteCartItem: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients

    const cart_id = req.params.cart_id 

    const cart_item_id = req.params.cart_item_id 


    if(isEmpty(cart_id) || isEmpty(cart_item_id)) return res.status(400).send(generate_dto(
        null,
        "CART_ID AND CART_ITEM_ID are required",
        "error"
    ))


    try {

        const result = await db?.delete(CART_ITEM)?.where(
            and(
                eq(CART_ITEM.cart_id, cart_id), 
                eq(CART_ITEM.id, cart_item_id),
                // @ts-ignore
                eq(CART_ITEM.store_id, req.store?.id),
                eq(CART_ITEM.environment, req.env)
            )
        ).returning()

        return res.status(200)
        .send(generate_dto(
            result?.at(0),
            "SUCCESSFULLY DELETED CART ITEM",
            "success"
        ))

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


export const archiveCart: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients

    const cart_id = req.params.cart_id 



    if(isEmpty(cart_id)) return res.status(400).send(generate_dto(
        null,
        "CART_ID IS required",
        "error"
    ))


    try {

        const result = await db?.update(CART).set({
            status: "ARCHIVED"
        }).where(eq(CART.id, cart_id)).returning()


        return res.status(200)
        .send(generate_dto(
            result?.at(0),
            "SUCCESSFULLY DELETED CART ITEMS AND CART",
            "success"
        ))

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