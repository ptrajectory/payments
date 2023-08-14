import { generate_dto, generate_unique_id } from "generators";
import { CHECKOUT, CUSTOMER } from "../../../lib/db/schema";
import { HandlerFn } from "../../../lib/handler";
import { checkout } from "zodiac"



export const createCheckout: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const parsed = checkout.safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {created_at, updated_at, ...data} = parsed.data


    try {
        await db?.insert(CHECKOUT).values({
            id: generate_unique_id("chk"),
            ...data
        })

        const dto = generate_dto(null, "Checkout created successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        res.status(500)
        .send(generate_dto(e, "Unable to create checkout", "error"))
    }
    
}