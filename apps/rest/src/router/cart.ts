import { Router } from "express";
import handler, { HandlerObj } from "../../lib/handler";
import { createCart, createCartItem } from "../resources/cart/create";
import { deleteCart, deleteCartItem, updateCart, updateCartItem } from "../resources/cart/update";
import { getCart } from "../resources/cart/read";

const routes: Array<HandlerObj> = [
    {
        fn: createCart,
        method: "post",
        path: "/carts"
    },
    {
        fn: updateCart,
        method: "put",
        path: "/carts/:cart_id"
    },
    {
        fn: getCart,
        method: "get",
        path: "/carts/:cart_id"
    },
    {
        fn: createCartItem,
        method: "post",
        path: "/carts/:cart_id"
    },
    {
        fn: updateCartItem,
        method: "put",
        path: "/carts/:cart_id/:cart_item_id"
    },
    {
        fn: deleteCart,
        method: "delete",
        path: "/carts/:cart_id"
    },
    {
        fn: deleteCartItem,
        method: "delete",
        path: "/carts/:cart_id/:cart_item_id"
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

