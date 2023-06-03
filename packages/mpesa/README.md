# MpesaClient Package Documentation

The MpesaClient is a package used for sending payments and payouts using the Mpesa API. It provides an easy way to send payment requests and handle payouts without dealing with the low-level API details.

## Install

```
# npm
npm install porkytheblack-mpesa
# yarn
yarn add porkytheblack-mpesa
```

## Usage

First, import the package and the dotenv config:

```javascript
import "dotenv/config"
import MpesaClient from 'mpesa/client'
```

Instantiate the MpesaClient class and pass in an object with the following properties:

- `env`: The environment to use. Can be either 'sandbox' or 'production'.
- `consumer_key`: The consumer key you received from the daraja portal.
- `consumer_secret`: The consumer secret you received from the daraja portal.
- `pass_key`: The pass key you received from the daraja portal.
- `business_short_code`: The business short code you received from the daraja portal.
- `callback_url`: The callback URL to be used by the Mpesa API.
- `b2c`: An object with the B2C credentials for B2C transactions. Contains 'password' and 'security_credential'.

Example:

```javascript
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
```

To send a payment request, call the `send_payment_request` method with the following properties:

- `amount`: The amount to be sent.
- `phone_number`: The phone number to send the money to.
- `transaction_desc`: The description of the transaction.
- `transaction_type`: The type of transaction to be performed. Can be either 'CustomerPayBillOnline' or 'CustomerBuyGoodsOnline'.

Example:

```javascript
await client.send_payment_request({
    amount: 20,
    phone_number: Number(process.env.PHONE_NUMBER),
    transaction_desc: "Hey there 👋",
    transaction_type: "CustomerBuyGoodsOnline"
})
```

To send a payout request, call the `send_payout_request` method with the following properties:

- `amount`: The amount to be sent.
- `phone_number`: The phone number to send the money to.
- `description`: The description of the transaction.
- `transaction_type`: The type of transaction to be performed. Can be either 'BusinessPayment', 'SalaryPayment' or 'PromotionPayment'.

Example:

```javascript
await client.send_payout_request({
    amount: 20,
    description: "Hey there 👋",
    phone_number: Number(process.env.PHONE_NUMBER),
    transaction_type: "BusinessPayment"
})
```

## Error Handling

You should handle any errors that may arise from sending payment or payout requests in a try-catch block.

Example:

```javascript
try {
    // send payment or payout request
} catch (e) {
    console.log("Something went wrong::", e)
}
```

## Important Notes

Make sure to set your environment variables appropriately. Use a .env file in your project root or set them directly in your environment.

- `MPESA_CONSUMER_KEY`: Your Mpesa Consumer Key.
- `MPESA_CONSUMER_SECRET`: Your Mpesa Consumer Secret.
- `MPESA_PASSKEY`: Your Mpesa Passkey.
- `MPESA_SHORTCODE`: Your Mpesa Business Shortcode.
- `PHONE_NUMBER`: The phone number for the payment recipient.
- `PASSWORD`: Your B2C password.
- `SECURITY_CREDENTIAL`: Your B2C security credential.

## Returned Responses

The `send_payment_request` and `send_payout_request` methods both return a Promise with the response from the Mpesa API.

The `send_payment_request` method returns a Promise that resolves to an object with the following properties:

- `MerchantRequestID`: A string representing the merchant request ID.
- `CheckoutRequestID`: A string representing the checkout request ID.
- `ResponseCode`: A string representing the response code from the API.
- `ResponseDescription`: A string providing a description of the response.
- `CustomerMessage`: A string message intended for the customer.

The `send_payout_request` method returns a Promise that resolves to an object with the following properties:

- `ConversationID`: A string representing the conversation ID.
- `OriginatorConversationID`: A string representing the originator conversation ID.
- `ResponseCode`: A string representing the response code from the API.
- `ResponseDescription`: A string providing a description of the response.

## Contributing

If you find any bugs or have a feature request, please open an issue on github. We appreciate your contributions!