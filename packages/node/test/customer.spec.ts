import 'dotenv/config'
import { PaymentsClientHttpError, createPaymentClient } from "../src"
import { isNull } from '../src/lib/cjs/lodash'
import assert from 'assert'
import db from 'db'
import { CUSTOMER } from 'db/schema'
import { eq } from 'db/utils'


const client = createPaymentClient(process.env.URL as string, process.env.SECRET_KEY as string)

let customer_id: string | null = null

describe("CUSTOMER", ()=> {

    before(async ()=>{

    })

    describe("TESTS", ()=>{


        it("CREATE CUSTOMER", (done)=>{

            client.customers.create({
                    email: "jimmy@email.com",
                    first_name: "jimmy",
                    last_name: "falcon"
            }).then((data)=>{
                assert.strictEqual(data?.email, "jimmy@email.com")
                assert.strictEqual(data?.first_name, "jimmy")
                customer_id = data?.id ?? null
                done()
            })
            .catch((e)=>{
                if(e instanceof PaymentsClientHttpError){
                    console.log("THE SERVER RESPONDED WITH STATUS::", e.code)
                }
                done(e)
            })

        })

        it("GET CUSTOMER", (done)=> {


            if(isNull(customer_id)) return done(new Error("No customer to get"))

            client.customers.retrieve(customer_id)
            .then((customer)=>{
                assert.strictEqual(customer?.id, customer_id)
                done()
            })
            .catch((e)=>{

                if(e instanceof PaymentsClientHttpError){
                    console.log("Server responded with", e.code)
                    done(e)
                }

                done(e)

            })

        })


        it("Update Customer", (done)=> {

            if(isNull(customer_id)) return done(new Error("No customer to get"))

            client.customers.update(customer_id, {
                last_name: "changed_last_name"
            })
            .then((customer)=>{

                assert.strictEqual(customer?.last_name, "changed_last_name")
                done()
            })
            .catch((e)=>{

                if(e instanceof PaymentsClientHttpError){
                    console.log("Server responded with", e.code)
                    done(e)
                }

                done(e)

            })


            
        })


        it("ARCHIVE CUSTOMER", (done)=>{

            if(isNull(customer_id)) return done(new Error("No customer to archive"))


            client.customers.archive(customer_id)
            .then((customer)=>{
                assert.strictEqual(customer?.status, "ARCHIVED")
                done()
            })
            .catch((e)=>{

                if(e instanceof PaymentsClientHttpError){
                    console.log("Server responded with", e.code)
                    done(e)
                }

                done(e)

            })

        })


    })


    after(async ()=>{


        // delete the customer

        // customer_id && await db.delete(CUSTOMER)
        // .where(eq(CUSTOMER.id, customer_id))

    })

})