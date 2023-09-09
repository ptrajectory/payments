import { generate_dto, generate_unique_id } from "generators";
import { CHECKOUT, CUSTOMER, EphemeralPaymentKeys } from "db/schema";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { checkout } from "zodiac"
import { generateCheckoutEphemeralKey } from "../../../lib/functions";



export const createCheckout: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {
    // clients
    const { db } = clients

    // body
    const body = req.body

    const parsed = checkout.safeParse(body) 

    if (!parsed.success) {
        res.status(400).send(generate_dto(parsed.error.formErrors.fieldErrors, "Invalid body", "error"))
        return
    }

    const {created_at, updated_at, ...data} = parsed.data


    try {
        const result = await db?.insert(CHECKOUT).values({
            id: generate_unique_id("chk"),
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
            amount: 0.0, //TODO: this needs to be removed
            status: "PENDING", // TODO: this also needs to be removed
            store_id: req.store.id,
            environment: req.env
        }).returning()

        // @ts-ignore
        const ephemeralKey = generateCheckoutEphemeralKey(result?.at(0)?.id)

        await db?.insert(EphemeralPaymentKeys).values({
            id: ephemeralKey,
            created_at: new Date()
        })

        const dto = generate_dto({
            ...result?.at(0),
            ephemeralKey
        }, "Checkout created successfully", "success")
        
        res.status(201).send(dto)
    }
    catch (e)
    {   
        console.log("Here is the error::", e)
        res.status(500)
        .send(generate_dto(e, "Unable to create checkout", "error"))
    }
    
}