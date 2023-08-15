import { generate_dto, generate_unique_id } from "generators";
import { CUSTOMER } from "../../../lib/db/schema";
import { HandlerFn } from "../../../lib/handler";
import { customer } from "zodiac"
import { eq } from "drizzle-orm";



export const updateCustomer: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const parsed = customer.required({
        id: true
    }).safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {created_at, updated_at, id,...data} = parsed.data


    try {
        var result = await db?.update(CUSTOMER).set({
            ...data
        }).where(eq(CUSTOMER.id, id)).returning()
        var cus = result?.at(0)
        const dto = generate_dto(cus, "Customer updated successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        res.status(500)
        .send(generate_dto(e, "Unable to create customer", "error"))
    }
    
}