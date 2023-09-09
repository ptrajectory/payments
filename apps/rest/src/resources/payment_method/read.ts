import { payment_method } from "zodiac";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { PAYMENT_METHOD } from "db/schema";
import { and, eq } from "drizzle-orm";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";



export const getPaymentMethod: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {
    const { db } = clients


    const id = req.params.payment_method_id 

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(generate_dto(
        null,
        "ID IS NOT PROVIDED",
        "error"
    ))

    try {

        const result = await db?.select().from(PAYMENT_METHOD).where(and(
            eq(PAYMENT_METHOD.id, id)),
            // @ts-ignore
            eq(PAYMENT_METHOD.store_id, req.store.id),
            eq(PAYMENT_METHOD.environment, req.env)
        )

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