import { getAuth } from "@clerk/nextjs/server";
import { generate_dto } from "generators";
import { isArray, isEmpty, isNull } from "lodash";
import { NextApiHandler } from "next";
import db from "db"


const handler: NextApiHandler = async (req, res) => {

    const method = req.method
    const { payments_slug, customer_id, page = "1", size = "10" } = req.query 

    const parsed_page = isNaN(Number(page)) ? 1 : Number(page)
    const parsed_size = isNaN(Number(size)) ? 10 : Number(size)

    const [payment_id] = isArray(payments_slug) ? payments_slug : []

    const auth = getAuth(req)

    if(isNull(auth.userId)) return res.status(401).send(generate_dto(null, "UNAUTHORIZED", "error"))


    switch(method){
        case "GET": {

            if(!isEmpty(customer_id)){

                const payments = await db.query.PAYMENT.findMany({
                    where: (pms, {eq}) => eq(pms.customer_id, customer_id),
                    limit: parsed_size,
                    offset: (parsed_page -  1) * parsed_size
                })


                return res.status(200).send(generate_dto(payments, "SUCCESSFULLY FETCHED PAYMENTS", "success"))
            }

            return res.status(200).send(null)
        };
        default: {
            return res.status(405).send(generate_dto(null, "METHOD NOT ALLOWED", "error"))
        }
    }


}

export default handler