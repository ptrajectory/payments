import { generate_dto, generate_unique_id } from "generators";
import { CUSTOMER } from "db/schema";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { customer } from "zodiac"
import { and, eq } from "drizzle-orm";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";



export const updateCustomer: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const id = req.params.customer_id

    if (isEmpty(id) || isUndefined(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID not provided",
            "error"
        )
    )

    const parsed = customer.safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {created_at, updated_at,...data} = parsed.data


    try {
        var result = await db?.update(CUSTOMER).set({
            ...data,
            updated_at: new Date()
        }).where(and(
            eq(CUSTOMER.id, id),
            // @ts-ignore
            eq(CUSTOMER.store_id, req.store.id),
            eq(CUSTOMER.environment, req.env)
        )).returning()
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

export const archiveCustomer: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const {db} = clients 

    const id = req.params.customer_id 

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID not provided",
            "error"
        )
    )

    try {

        const result = await db?.update(CUSTOMER).set({
            status: "ARCHIVED"
        }).where(and(
            eq(CUSTOMER.id, id),
            // @ts-ignore
            eq(CUSTOMER.store_id, req.store?.id)
        )).returning()

        return res.status(200)
        .send(
            generate_dto(
                result?.at(0),
                "Succeddfully deleted the customer",
                "success"
            )
        )

    }
    catch (e)
    {
        res.status(500)
        .send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }

}

