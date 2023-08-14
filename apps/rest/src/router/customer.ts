import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCustomer } from "../resources/customer/create";
import { updateCustomer } from "../resources/customer/update";

const routes: Array<HandlerObj> = [
    {
        fn: createCustomer,
        method: "post",
        path: "/customer/create"
    },
    {
        fn: updateCustomer,
        method: "put",
        path: "/customer/update"
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

