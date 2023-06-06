# `porkytheblack-mpesa` docs

`porkytheblack-mpesa` is a TypeScript library that helps developers interact with the Mpesa API easily. It includes a set of interfaces and classes that encapsulate the behavior of Mpesa API.

## Interfaces

### SendPaymentResponse

```ts
interface SendPaymentResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}
```

This interface represents the response of a payment request.

### SendPayoutResponse

```ts
interface SendPayoutResponse {
    ConversationID: string;
    OriginatorConversationID: string;
    ResponseCode: string;
    ResponseDescription: string;
}
```

This interface represents the response of a payout request.

### B2BSetupCredentials and C2BSetupCredentials

```ts
type B2BSetupCredentials = Partial<{
    password: string;
    security_credential: string;
    consumer_key: string;
    consumer_secret: string;
    pass_key: string;
    short_code: number;
    business_name: string;
}>;

type C2BSetupCredentials = Partial<{
    consumer_key: string;
    consumer_secret: string;
    pass_key: string;
    short_code: number;
    business_name: string;
}>;
```

These types are used for setting up the Mpesa client with the necessary B2B or C2B API credentials.

## Class

### MpesaClient

The main class of this library. It provides methods for interacting with the Mpesa API.

#### Constructor

The constructor accepts an object which includes:

- `env`: The environment to use ('sandbox' or 'production').
- `b2c`: The B2C credentials (B2BSetupCredentials).
- `c2b`: The C2B credentials (C2BSetupCredentials).
- `callback_url`: The callback URL to use for the API.

```ts
const client = new MpesaClient({
    env: 'sandbox',
    c2b: {...},
    b2c: {...},
    callback_url: 'https://example.com'
});
```

#### Methods

##### `send_payment_request`

This method sends a payment request to the Mpesa API and returns a `Promise` that resolves to `SendPaymentResponse`.

```ts
client.send_payment_request({
    transaction_type: 'CustomerPayBillOnline',
    amount: 500,
    phone_number: 123456789,
    transaction_desc: 'Payment for goods'
}).then((response) => {...});
```

##### `send_payout_request`

This method sends a payout request to the Mpesa API and returns a `Promise` that resolves to `SendPayoutResponse`.

```ts
client.send_payout_request({
    transaction_type: 'BusinessPayment',
    amount: 500,
    phone_number: 123456789,
    description: 'Salary for May'
}).then((response) => {...});
```

##### `set_callback_url`

This method sets a new callback URL. Useful for testing when you need to dynamically change the callback URL.

```ts
client.set_callback_url('https://new-callback.com');
```

## Usage

Here's a brief example of how to use this library:

```ts
import MpesaClient from 'porkytheblack-mpesa/client'

const client = new MpesaClient({
    env: 'sandbox',
    c2b: {
        consumer_key: 'your_c2b_consumer_key',
        consumer_secret: 'your_c2b_consumer_secret',
        pass_key: 'your_c2b_passkey',
        short

_code: 12345,
        business_name: 'C2B Sandbox'
    },
    b2c: {
        password: 'your_b2c_password',
        security_credential: 'your_b2c_security_credential',
        consumer_key: 'your_b2c_consumer_key',
        consumer_secret: 'your_b2c_consumer_secret',
        pass_key: 'your_b2c_passkey',
        short_code: 67890,
        business_name: 'testapi'
    },
    callback_url: 'https://example.com'
});

client.send_payment_request({
    transaction_type: 'CustomerPayBillOnline',
    amount: 500,
    phone_number: 123456789,
    transaction_desc: 'Payment for goods'
}).then((response) => {
    console.log(response);
});

client.send_payout_request({
    transaction_type: 'BusinessPayment',
    amount: 500,
    phone_number: 123456789,
    description: 'Salary for May'
}).then((response) => {
    console.log(response);
});
```

Note: Always ensure to secure your keys and secrets. The above example uses hard-coded strings for simplicity. In a real-life application, use environment variables or some other form of secure configuration.

## Development Notice

Please be aware that the `porkytheblack-mpesa` library is currently under active development. We are working hard to make this library as robust, user-friendly, and feature-complete as possible.

As we continue to improve and expand the library, you may notice regular updates. These will often include bug fixes, performance improvements, and even new features. We strongly recommend keeping up to date with the latest versions to benefit from these improvements.

Please rest assured that every update is thoroughly tested to ensure compatibility and minimize any potential disruptions. We understand that updating your dependencies can sometimes be a concern, but we are committed to making each update as smooth and beneficial as possible.

Our goal is to provide you with a stable, reliable, and efficient tool for interacting with the Mpesa API. We appreciate your support and patience as we continue to enhance the `porkytheblack-mpesa` library.

Thank you for choosing `porkytheblack-mpesa` as your Mpesa API solution, and we look forward to helping you achieve your goals.
