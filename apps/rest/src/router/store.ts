import { Router } from "express"
import handler, { HandlerObj } from "../../lib/handler"
import { clerkAuth } from "../../lib/middleware/auth"
import { createStore } from "../resources/store"


const routes: Array<HandlerObj> = [
    {
        fn: createStore,
        method: "post",
        path: "/stores",
        middlewares: [
            clerkAuth
        ]
    },
]

const init_router = () => {
    const router = Router() 

    routes.forEach((route)=>{
        handler(router, route)
    })

    return router 
}

const storeRouter = init_router()


export default storeRouter

