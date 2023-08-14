import { generate_dto, generate_unique_id } from "generators";
import { CUSTOMER } from "../../../lib/db/schema";
import { HandlerFn } from "../../../lib/handler";
import { customer } from "zodiac"



export const updateCustomer: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const parsed = customer.safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {created_at, updated_at,...data} = parsed.data


    try {
        await db?.update(CUSTOMER).set({
            ...data
        })

        const dto = generate_dto(null, "Customer updated successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        res.status(500)
        .send(generate_dto(e, "Unable to create customer", "error"))
    }
    
}