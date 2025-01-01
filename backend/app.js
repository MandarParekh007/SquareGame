import express from "express"
import dotenv from "dotenv"
import cors from "cors"


const app = express();



//middlewares

app.use(express.json())
app.use(express.urlencoded({extended : true}))
dotenv.config({
    path: "./.env"
})
app.use(cors({
    origin: "*"
}))




export default app