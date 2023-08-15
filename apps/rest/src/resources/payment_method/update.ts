import { generate_dto, generate_unique_id } from "generators";
import { CUSTOMER, PAYMENT_METHOD } from "../../../lib/db/schema";
import { HandlerFn } from "../../../lib/handler";
import { customer, payment_method } from "zodiac"
import { eq } from "drizzle-orm";



export const updatePaymentMethod: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const parsed = payment_method.required({
        id: true
    }).safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {id,created_at, updated_at,...data} = parsed.data


    try {
        var result = await db?.update(PAYMENT_METHOD).set({
            ...data
        }).where(eq(PAYMENT_METHOD.id, id)).returning()

        const dto = generate_dto(result?.at(0), "Payment method updated successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        res.status(500)
        .send(generate_dto(e, "Unable to update payment method", "error"))
    }
    
}