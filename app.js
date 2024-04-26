import express from "express"
import cookieParser from 'cookie-parser'
import {config} from "dotenv"
import cors from 'cors'
import userRoutes from "./routes/user.route.js"


config()

const app=express()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}));

app.use('/api/v1/user',userRoutes)

app.use('/',(req,res)=>{
    res.status(200).json({
       message:"suceess",
       "data":"Ayush Mishra jii"
    })
 })

export default app