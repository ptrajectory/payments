import mpesaExpressClient  from 'porkytheblack-mpesa/events/express';
import ngrok from 'ngrok'
import { client } from './client.ts'
import app from './app.ts';


let url: string;

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})
describe('Client test', ()=>{
    before(async ()=>{
        url = await ngrok.connect(3000)
        client.set_callback_url(url)
    })

    describe('Send payment request', ()=>{

        it('should send a payment request', (done)=>{


            mpesaExpressClient.on("payment:success", (data)=>{
                done()
            })

            mpesaExpressClient.on("payment:error", (data)=>{
                done()
            })

            mpesaExpressClient.on("payment:invalid", (data)=>{
                done()
            })
            
            client.send_payment_request({
                amount: 5,
                phone_number: Number(process.env.PHONE_NUMBER),
                transaction_desc: "Hey there 👋",
                transaction_type: "CustomerPayBillOnline"
            }).then((data: any)=>{
                console.log("Data::", JSON.stringify(data))
            }).catch((e: any)=>{
                console.log("Error::", e)
            })

        }).timeout(120000)
    })


    describe('Send b2c request', ()=>{

        it('should send a b2c request', (done)=>{


            mpesaExpressClient.on("payout:success", (data)=>{
                done()
            })

            mpesaExpressClient.on("payout:error", (data)=>{
                done()
            })

            mpesaExpressClient.on("payout:invalid", (data)=>{
                done()
            })

            client.send_payout_request({
                amount: 5,
                description: "Hey there 👋",
                phone_number: Number(process.env.PHONE_NUMBER),
                transaction_type: "BusinessPayment"
            }).then((response)=>{
                console.log("Response::", JSON.stringify(response))
            }).catch((e)=>{
                console.log("Error::", e)
            })
        }).timeout(120000)

    })



})