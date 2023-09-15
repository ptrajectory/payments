import assert from "assert"
import { PaymentsClientHttpError, createPaymentClient } from "../src"
import { isEmpty, isNull } from "../src/lib/cjs/lodash"
import db from "db"
import { PAYMENT } from "db/schema"
import { eq } from "db/utils"



const client = createPaymentClient(process.env.URL as string, process.env.SECRET_KEY as string)


let payment_id: string | null = null

describe('Payments', () => { 

    before(async ()=>{

        // NO thing here yet

    })


    it("Without prior details", (done)=>{

        client.payments.start({
            amount: 3000,
            phone_number: "254711111111",
            payment_option: "MPESA"
        })
        .then((payment)=>{
            assert(!isEmpty(payment?.token))
            payment_id = payment?.id ?? null
            done()
        })
        .catch((e)=>{

            if(e instanceof PaymentsClientHttpError){
                console.log("Server responded with::", e.code)
            }

            done(e)

        })
        

    })

    it("Confirm Payment", (done)=>{

        if(isNull(payment_id)) return done(new Error("Payment ID empty"))

        client.payments.confirm(payment_id)
        .then((status)=>{
            assert.strictEqual(status, "SUCCESS")
            done()
        })
        .catch((e)=>{

            if(e instanceof PaymentsClientHttpError){
                console.log("Server responded with::", e.code)
            }

            done(e)
        })
    })

    it("Retrieve Payment", (done)=>{

        if(isNull(payment_id)) return done(new Error("Payment ID empty "))

        client.payments.retrieve(payment_id)
        .then((payment)=>{
            assert.strictEqual(payment?.id, payment_id)
            done()
        })
        .catch((e)=>{
            if(e instanceof PaymentsClientHttpError){
                console.log("Server responded with::", e.code)
            }

            done(e)
        })

    })


    after(async ()=>{

        // delete payment

        // payment_id && await db.delete(PAYMENT)
        // .where(eq(PAYMENT.id, payment_id))

    })

})