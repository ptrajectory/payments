import { Router } from "express";
import mpesaExpressClient from "../resources/payment/mpesa";


const hookRouter = Router()


hookRouter.post("/c2b/callback", mpesaExpressClient.paymentsCallbackHandler)

export default hookRouter