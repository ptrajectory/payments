import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { NextFunction, Request, Response, Router } from "express";
import db from "db";
import { APPCLIENTS, clients } from "./clients";
import { isEmpty, isUndefined } from "./cjs/lodash";
import { STORE } from "zodiac";




/**
 * HandlerFn - a function that handles a request
 */
export type HandlerFn<T = Request> = (req: T, res: Response, clients: APPCLIENTS)=>Promise<unknown>

export type MiddleWareFn = (req: Request, res: Response, next: NextFunction) => unknown

/**
 * HandlerObj - an object that contains a handler function and the path and method it handles
 */
export type HandlerObj<T = any> = { // this generic typing is just to make typescript happy
    fn: HandlerFn<T>,
    path: string, 
    method: "get" | "post" | "put" | "delete" | "patch",
    middlewares?: Array<MiddleWareFn>
}

/**
 * 
 * @param router { Router } - express router
 * @param handler handler object - contains a handler function and the path and method it handles 
 */
async function handler(router: Router, handler: HandlerObj) {
    try {
        var wares = handler.middlewares
        if (isUndefined(wares) || isEmpty(wares)) {
            return router[handler.method](handler.path, (req, res)=> handler.fn(req, res, clients))
        }

        router[handler.method](handler.path, ...wares,(req, res)=> handler.fn(req, res, clients))
    }
    catch (e)
    {
      console.error("UNHANDLED ERROR:", e)  
    }
}

export type AuthenticatedRequest = Request & {
    env: "production" | "testing",
    store: STORE
    token: string
}

export type ClerkAuthenticatedRequest = Request & {
    uid: string
    id: string
}

export default handler