import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCheckout } from "../resources/checkout/create";
import { updateCheckout } from "../resources/checkout/update";
import { getCheckout } from "../resources/checkout/read";

const routes: Array<HandlerObj> = [
    {
        fn: createCheckout,
        method: "post",
        path: "/checkouts"
    },
    {
        fn: updateCheckout,
        method: "put",
        path: "/checkouts"
    },
    {
        fn: getCheckout,
        method: "get",
        path: "/checkouts"
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

