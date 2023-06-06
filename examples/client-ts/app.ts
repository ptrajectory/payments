import "dotenv/config"
import express from 'express' 
import { events } from "./client.ts"


const app = express()


const router = express.Router()

router.post('/c2b/callback', (req, res)=>{
    console.log("Coming in from the endpoint::",req.body)
    events.emit('callback', req.body)
    res.send("OK")
})

router.post('/b2c/timeout', (req, res)=>{
    console.log("Coming in from the endpoint::",req.body)
    events.emit('callback', req.body)
    res.send("OK")
})

router.post('/b2c/result', (req, res)=>{
    console.log("Coming in from the endpoint::",req.body)
    events.emit('callback', req.body)
    res.send("OK")
})

app.use(express.json())

app.use(router)

export default app