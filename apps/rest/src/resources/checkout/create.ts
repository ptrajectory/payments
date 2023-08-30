import { generate_dto, generate_unique_id } from "generators";
import { CHECKOUT, CUSTOMER } from "db/schema";
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
        const result = await db?.insert(CHECKOUT).values({
            id: generate_unique_id("chk"),
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
            amount: 0.0, //TODO: this needs to be removed
            status: "PENDING", // TODO: this also needs to be removed
            store_id: data.store_id
        }).returning()

        const dto = generate_dto(result?.at(0), "Checkout created successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        console.log("Here is the error::", e)
        res.status(500)
        .send(generate_dto(e, "Unable to create checkout", "error"))
    }
    
}