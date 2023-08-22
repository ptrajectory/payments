import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCheckout } from "../resources/checkout/create";
import { updateCheckout } from "../resources/checkout/update";
import { createPaymentMethod } from "../resources/payment_method/create";
import { deletePaymentMethod, updatePaymentMethod } from "../resources/payment_method/update";
import { getPaymentMethod } from "../resources/payment_method/read";

const routes: Array<HandlerObj> = [
    {
        fn: createPaymentMethod,
        method: "post",
        path: "/payment_methods"
    },
    {
        fn: updatePaymentMethod,
        method: "put",
        path: "/payment_methods/:payment_method_id"
    },
    {
        fn: getPaymentMethod,
        method: "get",
        path: "/payment_methods/:payment_method_id"
    },
    {
        fn: deletePaymentMethod,
        method: "delete",
        path: "/payment_methods/:payment_method_id"
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

