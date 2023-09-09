import { product } from "zodiac";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto } from "generators";
import { PRODUCT } from "db/schema";
import { and, eq } from "drizzle-orm";
import { isEmpty, isUndefined } from "../../../lib/cjs/lodash";


export const updateProduct: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {
    const { db } = clients

    const body = req.body 

    const id = req.params.product_id

    if(isEmpty(id) || isUndefined(id)) return res.status(400)
    .send(generate_dto(
        null,
        "ID IS REQUIRED",
        "error"
    ))

    const parsed = product.safeParse(body)

    if (!parsed.success) {
        res.status(400).send(parsed.error.formErrors.fieldErrors)
        return
    }

    const data = parsed.data

    try {
        var result = await db?.update(PRODUCT).set({
            ...data
        }).where(and(
            eq(PRODUCT.id, id),
            // @ts-ignore
            eq(PRODUCT.store_id, req.store.id),
            eq(PRODUCT.environment, req.env)
        )).returning()

        const dto = generate_dto(result?.at(0), "Product updated successfully", "success")

        res.status(201).send(dto)
    }
    catch (e)
    {
        console.log("Something went wrong::", e)
        res.status(500).send(generate_dto(e, "Unable to update product", "error"))
    }
}


export const archiveProduct: HandlerFn<AuthenticatedRequest> =  async (req, res, clients) => {
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
        const result = await db?.update(PRODUCT).set({
            status: "ARCHIVED"
        }).where(and(
            eq(PRODUCT.id, id),
            // @ts-ignore
            eq(PRODUCT.store_id, req.store.id),
            eq(PRODUCT.environment, req.env)
        )).returning()

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
