import mpesaExpressClient  from 'porkytheblack-mpesa/events/express';
import ngrok from 'ngrok'
import app from './app.ts';
import request from 'supertest';


let url: string;

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})
describe('Client test', ()=>{
    before(async ()=>{
        url = await ngrok.connect(3000)
        mpesaExpressClient.setTestUrl(url)
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


            request(app).post('/c2b/payment-request').send({
                amount: 5,
                phone_number: Number(process.env.PHONE_NUMBER),
                transaction_desc: "Hey there 👋",
                transaction_type: "CustomerPayBillOnline"
            }).expect(200).then((res)=>{
                console.log("Response::", JSON.stringify(res.body))
            }).catch((e)=>{
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

            request(app)
            .post("/b2c/payout-request")
            .send({
                amount: 5, 
                phone_number: Number(process.env.PHONE_NUMBER),
                transaction_desc: "Hey there 👋",
                transaction_type: "BusinessPayment"
            }).then((data)=> {
                console.log("Response::", JSON.stringify(data.body))
            }).catch((e)=>{
                console.log("Error::", e)
            })
        }).timeout(120000)
    })



})