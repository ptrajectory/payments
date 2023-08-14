import { Router } from "express";
import checkoutRouter from "./checkout";
import customerRouter from "./customer";
import paymentMethodRouter from "./payment_method";


const router = Router() 

router.use(checkoutRouter)
router.use(customerRouter)
router.use(paymentMethodRouter)


router.get('/', (req, res)=>{
    res.send("Hi there awesome.")
})

export default router