import { checkout } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { CHECKOUT } from "db/schema";
import { eq } from "drizzle-orm";
import { isEmpty } from "../../../lib/cjs/lodash";


export const getCheckout: HandlerFn = async (req, res, clients) => {
    const {db} = clients

    const id = req.params.checkout_id 

    if(isEmpty(id)) return res.status(400).send(generate_dto(null, "ID is required", "error"))

    try {
        const results = await db?.query.CHECKOUT.findFirst({
            where: eq(CHECKOUT.id, id),
            with: {
                cart: true,
                customer: true,
                payment_method: true,
                payments: true
            }
        })

        if (isEmpty(results)) {
            return res.status(404).send(generate_dto(null, "Checkout not found", "error"))
        }

        return res.status(200).send(generate_dto(results, "Checkout found", "success"))
    }
    catch (e)
    {
        return res.status(500).send(generate_dto(e, "Something went wrong", "error"))
    }
}