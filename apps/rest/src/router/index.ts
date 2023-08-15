import { Router } from "express";
import checkoutRouter from "./checkout";
import customerRouter from "./customer";
import paymentMethodRouter from "./payment_method";
import productRouter from "./product"
import cartRouter from "./cart";


const router = Router() 

router.use(checkoutRouter)
router.use(customerRouter)
router.use(paymentMethodRouter)
router.use(productRouter)
router.use(cartRouter)


router.get('/', (req, res)=>{
    res.send("Hi there awesome.")
})

export default router