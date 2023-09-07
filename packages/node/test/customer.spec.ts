import 'dotenv/config'
import { createPaymentClient } from "../src"


const client = createPaymentClient("https://8c74-41-80-118-212.ngrok-free.app", process.env.SECRET_KEY as string)

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
                console.log(data)
                done()
            })
            .catch((e)=>{
                console.log("ERROR", e)
                done(e)
            })

        })


    })


    after(async ()=>{

    })

})