import * as Koa from 'koa';
import {STORE} from "../zodiac";


declare  module 'koa'{
    interface Request {
        store: STORE | null
        environment: "production" | "testing"
    }
}