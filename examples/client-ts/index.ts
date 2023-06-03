import "dotenv/config"
import MpesaClient from 'mpesa/client'



(async()=>{
    const client = new MpesaClient({
        env: 'sandbox',
        consumer_key: process.env.MPESA_CONSUMER_KEY,
        consumer_secret: process.env.MPESA_CONSUMER_SECRET,
        pass_key: process.env.MPESA_PASSKEY,
        business_short_code: Number(process.env.MPESA_SHORTCODE),
        callback_url: 'https://webhook.site/e20c9ce5-2cf6-493a-8fbc-3167dec7020d',
        b2c: {
            password: process.env.PASSWORD,
            security_credential: process.env.SECURITY_CREDENTIAL
        }
    })


    try {

        await client.send_payment_request({
            amount: 20,
            phone_number: Number(process.env.PHONE_NUMBER),
            transaction_desc: "Hey there 👋",
            transaction_type: "CustomerBuyGoodsOnline"
        })

        await client.send_payout_request({
            amount: 20,
            description: "Hey there 👋",
            phone_number: Number(process.env.PHONE_NUMBER),
            transaction_type: "BusinessPayment"
        })
    } 
    catch (e)
    {
        console.log("Something went wrong::", e)
    }

})()