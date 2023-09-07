import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCheckout } from "../resources/checkout/create";
import { updateCheckout } from "../resources/checkout/update";
import { createPaymentMethod } from "../resources/payment_method/create";
import { archivePaymentMethod, updatePaymentMethod } from "../resources/payment_method/update";
import { getPaymentMethod } from "../resources/payment_method/read";
import { storeSecretAuth } from "../../lib/middleware/auth";

const routes: Array<HandlerObj> = [
    {
        fn: createPaymentMethod,
        method: "post",
        path: "/payment_methods",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: updatePaymentMethod,
        method: "put",
        path: "/payment_methods/:payment_method_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: getPaymentMethod,
        method: "get",
        path: "/payment_methods/:payment_method_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: archivePaymentMethod,
        method: "patch",
        path: "/payment_methods/:payment_method_id",
        middlewares: [
            storeSecretAuth
        ]
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

