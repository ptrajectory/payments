import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCheckout } from "../resources/checkout/create";
import { archiveCheckout, updateCheckout } from "../resources/checkout/update";
import { getCheckout } from "../resources/checkout/read";
import { storePublicAuth } from "../../lib/middleware/auth";

const routes: Array<HandlerObj> = [
    {
        fn: createCheckout,
        method: "post",
        path: "/checkouts",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: updateCheckout,
        method: "put",
        path: "/checkouts/:checkout_id",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: getCheckout,
        method: "get",
        path: "/checkouts/:checkout_id",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: archiveCheckout,
        method: "patch",
        path: "/checkouts/:checkout_id", 
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

const checkoutRouter = init_router()

export default checkoutRouter

