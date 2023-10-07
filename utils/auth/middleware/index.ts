import {Middleware} from "koa";
import process from "process";
import {decryptToken, validateJWT} from "../utils";
import { STORE } from "zodiac"


export  const SecureForFriends: Middleware = async (ctx, next) => {
    let auth_header = ctx.request.headers["authorization"] ?? null;

    if(!auth_header) {
        ctx.response.status = 403;
        ctx.response.body = "FORBIDDEN";
        return
    }

    auth_header = auth_header.replace("Bearer ", "")

    if(!(process.env.FRIEND_KEY == auth_header)){
        ctx.response.status = 401;
        ctx.response.body = "UNAUTHORIZED";
        return
    }

    return next()
}


export const SecureForApps: Middleware = async (ctx, next) => {

    const store_id = ctx.request.headers["x-store-id"] ?? null
    const store_secret = ctx.request.headers['x-store-secret'] ?? null

    if(Array.isArray(store_id) || store_id == null ){
        ctx.response.status = 401;
        ctx.response.body = "UNAUTHORIZED"
        return;
    }

    if(Array.isArray(store_secret) || store_secret == null){
        ctx.response.status = 401;
        ctx.response.body = "UNAUTHORIZED"
        return;
    }

    let striped_store_id = store_id.replace(/(test_|prod_)/ig, "").replaceAll(" ", "")
    let striped_store_secret = store_secret.replace(/(test_|prod_)/, "").replaceAll(" ", "")

    if(striped_store_id.length == 0 || striped_store_secret.length == 0) {
        ctx.response.status = 401;
        ctx.response.body = "UNAUTHORIZED"
        return
    }


    try{
        const token = decryptToken(striped_store_secret)

        ctx.request.store = validateJWT<STORE>(token)
        ctx.request.environment = ctx.request.environment ?? "testing";

        return next()
    }
    catch (e)
    {
        if(e instanceof  Error)
        {
            if(e.message == 'error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt')
            {
                ctx.response.status = 401;
                ctx.response.body = "UNAUTHORIZED\nHINT:CORRUPTED_TOKEN"
                return
            }

            if(e.message == "Invalid final block length")
            {
                ctx.response.status = 401;
                ctx.response.body = "UNAUTHORIZED"
                return
            }

            ctx.response.status = 500;
            ctx.response.body = "UNKNOWN ERROR OCCURRED"

        }
        else
        {
            ctx.response.status = 500;
            ctx.response.body = "UNKNOWN ERROR OCCURRED"
            return
        }

    }


}

