import { isNull } from "../src/lib/cjs/lodash"
import { PaymentsClientHttpError, createPaymentClient } from "../src"
import assert from "assert"
import db from "db"
import { CUSTOMER, PAYMENT_METHOD } from "db/schema"
import { eq } from "db/utils"


const client = createPaymentClient(process.env.URL as string, process.env.SECRET_KEY as string)

let customer_id: string | null = null
let payment_method_id: string | null = null


describe("PAYMENT METHODS", ()=>{
    before(async ()=>{

        const customer = await client.customers.create({
            first_name: "Jon",
            last_name: "Snow",
            email: "jsnow@email.com"
        })

        customer_id = customer?.id ?? null


    })

    it("CREATE A PAYMENT METHOD", (done)=>{

        if(isNull(customer_id)) return done(new Error("Customer ID is empty"))

        client.paymentMethods.create({
            customer_id,
            phone_number: "254711111111",
            type: "MPESA"
        })
        .then((payment_method)=>{
            assert.strictEqual(payment_method?.customer_id, customer_id)
            payment_method_id = payment_method?.id ?? null
            done()
        })
        .catch((e)=>{

            if(e instanceof PaymentsClientHttpError){
                console.log("Server responded with::", e?.code) 
            }

            done(e)

        })

    })


    it("Retrieve Payment Method", (done)=>{

        if(isNull(payment_method_id)) return done(new Error("Payment Method Id is null"))


        client.paymentMethods.retrieve(payment_method_id)
        .then((payment_method)=>{

            assert.strictEqual(payment_method?.id, payment_method_id)
            assert.strictEqual(payment_method?.customer_id, customer_id)

            done()

        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server responded with::", e?.code) 
            }

            done(e)
        })

    })


    it("Update Payment Method", (done)=>{

        if(isNull(payment_method_id)) return done(new Error("PaymentMethod ID is null"))

        client.paymentMethods.update(payment_method_id, {
            phone_number: "254700000000"
        }).then((payment_method)=>{

            assert.strictEqual(payment_method?.id, payment_method_id)
            assert.strictEqual(payment_method?.phone_number, "254700000000")

            done()

        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server responded with::", e?.code) 
            }

            done(e)
        })

    })


    it("Archive Payment Method", (done)=>{

        if(isNull(payment_method_id)) return done(new Error("Payment Method ID is null"))

        client.paymentMethods.archive(payment_method_id)
        .then((payment_method)=>{
            assert.strictEqual(payment_method?.id, payment_method_id)
            assert.strictEqual(payment_method?.phone_number, "254700000000")

            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server responded with::", e?.code) 
            }

            done(e)
        })

    })


    after(async ()=>{

        // // delete payment method

        // payment_method_id && await db.delete(PAYMENT_METHOD)
        // .where(eq(PAYMENT_METHOD.id, payment_method_id))


        // // delete customer

        // customer_id && await db.delete(CUSTOMER)
        // .where(eq(CUSTOMER.id, customer_id))

    })

})