import payments from "@/lib/resources/payments";
import { getAuth } from "@clerk/nextjs/server";
import { generate_dto } from "generators";
import { isArray, isNull, isString, isUndefined } from "lodash";
import { NextApiHandler } from "next";
import db from "db"


const handler: NextApiHandler = async (req, res) => {

    const method = req.method 
    const auth = getAuth(req)
    const body = req.body
    const { payment_methods_slug, page = "1", size = "10", customer_id } = req.query 
    const [payment_method_id] = isArray(payment_methods_slug) ?  payment_methods_slug as [string] : []

    if(isNull(auth.userId)) return res.status(401).send(generate_dto(null, "UNAUTHORIZED", "error"))

    switch(method){
        case "POST": {
            try {
                const payment_method = await payments.payment_method?.createPaymentMethod(body)

                return res.status(201).send(generate_dto(payment_method, "CREATED PAYMENT METHOD SUCCESSFULLY", "success"))
            }
            catch (e)
            {
                return res.status(500).send(generate_dto(null, "SOMETHING WENT WRONG", "error"))
            }

            return
        };
        case "GET": {

            try {
                if(!isString(customer_id)) return res.status(400).send(generate_dto(null, "CUATOMER ID IS REQUIRED", "error"))
                const parsed_page = isNaN(Number(page)) ? 1 : Number(page)
                const parsed_size = isNaN(Number(size)) ? 10 : Number(size)

                const payment_methods = await db.query.PAYMENT_METHOD.findMany({
                    where: (payment_methods, {eq })=> eq(payment_methods.customer_id, customer_id),
                    limit: parsed_size,
                    offset: (parsed_page - 1) * parsed_size
                })

                return res.status(200).send(generate_dto(payment_methods, "SUCCESSFULLY FETCHED PAYMENT METHODS", "success"))

            }
            catch (e)
            {
                return res.status(500).send(generate_dto(null, "SOMETHING WENT WRONG", "error"))
            }

            return 
        }
        default: {
            return res.status(405).send(generate_dto(null, "METHOD NOT ALLOWED", "error"))
        }

    }

}


export default handler