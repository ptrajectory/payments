import MpesaClient from 'porkytheblack-mpesa/client'

import 'dotenv/config'


const client = new MpesaClient({
    env: 'sandbox',
    c2b: {
        consumer_key: process.env.C2B_MPESA_CONSUMER_KEY,
        consumer_secret: process.env.C2B_MPESA_CONSUMER_SECRET,
        pass_key: process.env.C2B_MPESA_PASSKEY,
        short_code: Number(process.env.C2B_MPESA_SHORTCODE),
        business_name: "C2B Sandbox"
    },
    b2c: {
        password: process.env.B2C_PASSWORD,
        security_credential: process.env.B2C_SECURITY_CREDENTIAL,
        consumer_key: process.env.B2C_MPESA_CONSUMER_KEY,
        consumer_secret: process.env.B2C_MPESA_CONSUMER_SECRET,
        pass_key: process.env.B2C_MPESA_PASSKEY,
        short_code: Number(process.env.B2C_MPESA_SHORTCODE),
        business_name: "testapi"
    },
})


export {
    client
}