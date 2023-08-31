import payments from "@/lib/resources/payments";
import { generate_dto } from "generators";
import { isArray, isEmpty, isUndefined } from "lodash";
import { NextApiHandler } from "next";
import { CUSTOMER, PAYMENT_METHOD } from "zodiac";



const handler: NextApiHandler = async (req, res) => {

    const method = req.method
    const body = req.body

    const { purchase_slug } = req.query
    const [payment_id] = isArray(purchase_slug) ? purchase_slug : []

    switch(method){
        case "GET":{

            if(isUndefined(payment_id)) return res.status(400).send(generate_dto(null, "PAYMENT ID IS REQUIRED", "error"))

            try{
                const payment_status = await payments.payment?.confirmPayment(payment_id)

                return res.status(200).send(generate_dto(payment_status, payment_status ?? "Something went wrong", "success"))

            }
            catch (e)
            {
                return res.status(500).send(generate_dto(null, "Something went wrong", "error"))
            }

            return
        }
        case "POST": {

            const customer_id = body.customer_id
            let customer: CUSTOMER | null = null
            let payment_method: PAYMENT_METHOD | null = null

            if(isUndefined(customer_id)) {

                customer =(await payments.customer?.createCustomers({
                    email: body.email,
                    first_name: body.first_name,
                    last_name: body.last_name,
                    store_id: body.store_id,
                }) ) ?? null

                
                payment_method = ( await payments.payment_method?.createPaymentMethod({
                    customer_id: customer?.id,
                    phone_number: body?.phone_number,
                    store_id: body?.store_id,
                    type: "MPESA",
                })) ?? null

            }
            

            try {
                const payment_res = await payments.payment?.createPayment({
                    amount: body.amount,
                    customer_id: customer?.id,
                    payment_method_id: payment_method?.id,
                    store_id: body?.store_id,
                    checkout_id: body?.checkout_id
                }) 

                return res.status(201).send(generate_dto(payment_res, "SUCCESS", "error"))
            }
            catch (e)
            {
                return res.status(500).send(generate_dto(null, "Something went wrong", "error"))
            }
        }
        default: {
            res.status(405).send(generate_dto(null, "METHOD NOT ALLOWED", "error"))
            return
        }
    }

}


export default handler