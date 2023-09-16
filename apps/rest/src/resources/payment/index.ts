import { PAYMEN_INPUT, payment, payment_input } from "zodiac";
import { AuthenticatedRequest, HandlerFn } from "../../../lib/handler";
import { generate_dto, generate_unique_id } from "generators";
import { CART, CART_ITEM, CHECKOUT, PAYMENT, PAYMENT_METHOD, PRODUCT } from "db/schema";
import { and, eq, sql } from "drizzle-orm";
import mpesaExpressClient from "./mpesa";
import { isEmpty, isNull, isNumber, isString, isUndefined } from "../../../lib/cjs/lodash";
import { validatePayment } from "../../../lib/functions";
import db from "db";
import { TEST_PHONE_NUMBERS } from "../../../lib/CONSTANTS";


const determinPaymentDetails = async (body: PAYMEN_INPUT) => {

    const parsed = payment_input.safeParse(body)

    if(!parsed.success) throw new Error("INVALID PAYMENT INPUT")

    const { amount, payment_method_id, phone_number, checkout_id, payment_option, customer_id } = parsed.data

    if(isNumber(amount) && isString(phone_number)) return  {  amount, phone_number: phone_number, payment_option }
    
    if(isUndefined(payment_method_id) && !isUndefined(checkout_id)){

        const checkout = await db.select({
            product_id: PRODUCT.id,
            amount: sql<number>`${CART_ITEM.quantity} * ${PRODUCT.price}`.mapWith(Number),
            phone_number: PAYMENT_METHOD.phone_number
        })
        .from(CHECKOUT)
        .innerJoin(PAYMENT_METHOD, eq(PAYMENT_METHOD.id, CHECKOUT.payment_method_id))
        .innerJoin(CART, eq(CART.id, CHECKOUT.cart_id))
        .innerJoin(CART_ITEM, eq(CART_ITEM.cart_id, CART.id))
        .innerJoin(PRODUCT, eq(PRODUCT.id, CART_ITEM.product_id))
        .where(eq(CHECKOUT.id, checkout_id))
        .orderBy(PRODUCT.id)

        const agg_total = checkout?.reduce((prev, cur)=> prev + cur.amount, 0)


        return {
            amount: agg_total,
            phone_number: checkout?.at(0)?.phone_number,
            payment_option
        }

    }

    if(!isUndefined(payment_method_id) && !isUndefined(checkout_id)) {

        const checkout = await db.select({
            product_id: PRODUCT.id,
            amount: sql<number>`${CART_ITEM.quantity} * ${PRODUCT.price}`.mapWith(Number),
            phone_number: PAYMENT_METHOD.phone_number
        })
        .from(CHECKOUT)
        .innerJoin(PAYMENT_METHOD, eq(PAYMENT_METHOD.id, payment_method_id))
        .innerJoin(CART, eq(CART.id, CHECKOUT.cart_id))
        .innerJoin(CART_ITEM, eq(CART_ITEM.cart_id, CART.id))
        .innerJoin(PRODUCT, eq(PRODUCT.id, CART_ITEM.product_id))
        .orderBy(PRODUCT.id)

        const agg_total = checkout?.reduce((prev, cur)=> prev + cur.amount, 0)

        return {
            amount: agg_total,
            phone_number: checkout?.at(0)?.phone_number,
            payment_option
        }

    }

    if(!isUndefined(payment_method_id) && !isUndefined(amount)){

        const payment_method = await db.query.PAYMENT_METHOD.findFirst({
            where: (pm, { eq }) => eq(pm.id, payment_method_id)
        })

        return {
            amount,
            phone_number: payment_method?.phone_number,
            payment_option
        }

    }

    if(!isUndefined(customer_id) && !isUndefined(amount)){

        const payment_method = await db.query.PAYMENT_METHOD.findFirst({
            where: (pm, {eq, and})=> and(
                eq(pm.customer_id, customer_id),
                eq(pm.is_default, true)
            ),
            columns: {
                phone_number: true
            }
        })

        if(isUndefined(payment_method?.phone_number) || isNull(payment_method?.phone_number)) throw new Error("Customer has no payment method")

        return {
            amount,
            phone_number: payment_method?.phone_number,
            payment_option
        }

    }

    throw new Error("Unable to determin payment details")

}



export const createPayment: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

    const { db } = clients

    const body = req.body
    const parsed = payment_input.safeParse(body)

    if(!parsed.success) return res.status(400).send(generate_dto(
        parsed.error.formErrors.fieldErrors,
        "Invalid body",
        "error"
    ))


    const data = parsed.data

    try {

        const paymentDetails = await determinPaymentDetails(data)
        const { amount, payment_option, phone_number } = paymentDetails



        switch(payment_option){
            case "MPESA": {
                if(req.env === "production") { // PRODUCTION ENV
                    const response = await mpesaExpressClient.client.send_payment_request({
                        amount: 2,//TODO: remove me
                        phone_number: Number(phone_number),
                        transaction_type: "CustomerPayBillOnline",
                        transaction_desc: "Online Purchase"
                    })

                    const result = await db?.insert(PAYMENT).values({
                        id: generate_unique_id("pay"),
                        amount: amount,
                        token: response.CheckoutRequestID,
                        status: "PROCESSING",
                        created_at: new Date(),
                        updated_at: new Date(),
                        store_id: req.store.id,
                        environment: req.env,
                        checkout_id: parsed.data.checkout_id,
                        payment_method_id: parsed.data.payment_method_id,
                        customer_id: parsed.data.customer_id,
                    }).returning()


                    return res.status(201).send(generate_dto(result?.at(0), "success", "success"))

                }

                if(req.env === "testing") { // TESTING ENV

                    const result = await db?.insert(PAYMENT).values({
                        id: generate_unique_id("pay"),
                        amount: amount,
                        token: generate_unique_id("test_payment_token"),
                        status: "PROCESSING",
                        store_id: req.store.id,
                        environment: req.env,
                        checkout_id: parsed.data.checkout_id ?? null,
                        payment_method_id: parsed.data.payment_method_id ?? null ,
                        customer_id: parsed.data.customer_id ?? null,
                        created_at: new Date(),
                        updated_at: new Date()
                    }).returning()


                    // check phone numbers

                    if(phone_number === TEST_PHONE_NUMBERS?.[payment_option].error || phone_number !== TEST_PHONE_NUMBERS?.[payment_option].success){
                        mpesaExpressClient.emit("payment:error", {
                            Body: {
                                stkCallback: {
                                    // @ts-ignore
                                    CheckoutRequestID: result?.at(0)?.token,
                                    ResultCode: 1123,
                                    MerchantRequestID: "mrch",
                                }
                            }
                        })

                    }

                    if(phone_number === TEST_PHONE_NUMBERS?.[payment_option].success){
                        mpesaExpressClient.emit("payment:success", {
                            Body: {
                                stkCallback: {
                                    CheckoutRequestID: result?.at(0)?.token ?? "",
                                    ResultCode:0,
                                    ResultDesc: "success",
                                    MerchantRequestID: "mrch_some_id"
                                }
                            }
                        })

                    }

                    return res.status(201).send(generate_dto(result?.at(0), "success", "success"))

                }
            };
            default: {
                return
            }

        }
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

export const getPayment: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

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
            where: and(
                eq(PAYMENT.id, payment_id),
                // @ts-ignore
                eq(PAYMENT.store_id, req.store?.id),
                eq(PAYMENT.environment, req.env)
            )
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


export const updatePayment: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

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
        }).where(and(
            eq(PAYMENT.id, id)),
            // @ts-ignore
            eq(PAYMENT.store_id, req.store.id),
            eq(PAYMENT.environment, req.env)
        ).returning()

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


export const archivePayment: HandlerFn<AuthenticatedRequest> = async (req, res, clients) =>{
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

        const result = await db?.delete(PAYMENT).where(
            and(
                eq(PAYMENT.id, payment_id),
                // @ts-ignore
                eq(PAYMENT.store_id, req.store.id),
                eq(PAYMENT.environment, req.env)
            ),
        ).returning()

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


export const confirmPayment: HandlerFn<AuthenticatedRequest> = async (req, res, clients) => {

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

        const payment = await db?.query.PAYMENT.findFirst({
            where: (pm, { eq, and }) => and(
                // @ts-ignore
                eq(pm.store_id, req.store.id),
                eq(pm.environment, req.env)
            ),
            columns: {
                id: true
            }
        })

        if(isUndefined(payment)) return res.status(404).send(generate_dto(null, "No such payment exists", "error"))

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

