import { product } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { PRODUCT } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";


export const updateProduct: HandlerFn = async (req, res, clients) => {
    const { db } = clients

    const body = req.body 

    const parsed = product.required({
        id: true
    }).safeParse(body)

    if (!parsed.success) {
        res.status(400).send(parsed.error.formErrors.fieldErrors)
        return
    }

    const {id, ...data} = parsed.data

    try {
        var result = await db?.update(PRODUCT).set({
            ...data
        }).where(eq(PRODUCT.id, id)).returning()

        const dto = generate_dto(result?.at(0), "Product updated successfully", "success")

        res.status(201).send(dto)
    }
    catch (e)
    {
        res.status(500).send(generate_dto(e, "Unable to update product", "error"))
    }
}
