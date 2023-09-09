import { customer } from "zodiac";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { CUSTOMER } from "db/schema";
import { and, eq } from "drizzle-orm";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";


export const getCustomer: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {
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
        const results = db?.select().from(CUSTOMER).where(and(
            eq(CUSTOMER.id, id),
            // @ts-ignore
            eq(CUSTOMER.store_id, req.store.id),
            eq(CUSTOMER.environment, req.env)
        ))

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