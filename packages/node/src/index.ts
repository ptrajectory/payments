import { ParamsError, PaymentsClientHttpError, PaymentsClientParseError } from './lib/net';
import Payment from "./resources/payments";
import PaymentsHttpClient from "./lib/net";
import Product from "./resources/product";
import Customer from "./resources/customer";
import PaymentMethod from "./resources/payment_method";
import Cart from "./resources/cart";
import Checkout from "./resources/checkout";
import { isUndefined } from './lib/cjs/lodash';


/**
 * @name createPaymentClient
 * @description create and instance of the payment client to use
 * @example 
 *          const client = createPaymentClient("http://localhost:8089", "YOUR SECRET KEY GOT FROM THE DASHBOARD")
 * 
 *          const payment  = client.payments.start({
 *              amount: 200,
 *              currency: "KES",
 *              customer_id: "cus_4839303-3-3-3-3-3-933"
 *          })
 * 
 *          payment.then(console.log).catch(console.log)
 * @param url - where the rest api is hosted, defaults to your localhost at http://localhost:8089 
 * @param secretKey - secret key for the seller, got from the dashboard
 * @returns 
 */
export const createPaymentClient = (url: string, secretKey:string ) => {

  if(isUndefined(url) || url?.length === 0) throw new Error("INVALID URL")

  if(isUndefined(secretKey) || secretKey?.length === 0) throw new Error("INVALID URL")

  const client = new PaymentsHttpClient()

  client.url = url 

  client.secretKey = secretKey

  return {
      /**
       * Interact with payments
       */
      payments: new Payment(client),
      /**
       * Interact with products
       */
       products: new Product(client),
       /**
        * Interact with customers
        */
       customers: new Customer(client),
      /**
       * Interact with payment methods
       */
      paymentMethods: new PaymentMethod(client),
      /**
       * Interact with carts
       */
      carts: new Cart(client),
      /**
       * Interact with checkouts
       */
      checkouts: new Checkout(client)
  }
}


export {
  PaymentMethod,
  Checkout,
  Payment,
  Product,
  Customer,
  Cart,
  ParamsError,
  PaymentsClientHttpError,
  PaymentsClientParseError
}