
const express=require('express')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const app=express()
const port=process.env.Port||3000
require('./db/mongoose')
// app.get('/',(req,res)=>{
//     res.send("mariam")
// })
app.use(express.json())
const userrouter=require("./routers/user")
const user=require("./routers/task")
app.use(userrouter)
app.use(user)
app.listen(port,()=>{console.log("ok")})