import { generate_dto, generate_unique_id } from "generators";
import { CUSTOMER, PAYMENT_METHOD } from "../../../lib/db/schema";
import { HandlerFn } from "../../../lib/handler";
import { customer, payment_method } from "zodiac"



export const createPaymentMethod: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const parsed = payment_method.safeParse(body)

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {created_at, updated_at, ...data} = parsed.data


    try {
        const result = await db?.insert(PAYMENT_METHOD).values({
            id: generate_unique_id("pm"),
            ...data,
            updated_at: new Date()
        }).returning()

        const dto = generate_dto(result?.at(0), "Payment Method created successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        console.log("The error ::", e)
        res.status(500)
        .send(generate_dto(e, "Unable to create payment method", "error"))
    }
    
}