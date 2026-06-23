const express=require("express");
const app=express();

const mongoose= require("mongoose");

const connectDB=require("./config/database");

const userModel= require("./models/user")

app.use(express.json())
app.post("/signup", async (req,res)=>{

  console.log(req.body)

  const user= new userModel(req.body)

  try{

   await user.save()
    
   res.send("Data Sucesfully save...")
   
  }catch(err){
    res.status(400).send("Data not saved")

  }

})

connectDB()
.then(()=>{
  console.log("Server coneccted suceesfuly..");
  app.listen (7777,()=>{
    console.log("Server start listining on port 7777....")
  })  

}).catch(
  (err)=>{
        console.error("Database Err",err)
  }
)