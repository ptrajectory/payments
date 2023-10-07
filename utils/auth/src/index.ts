import Router from "@koa/router";
import Koa from "koa";
import logger from "koa-logger"
import {koaBody} from "koa-body"
import {store} from "zodiac"
import oracle from "oracle";
import {createJWT, encryptToken} from "../utils";
import {SecureForApps, SecureForFriends} from "../middleware";
import {eq} from "drizzle-orm";
import {schema} from "db"
import fs from "fs";

const app = new Koa()


app.use(koaBody({
    jsonLimit: '1kb'
}))
app.use(logger())

const router = new Router();

router
    .get("ping", "/ping", (ctx)=>{

    ctx.response.body = {
        ping: "ping"
    }

    ctx.status = 200;

    return ctx;
})


router
    .use(SecureForFriends)
    .get("public-key", "/well-known", (ctx)=>{
        ctx.response.body =fs.readFileSync("./KEYS/public.pem", 'utf-8')
        ctx.status = 200;
        return
    })

router
    .use(SecureForFriends)
    .post("keygen", "/store-keygen", async (ctx)=>{
    const body = ctx.request.body;

    const parsed = store.safeParse(body);

    if(!parsed.success){
        ctx.response.status = 400;
        ctx.response.body = "INVALID BODY";
        return
    }
    const {data} = parsed

    const testingEnvironmentToken = createJWT({
        ...data,
        environment: "testing"
    }, {
        algorithm: "RS256"
    })


    const productionEnvironmentToken = createJWT({
        ...data,
        environment: "production"
    }, {
        algorithm: "RS256"
    })


    const testingEnvironmentEncryption = "test_" + encryptToken(testingEnvironmentToken)

    const productionEnvironmentEncryption = "prod_" + encryptToken(productionEnvironmentToken)


    try {
        await oracle.keys.create({
            name: "testing_environment_key",
            value: testingEnvironmentEncryption,
            store_id: data.id
        })

        await oracle.keys.create({
            name: "production_environment_key",
            value: productionEnvironmentEncryption,
            store_id: data.id
        })

    }
    catch (e)
    {
        ctx.response.status = 500;
        ctx.response.body = "AN UNKNOWN ERROR OCCURRED"
        return;
    }
})

router
    .use(SecureForFriends)
    .get("store-keys","/store-keys", async (ctx)=> {

        const store_id = ctx.request.headers["x-store-id"]

        if(!store_id){
            ctx.response.status = 400
            ctx.body = "STORE ID NOT SPECIFIED"
            return
        }

        if(Array.isArray(store_id)){
            ctx.response.status = 400;
            ctx.body = "STORE ID IS INVALID"
            return
        }

        try {

            ctx.body =  await oracle.keys.list(
                eq(schema.STORE.id, store_id),
                1,
                2,
                undefined,
                schema.STORE.created_at
            )

            ctx.status = 200;

            return

        }
        catch (e)
        {
            ctx.status = 500;
            ctx.body = "AN UNKNOWN ERROR OCCURRED";
            return;
        }
})

router
    .use(SecureForApps)
    .get("access-token","/access-token", async (ctx)=>{

        const store = ctx.request.store || null ;
        const environment = ctx.request.environment || "testing";

        const jwt = createJWT({
            ...store,
            environment
        }, {
            expiresIn: "1h",
            algorithm: "RS256"
        })

        ctx.response.body = {
            access_token: jwt,
            expires_in: 3600
        }

        ctx.status = 200;

        return;
    })

app.use(router.routes())

app.listen(3000, ()=>{
    console.log("🚀🚀APP_RUNNING🚀🚀")
})
