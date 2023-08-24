import { customer } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { CUSTOMER } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";


export const getCustomer: HandlerFn = async (req, res, clients) => {
    // clients
    const { db } = clients

    const id = req.params.customer_id

    if(isUndefined(id) || isEmpty(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID not provided",
            "error"
        )
    )

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