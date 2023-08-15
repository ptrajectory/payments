import Checkout from "./resources/checkout";
import Customer from "./resources/customer";
import PaymentMethod from "./resources/payment_method";


class Payments {

    public customer: Customer | null = null
    public checkout: Checkout | null = null
    public payment_method: PaymentMethod | null = null

    constructor(API_KEY: string){
        this.customer = new Customer(API_KEY)
        this.checkout = new Checkout(API_KEY)
        this.payment_method = new PaymentMethod(API_KEY)
    }



}