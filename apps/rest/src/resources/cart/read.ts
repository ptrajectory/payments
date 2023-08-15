import { clients } from './../../../lib/clients';
import { HandlerFn } from "../../../lib/handler";
import { CART } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';



export const getCart: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const id = req.query.id as string

    try {
        const result = await db?.query.CART.findFirst({
            where: eq(CART.id, id),
            with: {
                cart_items: true
            }
        })

        res.status(200).send({
            success: true,
            message: "Cart found",
            data: result
        })
    }
    catch (e)
    {
        res.status(500).send({
            success: false,
            message: "Something went wrong"
        })
    }
}