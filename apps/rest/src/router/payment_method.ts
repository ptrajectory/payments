import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCheckout } from "../resources/checkout/create";
import { updateCheckout } from "../resources/checkout/update";
import { createPaymentMethod } from "../resources/payment_method/create";
import { updatePaymentMethod } from "../resources/payment_method/update";

const routes: Array<HandlerObj> = [
    {
        fn: createPaymentMethod,
        method: "post",
        path: "/paymentmethod/create"
    },
    {
        fn: updatePaymentMethod,
        method: "put",
        path: "/paymentmethod/update"
    }
]

const init_router = () => {
    const router = Router() 

    routes.forEach((route)=>{
        handler(router, route)
    })

    return router 
}

const paymentMethodRouter = init_router()

export default paymentMethodRouter

