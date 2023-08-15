import { eq } from "drizzle-orm";
import { clients } from "../../../lib/clients";
import { PRODUCT } from "../../../lib/db/schema";
import { HandlerFn } from "../../../lib/handler";
import { isEmpty } from "lodash";
import { generate_dto } from "generators";


export const getProduct: HandlerFn =  async (req, res, clients) => {
    const { db } = clients


    const id = req.query.id as string

    try {
        const result = await db?.select().from(PRODUCT).where(eq(PRODUCT.id, id))

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