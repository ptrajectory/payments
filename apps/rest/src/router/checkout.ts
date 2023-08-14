import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCheckout } from "../resources/checkout/create";
import { updateCheckout } from "../resources/checkout/update";

const routes: Array<HandlerObj> = [
    {
        fn: createCheckout,
        method: "post",
        path: "/checkout/create"
    },
    {
        fn: updateCheckout,
        method: "put",
        path: "/checkout/update"
    }
]

const init_router = () => {
    const router = Router() 

    routes.forEach((route)=>{
        handler(router, route)
    })

    return router 
}

const checkoutRouter = init_router()

export default checkoutRouter

