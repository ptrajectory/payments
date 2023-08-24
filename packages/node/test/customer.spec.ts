import { describe } from "node:test";
import Payments from "../src/index.ts";
import { isNull } from "../src/lib/cjs/lodash.ts";

const payments = new Payments("some_api_key")
let customer_id: string | null

describe("CUSTOMER", ()=>{

    describe("BASIC CRUD", ()=>{
        it("Create a new customer", (done)=>{
            payments.customer?.createCustomers({
                email: "johndoe@email.com",
                first_name: "John",
                last_name: "Doe",
            })
            .then((customer)=>{
                console.log(
                    "Here is the customer", customer
                )

                customer_id = customer?.id ?? null
                done()
            })
            .catch((e)=>{
                console.log("Something went wrong", e)
                done(e)
            })
        })


        it("Get the customer", (done)=>{

            payments.customer?.getCustomer(customer_id)
            .then((customer)=>{
                console.info("CUSTOMER::", customer)
                done()
            })
            .catch((e)=>{
                console.error("ERROR::",e)
                done(e)
            })

        })

        it("Update the customer",(done)=>{

            if (isNull(customer_id)) return done(new Error("CUSTOMER ID IS EMPTY"))

            payments.customer?.updateCustomer(customer_id, {
                meta: {
                    cool: true
                }
            })
            .then((customer)=>{
                console.info("CUSTOMER UPDATED::", customer)
                done()
            })
            .catch((e)=>{
                console.error("ERROR:",e)
                done(e)
            })

        })

        it("Delete the customer", (done)=>{

            if(isNull(customer_id)) return done(new Error("CUSTOMER ID IS EMPTY"))

            payments.customer?.deleteCustomer(customer_id)
            .then((customer)=>{
                console.info("CUSTOMER DELETED::", customer)
                done()
            })
            .catch((e)=>{
                console.error("ERROR:", e)
                done(e)
            })

        })

    })

})