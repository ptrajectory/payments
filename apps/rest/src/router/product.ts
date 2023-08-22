import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createProduct } from "../resources/product/create";
import { deleteProduct, updateProduct } from "../resources/product/update";
import { getProduct } from "../resources/product/read";

const routes: Array<HandlerObj> = [
    {
        fn: createProduct,
        method: "post",
        path: "/products"
    },
    {
        fn: updateProduct,
        method: "put",
        path: "/products/:product_id"
    },
    {
        fn: getProduct,
        method: "get",
        path: "/products/:product_id"
    },
    {
        fn: deleteProduct,
        method: "delete",
        path: "/products/:product_id"
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

