import assert from "assert"
import Payments from "../src"

const payments = new Payments("")
let customer_id: string | null = null
let payment_method_id: string | null = null

describe("PAYMENT METHODS", ()=>{

    before(async ()=>{
        
        const customer = await payments.customer?.createCustomers({
            first_name: "James",
            last_name: "Dean",
            email: "james@email.com",
        })

        customer_id = customer?.id ?? null

        console.log("New Customer ID", customer_id)

    })


    describe("BASIC CRUD", ()=>{


        it("Create payment method ", (done)=>{

            payments.payment_method?.createPaymentMethod({
                customer_id: customer_id ?? "",
                phone_number: "0784679056",
                type: "MPESA"
            }).then((pm)=>{
                console.log("PAYMENT_METHOD", pm)
                assert.match((pm?.id ?? ""), /pm/)
                assert.strictEqual(pm?.customer_id, customer_id)
                payment_method_id = pm?.id ?? null
                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })

        })


        it("Get payment method", (done)=>{

            payments.payment_method?.getPaymentMethod(payment_method_id ?? "")?.then((payment_method)=>{
                console.log("PAYMENT_METHOD", payment_method)
                assert.strictEqual(payment_method.id, payment_method_id)
                assert.strictEqual(payment_method?.customer_id, customer_id)

                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })

        })


        it("Update payment method", (done)=>{

            payments.payment_method?.updatePaymentMethod(payment_method_id ?? "", {
                type: "AIRTEL MONEY"
            }).then((payment_method)=>{
                console.log("PAYMENT_METHOD", payment_method)
                assert.strictEqual(payment_method.id, payment_method_id)
                assert.strictEqual(payment_method?.customer_id, customer_id)
                assert.strictEqual(payment_method?.type, "AIRTEL MONEY")

                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })

        })

        it("Delete payment method", (done)=>{
            payments.payment_method?.deletePaymentMethod(payment_method_id ?? "")?.then((payment_method)=>{
                console.log("PAYMENT_METHOD", payment_method)
                assert.strictEqual(payment_method.id, payment_method_id)
                assert.strictEqual(payment_method?.customer_id, customer_id)

                done()
            })
            .catch((e)=>{
                console.error("ERROR", e)
                done(e)
            })
        })


    })



    after(async ()=>{

        // Delete the customer we created
        await payments.customer?.deleteCustomer(customer_id)

    })

})