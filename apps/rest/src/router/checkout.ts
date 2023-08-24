import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCheckout } from "../resources/checkout/create";
import { deleteCheckout, updateCheckout } from "../resources/checkout/update";
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
        path: "/checkouts/:checkout_id"
    },
    {
        fn: getCheckout,
        method: "get",
        path: "/checkouts/:checkout_id"
    },
    {
        fn: deleteCheckout,
        method: "delete",
        path: "/checkouts/:checkout_id"
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

