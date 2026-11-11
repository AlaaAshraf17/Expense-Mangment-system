const express=require('express');
require('dotenv').config()
const connectDB=require('./config/db')
const transactionRoutes = require("./routes/transactionRoutes");
const app=express()
app.use(express.json())
app.use("/api/transactions",transactionRoutes)
const port=5000

app.get("/", (req, res) => {
    res.send("Welcome to Spendly Backend!");
});

const startServer=async()=>{
    await connectDB()
    app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
}
startServer()