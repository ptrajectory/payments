import { createPaymentClient } from "ptrajectory-payments-node";


const client = createPaymentClient("https://payments-api.ptrajectory.com", "test_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSG9ubyIsImlkIjoic3RyXzFkMTc1ZjIyYjI5NjNlMTA1N2EyZDY5NjJiNmIyMWE0Iiwic2VsbGVyX2lkIjoic2xsXzJhNDQxYzdjYmU2MjgwMThiMDMxZDIzMzJjYThkMmI0IiwiZW52IjoidGVzdGluZyIsImlhdCI6MTY5NDc2OTE0N30.2Jy7TlN_9BXqzsU4JZVknh1L0pcTnXTZ10MbKCp1uBs");

(async ()=>{

    const payment = await client.payments.start({
        amount: 222,
        phone_number: "254711111111"
    })

    const status = await client.payments.confirm(payment.id)

    if(status === "SUCCESS") {
        console.log("Payment succcessdf")
        return
    }

    console.log("PAYMENT ERRO")

})()