import { payment_method } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { PAYMENT_METHOD } from "db/schema";
import { eq } from "drizzle-orm";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";



export const getPaymentMethod: HandlerFn = async (req, res, clients) => {
    const { db } = clients


    const id = req.params.payment_method_id 

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(generate_dto(
        null,
        "ID IS NOT PROVIDED",
        "error"
    ))

    try {

        const result = await db?.select().from(PAYMENT_METHOD).where(eq(PAYMENT_METHOD.id, id))

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