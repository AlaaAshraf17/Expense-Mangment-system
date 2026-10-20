const express=require('express');
require('dotenv').config()
const connectDB=require('./config/db')
const app=express()
app.use(express.json())
const port=5000

app.get('/',(req,res)=>{
    res.send("welcome to the server")
})

app.get("/api/transactions",(req,res)=>{
    res.json({
        message:"transactions fetched successfully",
        transactions:[]
    })
})

app.post("/api/transactions",(req,res)=>{
    const transaction=req.body
    if(!Number.isFinite(transaction.amount)||transaction.amount<=0){
        return res.status(400).json({
            message:"amount is required and should be a positive number"
        })
    }
    if (!transaction.title) {
        return res.status(400).json({
            message:"title is required"
        })
    }
    res.status(201).json({
        message:"Transaction received successfully",
        data:transaction
    })
})

const startServer=async()=>{
    await connectDB()
    app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
}
startServer()