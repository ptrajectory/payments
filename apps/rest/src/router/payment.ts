import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createPayment, getPayment, updatePayment } from "../resources/payment";

const routes: Array<HandlerObj> = [
    {
        fn: createPayment,
        method: "post",
        path: "/payments"
    },
    {
        fn: updatePayment,
        method: "put",
        path: "/payments/:payment_id"
    },
    {
        fn: getPayment,
        method: "get",
        path: "/payments/:payment_id"
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

