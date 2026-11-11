const mongoose=require('mongoose')
const transcationSchema=new mongoose.Schema({
   title:{
    type:String,
    required:[true,"Transaction title is required"],
    trim:true,
    minlength:[2,"Title must be at least 2 characters"]
   },
   amount:{
    type:Number,
    required:[true,"Transaction amount is required"],
    min:[0.01,"Amount must be greater than zero"]
   },
   type:{
    type:String,
    required:[true,"Transaction type is required"],
    enum:{
      values:["income", "expense"],
      message:"Type must be income or expense"
    }
   }
},{
   timestamps:true
})
const Transaction=mongoose.model("Transaction",transcationSchema)
module.exports=Transaction