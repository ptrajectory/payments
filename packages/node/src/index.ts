import Checkout from "./resources/checkout";
import Customer from "./resources/customer";
import PaymentMethod from "./resources/payment_method";
import Cart from "./resources/cart";
import Product from "./resources/product";
import Payment from "./resources/payments";

class Payments {
  public customer: Customer | null = null;
  public checkout: Checkout | null = null;
  public payment_method: PaymentMethod | null = null;
  public cart: Cart | null = null;
  public product: Product | null = null;
  public payment: Payment | null = null

  constructor(API_KEY: string) {
    this.customer = new Customer(API_KEY);
    this.checkout = new Checkout(API_KEY);
    this.payment_method = new PaymentMethod(API_KEY);
    this.cart = new Cart(API_KEY);
    this.product = new Product(API_KEY);
    this.payment = new Payment(API_KEY)
  }
}

export default Payments