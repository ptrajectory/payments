import { customer } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { CUSTOMER } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { isEmpty } from "lodash";


export const getCustomer: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients

    const parsed = customer.required({
        id: true
    }).safeParse(req.query)

    if (!parsed.success) {
        res.status(400).send(parsed.error.formErrors.fieldErrors)
        return
    }

    const { id } = parsed.data 

    try {
        const results = db?.select().from(CUSTOMER).where(eq(CUSTOMER.id, id))

        if (isEmpty(results)) {
            res.status(404).send(generate_dto(null, "Customer not found", "error"))
            return
        }

        var cus = (await results).at(0)

        res.status(200).send(generate_dto(cus, "Customer found", "success"))
    }
    catch (e)
    {
        res.status(500).send(generate_dto(e, "Unable to get customer", "error"))
    }

}