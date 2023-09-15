import { Router } from "express";
import checkoutRouter from "./checkout";
import customerRouter from "./customer";
import paymentMethodRouter from "./payment_method";
import productRouter from "./product"
import cartRouter from "./cart";
import paymentRouter from "./payment";
import storeRouter from "./store";


const router = Router() 

router.use(checkoutRouter)
router.use(customerRouter)
router.use(paymentMethodRouter)
router.use(productRouter)
router.use(cartRouter)
router.use(paymentRouter)
router.use(storeRouter)


router.get('/', (req, res)=>{
    res.send("Hi there awesome.")
})

export default router