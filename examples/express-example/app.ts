import "dotenv/config"
import express from 'express'
import mpesaExpressClient from 'porkytheblack-mpesa/events/express'

process.on('uncaughtException', (e)=>{
    console.log("Error::", e)
})


const app = express()


const router = express.Router()

router.post('/c2b/callback', mpesaExpressClient.paymentsCallbackHandler)

mpesaExpressClient.on('payment:success', (data)=>{
    console.log("Payment success::",data)
})

mpesaExpressClient.on('payment:error', (data)=>{
    console.log("Payment error::",data)
})

mpesaExpressClient.on("payment:invalid", (data)=>{
    console.log("Payment invalid::",data)
})


router.post('/b2c/result', mpesaExpressClient.payoutsCallbackHandler)
router.post('/b2c/timeout', mpesaExpressClient.payoutsCallbackHandler)
mpesaExpressClient.on('payout:success', (data)=>{
    console.log("Payout success::",data)
})

mpesaExpressClient.on('payout:error', (data)=>{
    console.log("Payout error::",data)
})

mpesaExpressClient.on("payout:invalid", (data)=>{
    console.log("Payout invalid::",data)
})


app.use(express.json())

app.use(router)

export default app