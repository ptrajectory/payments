import { generate_dto, generate_unique_id } from "generators";
import { CUSTOMER, PAYMENT_METHOD } from "db/schema";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { customer, payment_method } from "zodiac"
import { and, eq } from "drizzle-orm";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";



export const updatePaymentMethod: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {
    // clients
    const { db } = clients


    // body
    const body = req.body

    const id = req.params.payment_method_id 

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID is not provided",
            "error"
        )
    )

    const parsed = payment_method.safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {created_at, updated_at,...data} = parsed.data


    try {
        var result = await db?.update(PAYMENT_METHOD).set({
            ...data,
            updated_at: new Date(),
        }).where(and(
            eq(PAYMENT_METHOD.id, id),
            // @ts-ignore
            eq(PAYMENT_METHOD.store_id, req.store.id),
            eq(PAYMENT_METHOD.environment, req.env)
        )).returning()

        const dto = generate_dto(result?.at(0), "Payment method updated successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        res.status(500)
        .send(generate_dto(e, "Unable to update payment method", "error"))
    }
    
}


export const archivePaymentMethod: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {
    const { db } = clients


    const id = req.params.payment_method_id 

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(generate_dto(
        null,
        "ID IS NOT PROVIDED",
        "error"
    ))

    try {

        const result = await db?.update(PAYMENT_METHOD).set({
            status: "ARCHIVED"
        }).where(and(
            eq(PAYMENT_METHOD.id, id)),
            // @ts-ignore
            eq(PAYMENT_METHOD.store_id, req.store.id),
            eq(PAYMENT_METHOD.environment, req.env)
        ).returning()

        if(isEmpty(result?.at(0)))
        {
            return res.status(404).send(generate_dto(null, "Payment method not found", "error"))
        }

        return res.status(200).send(generate_dto(result?.at(0), "Payment method found", "success"))
 
    }
    catch (e)
    {
        return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
    }
}