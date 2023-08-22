import { clients } from './../../../lib/clients';
import { HandlerFn } from "../../../lib/handler";
import { CART } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { isEmpty } from 'lodash';
import { generate_dto } from 'generators';



export const getCart: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const id = req.params.cart_id as string

    if(isEmpty(id)) return res.status(400).send(generate_dto(
        null,
        "ID IS REQUIRED",
        "error"
    ))

    try {
        const result = await db?.query.CART.findFirst({
            where: eq(CART.id, id),
            with: {
                cart_items: true
            }
        })

        res.status(200).send({
            status: "success",
            message: "Cart found",
            data: result
        })
    }
    catch (e)
    {
        res.status(500).send({
            status: "error",
            message: "Something went wrong",
            data: e
        })
    }
}