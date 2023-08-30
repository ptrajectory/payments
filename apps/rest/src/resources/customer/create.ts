import { generate_dto, generate_unique_id } from "generators";
import { CUSTOMER } from "db/schema";
import { HandlerFn } from "../../../lib/handler";
import { customer } from "zodiac"



export const createCustomer: HandlerFn = async (req, res, clients) => {

    console.log("Invoming", req.body)
    // clients
    const { db } = clients

    // body
    const body = req.body

    const parsed = customer.safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const data = parsed.data


    try {
        const result = await db?.insert(CUSTOMER).values({
            id: generate_unique_id("cus"),
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            meta: data.meta,
            updated_at: new Date(),
            store_id: data.store_id
        }).returning()

        const dto = generate_dto(result?.at(0), "Customer created successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        console.log("The error::", e)
        res.status(500)
        .send(generate_dto(e, "Unable to create customer", "error"))
    }
    
}