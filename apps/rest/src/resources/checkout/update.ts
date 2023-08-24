import { generate_dto, generate_unique_id } from "generators";
import { CHECKOUT, CUSTOMER } from "db/schema";
import { HandlerFn } from "../../../lib/handler";
import { checkout } from "zodiac"
import { eq } from "drizzle-orm";
import { isEmpty } from "../../../lib/cjs/lodash";



export const updateCheckout: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const id = req.params.checkout_id 

    if(isEmpty(id)) return res.status(400).send(generate_dto(
        null,
        "ID is required",
        "error"
    ))

    const parsed = checkout.safeParse(body)

    if(!parsed.success) return res.status(400).send(generate_dto(
        parsed.error.formErrors.fieldErrors,
        "Invalid body",
        "error"
    ))


    const {created_at, updated_at, ...data} = parsed.data


    try {
        var result = await db?.update(CHECKOUT).set({
            ...data
        }).where(eq(CHECKOUT.id, id)).returning()

        const dto = generate_dto(result?.at(0), "Checkout created successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        res.status(500)
        .send(generate_dto(e, "Unable to create checkout", "error"))
    }
    
}


export const deleteCheckout: HandlerFn = async (req, res, clients) => {
    const {db} = clients

    const id = req.params.checkout_id 

    if(isEmpty(id)) return res.status(400).send(generate_dto(null, "ID is required", "error"))

    try {
        const results = await db?.delete(CHECKOUT).where(
            eq(CHECKOUT.id, id)
        ).returning()

        if (isEmpty(results?.at(0))) {
            return res.status(404).send(generate_dto(null, "Checkout not found", "error"))
        }

        return res.status(200).send(generate_dto(results?.at(0), "Checkout deleted", "success"))
    }
    catch (e)
    {
        return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
    }
}