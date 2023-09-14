import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import router from './router'
import morgan from 'morgan'
import hookRouter from './router/hooks'

const app_env = process.env.APP_ENV || "development"

const app = express()
app.use(morgan(app_env === "development" ? "dev" : "tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use("/api",router)
app.use("/", hookRouter)
app.get("/ping", (req, res) => {
  res.status(200).send("PONG🏓");
});

const port = process.env.PORT || 8089

app.listen(port, ()=>{
    console.log(`✨ Server is listening on port ${port}`) 
})