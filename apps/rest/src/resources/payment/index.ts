import { payment } from "zodiac";
import { HandlerFn } from "../../../lib/handler";
import { generate_dto, generate_unique_id } from "generators";
import { CHECKOUT, PAYMENT, PAYMENT_METHOD } from "db/schema";
import { eq } from "drizzle-orm";
import mpesaExpressClient from "./mpesa";
import { isEmpty, isNull, isUndefined } from "../../../lib/cjs/lodash";
import { validatePayment } from "../../../lib/functions";



export const createPayment: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const body = req.body

    const parsed = payment.safeParse(body)

    if(!parsed.success) return res.status(400).send(generate_dto(
        parsed.error.formErrors.fieldErrors,
        "Invalid body",
        "error"
    ))


    const data = parsed.data

    try {


        const payment_method = await db?.query.PAYMENT_METHOD.findFirst({
            where: eq(PAYMENT_METHOD.id, data.payment_method_id ?? "")
        })

        const checkout = isUndefined(data?.checkout_id) ? null : await db?.query.CHECKOUT.findFirst({
            where: eq(CHECKOUT.id, data.checkout_id),
            with: {
                cart: {
                    with: {
                        items: {
                            with: {
                                product: true
                            }
                        }
                    }
                }
            }
        })

        const total_amount = checkout?.cart?.items?.reduce((prev, curr, i)=> {
            return prev + (curr.product?.price ?? 0)
        }, 0) ?? 0

        if(isNull(payment_method)) return res.status(404)
        .send(
            generate_dto(
                null,
                "Payment Method is invalid",
                "error"
            )
        )

        const response = await mpesaExpressClient.client.send_payment_request({
            amount: 2,//TODO: remove me
            phone_number: Number(payment_method?.phone_number),
            transaction_type: "CustomerPayBillOnline",
            transaction_desc: "Online Purchase"
        })

        if(response.ResponseCode !== '0') return res.status(500)
        .send(
            generate_dto(
                null,
                "Unable to make payment request",
                "error"
            )
        )

        const result = await db?.insert(PAYMENT).values({
            id: generate_unique_id("pay"),
            ...parsed.data,
            amount: total_amount,
            token: response.CheckoutRequestID,
            status: "PROCESSING",
            created_at: new Date(),
            updated_at: new Date(),
            store_id: payment_method?.store_id
        }).returning()
    
        return res.status(201).send(generate_dto(
            result?.at(0),
            "Successfully created payment",
            "success"
        ))

    }
    catch (e)
    {
        res.status(500).send(generate_dto(
            e,
            "Something went wrong",
            "error"
        ))
    }



}



export const getPayment: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const payment_id = req.params.payment_id

    if(isEmpty(payment_id)) return res.status(400).send(
        generate_dto(
            null,
            "Please specify a payment id",
            "error"
        )
    )

    try {
        const result = (await db?.query.PAYMENT.findFirst({
            where: eq(PAYMENT.id, payment_id)
        }))

        if(isUndefined(result) || isEmpty(result)) return res.status(404).send(
            generate_dto(
                null,
                "Payment method not found",
                "error"
            )
        )

        res.status(200).send(
            generate_dto(
                result,
                "Found payment method",
                "success"
            )
        )
    }
    catch (e)
    {
        res.status(500).send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }


}


export const updatePayment: HandlerFn = async (req, res, clients) => {

    const { db } = clients


    const id = req.params.payment_id

    const body = req.body

    const parsed = payment.safeParse(body)

    if(!parsed.success) return res.status(400).send(
        generate_dto(
            parsed.error.formErrors.fieldErrors,
            "Invalid body",
            "error"
        )
    )

    if(isEmpty(id) || isUndefined(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID not provided",
            "error"
        )
    )


    try {

        const result = await db?.update(PAYMENT).set({
            ...parsed.data
        }).where(eq(PAYMENT.id, id)).returning()

        return res.status(200).send(
            generate_dto(
                result?.at(0),
                "Updated successfully",
                "success"
            )
        )

    }
    catch(e)
    {
        return res.status(500)
        .send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }


}


export const deletePayment: HandlerFn = async (req, res, clients) =>{
    const { db } = clients

    const payment_id = req.params.payment_id

    if(isEmpty(payment_id)) return res.status(400).send(
        generate_dto(
            null,
            "Please specify a payment id",
            "error"
        )
    )

    try {

        const result = await db?.delete(PAYMENT).where(eq(PAYMENT.id, payment_id)).returning()

        res.status(200).send(generate_dto(
            result?.at(0),
            "Successfully deleted payment",
            "success"
        ))

    }
    catch (e) 
    {
        return res.status(500).send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }

}


export const confirmPayment: HandlerFn = async (req, res, clients) => {

    const { db } = clients

    const id = req.params.payment_id 

    if(isEmpty(id)) return res.status(400).send(
        generate_dto(
            null,
            "ID IS REQUIRED",
            "error"
        )
    )


    try {

        const status = await validatePayment(id)

        res.status(200)
        .send(
            generate_dto(
                status,
                status === "SUCCESS" ? "PAYMENT SUCCESSFUL" : "PAYMENT UNSUCCESSFUL",
                "error"
            )
        )

    }
    catch (e)
    {
        return res.status(500).send(
            generate_dto(
                e,
                "Something went wrong",
                "error"
            )
        )
    }



}

