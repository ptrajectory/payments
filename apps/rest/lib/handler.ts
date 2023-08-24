import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { NextFunction, Request, Response, Router } from "express";
import db from "db";
import { APPCLIENTS, clients } from "./clients";
import { isEmpty, isUndefined } from "./cjs/lodash";




/**
 * HandlerFn - a function that handles a request
 */
export type HandlerFn = (req: Request, res: Response, clients: APPCLIENTS)=>Promise<unknown>

export type MiddleWareFn = (req: Request, res: Response, next: NextFunction) => unknown

/**
 * HandlerObj - an object that contains a handler function and the path and method it handles
 */
export type HandlerObj = {
    fn: HandlerFn,
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

export default handler