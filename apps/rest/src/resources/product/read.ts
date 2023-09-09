import { and, eq } from "drizzle-orm";
import { clients } from "../../../lib/clients";
import { PRODUCT } from "db/schema";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";


export const getProduct: HandlerFn<AuthenticatedRequest> =  async (req, res, clients) => {
    const { db } = clients


    const id = req.params.product_id as string

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID IS REQUIRED",
            "error"
        )
    )

    try {
        const result = await db?.select().from(PRODUCT).where(and(
            eq(PRODUCT.id, id),
            // @ts-ignore store id wil be present by this time
            eq(PRODUCT.store_id, req.store.id),
            eq(PRODUCT.environment, req.env)
        ))

        if (isEmpty(result?.at(0))) {
            return res.status(404).send(generate_dto(null, "Product not found", "error"))
        }

        return res.status(200).send(generate_dto(result?.at(0), "Product found", "success"))
    }
    catch (e)
    {
        res.status(500).send({
            success: false,
            message: "Something went wrong"
        })
    }

}