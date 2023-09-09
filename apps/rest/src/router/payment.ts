import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { confirmPayment, createPayment, getPayment, updatePayment } from "../resources/payment";
import { storePublicAuth, storeSecretAuth, withEphemeralKey } from "../../lib/middleware/auth";

const routes: Array<HandlerObj> = [
    {
        fn: createPayment,
        method: "post",
        path: "/payments",
        middlewares: [
            withEphemeralKey
        ]
    },
    {
        fn: updatePayment,
        method: "put",
        path: "/payments/:payment_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: getPayment,
        method: "get",
        path: "/payments/:payment_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: confirmPayment,
        method: "get",
        path: "/payments/confirm/:payment_id", // this way we can support client side polling without introducing a security vulnerability
        middlewares: [
            storePublicAuth
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

const paymentRouter = init_router()


export default paymentRouter

