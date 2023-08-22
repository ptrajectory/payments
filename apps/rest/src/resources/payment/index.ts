import { payment } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto, generate_unique_id } from "generators";
import { PAYMENT } from "../../../lib/db/schema";
import { isEmpty, isUndefined } from "lodash";
import { eq } from "drizzle-orm";



export const createPayment: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const body = req.body

    const parsed = payment.safeParse(body)

    if(!parsed.success) return res.status(400).send(generate_dto(
        parsed.error.formErrors.fieldErrors,
        "Invalid body",
        "error"
    ))

    try {
        const result = await db?.insert(PAYMENT).values({
            id: generate_unique_id("pay"),
            ...parsed.data
        }).returning()
    
        return res.status(201).send(generate_dto(
            result?.at(0),
            "Successfully created payment",
            "success"
        ))

    }
    catch (e)
    {
        res.status(500).send(generate_dto(
            e,
            "Something went wrong",
            "error"
        ))
    }



}



export const getPayment: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const payment_id = req.params.payment_id

    if(isEmpty(payment_id)) return res.status(400).send(
        generate_dto(
            null,
            "Please specify a payment id",
            "error"
        )
    )

    try {
        const result = (await db?.query.PAYMENT.findFirst({
            where: eq(PAYMENT.id, payment_id)
        }))

        if(isUndefined(result) || isEmpty(result)) return res.status(404).send(
            generate_dto(
                null,
                "Payment method not found",
                "error"
            )
        )

        res.status(200).send(
            generate_dto(
                result,
                "Found payment method",
                "success"
            )
        )
    }
    catch (e)
    {
        res.status(500).send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }


}


export const updatePayment: HandlerFn = async (req, res, clients) => {

    const { db } = clients


    const id = req.params.payment_id

    const body = req.body

    const parsed = payment.safeParse(body)

    if(!parsed.success) return res.status(400).send(
        generate_dto(
            parsed.error.formErrors.fieldErrors,
            "Invalid body",
            "error"
        )
    )

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID not provided",
            "error"
        )
    )


    try {

        const result = await db?.update(PAYMENT).set({
            ...parsed.data
        }).where(eq(PAYMENT.id, id)).returning()

        return res.status(200).send(
            generate_dto(
                result?.at(0),
                "Updated successfully",
                "success"
            )
        )

    }
    catch(e)
    {
        return res.status(500)
        .send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }


}

