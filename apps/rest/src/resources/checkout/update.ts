import { generate_dto, generate_unique_id } from "generators";
import { CHECKOUT, CUSTOMER } from "../../../lib/db/schema";
import { HandlerFn } from "../../../lib/handler";
import { checkout } from "zodiac"
import { eq } from "drizzle-orm";



export const updateCheckout: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const parsed = checkout.required({
        id: true
    }).safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {id,created_at, updated_at, ...data} = parsed.data


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