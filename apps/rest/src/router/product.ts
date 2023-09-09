import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createProduct } from "../resources/product/create";
import { archiveProduct, updateProduct } from "../resources/product/update";
import { getProduct } from "../resources/product/read";
import { storeSecretAuth } from "../../lib/middleware/auth";

const routes: Array<HandlerObj> = [
    {
        fn: createProduct,
        method: "post",
        path: "/products",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: updateProduct,
        method: "put",
        path: "/products/:product_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: getProduct,
        method: "get",
        path: "/products/:product_id",
        middlewares: [
            storeSecretAuth
        ]
    },
    {
        fn: archiveProduct,
        method: "patch",
        path: "/products/:product_id",
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

const productRouter = init_router()

export default productRouter

