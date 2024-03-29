import { product } from "zodiac";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto, generate_unique_id } from "generators";
import { PRODUCT } from "db/schema";


export const createProduct: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients

    const body = req.body

    const parsed = product.safeParse(body)

    if(!parsed.success){
        res.status(400).send({
            success: false,
            errors: parsed.error.formErrors.fieldErrors
        })
        return
    }

    const data = parsed.data

    try {
        const result = await db?.insert(PRODUCT).values({
            id: generate_unique_id("pro"),
            name: data.name,
            description: data.description,
            price: data.price,
            updated_at: new Date(),
            image: data.image,
            store_id: req.store.id,
            environment: req.env
        }).returning()

        res.status(201).send(
            generate_dto(
                result?.at(0),
                "Product created successfully",
                "success"
            )
        )
    }
    catch (e) 
    {
        res.status(500).send(
            generate_dto(
                e,
                "Unable to create product",
                "error"
            )
        )
    }
    
}