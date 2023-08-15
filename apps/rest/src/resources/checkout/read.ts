import { checkout } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { CHECKOUT } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { isEmpty } from "lodash";


export const getCheckout: HandlerFn = async (req, res, clients) => {
    const {db} = clients

    const parsed = checkout.required({
        id: true
    }).safeParse(req.query)

    if (!parsed.success) {
        res.status(400).send(parsed.error.formErrors.fieldErrors)
        return
    }

    const { id } = parsed.data

    try {
        const results = await db?.select().from(CHECKOUT).where(eq(CHECKOUT.id, id)) 

        if (isEmpty(results?.at(0))) {
            return res.status(404).send(generate_dto(null, "Checkout not found", "error"))
        }

        return res.status(200).send(generate_dto(results?.at(0), "Checkout found", "success"))
    }
    catch (e)
    {
        return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
    }
}