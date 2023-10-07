import Keys from "./src/services/keys";
import Payment from "./src/services/payment";
import Cart from "./src/services/cart";
import CartItem from "./src/services/cart_item";
import Seller from "./src/services/seller";
import Product from "./src/services/product";
import Customer from "./src/services/customer";
import Checkout from "./src/services/checkout";
import Store from "./src/services/store";
export * from "./lib/services"

import db, { schema } from "db"

export const keys = new Keys(db, schema)
export const payment = new Payment(db, schema)
export const cart = new Cart(db, schema)
export const cart_item = new CartItem(db, schema)
export const seller = new Seller(db, schema)
export const product = new Product(db, schema)
export const customer = new Customer(db, schema)
export const checkout = new Checkout(db, schema)
export const store = new Store(db, schema)


export default {
    keys,
    payment,
    cart,
    cart_item,
    seller,
    product,
    customer,
    checkout,
    store
}


