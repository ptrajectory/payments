import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCustomer } from "../resources/customer/create";
import { archiveCustomer, updateCustomer } from "../resources/customer/update";
import { getCustomer } from "../resources/customer/read";
import { storeSecretAuth } from "../../lib/middleware/auth";

const routes: Array<HandlerObj> = [
    {
        fn: createCustomer,
        method: "post",
        path: "/customers",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: updateCustomer,
        method: "put",
        path: "/customers/:customer_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: getCustomer,
        method: "get",
        path: "/customers/:customer_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: archiveCustomer,
        method: "patch",
        path: "/customers/:customer_id",
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

const customerRouter = init_router()

export default customerRouter

