import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCart, createCartItem } from "../resources/cart/create";
import { archiveCart, deleteCartItem, updateCart, updateCartItem } from "../resources/cart/update";
import { getCart } from "../resources/cart/read";
import { storePublicAuth } from "../../lib/middleware/auth";

const routes: Array<HandlerObj> = [
    {
        fn: createCart,
        method: "post",
        path: "/carts",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: updateCart,
        method: "put",
        path: "/carts/:cart_id",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: getCart,
        method: "get",
        path: "/carts/:cart_id",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: createCartItem,
        method: "post",
        path: "/carts/:cart_id",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: updateCartItem,
        method: "put",
        path: "/carts/:cart_id/:cart_item_id",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: archiveCart,
        method: "patch",
        path: "/carts/:cart_id",
        middlewares: [
            storePublicAuth
        ]
    },
    {
        fn: deleteCartItem,
        method: "delete",
        path: "/carts/:cart_id/:cart_item_id",
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

const cartRouter = init_router()

export default cartRouter

