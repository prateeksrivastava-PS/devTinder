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

//  Get The User by emailid

app.get("/user",async (req,res)=>{
   
 const userEmail=req.body.emailId
 
  try{
    const users=await  userModel.find({emailId:userEmail})
    if(users.length===0){
      res.status(404).send("User not found");
    }else{
      res.send(users);
    }  
  }catch(err){
    res.status(400).send("Something went wrong...")
  
  }
})

// Getting  the  all Data

app.get("/feed",async (req,res)=>{

  try{
    const allUserData=await  userModel.find({})
    await res.status(200).send(allUserData)

  }catch(err){
     res.status(400).send("Something went wrong...")
  }

})

//  finding old one  data from common data

app.get("/userfindOne",async (req,res)=>{

  const userId= req.body.emailId
  try{
    const getUserData= await userModel.findOne({emailId:userId})
    console.log("Findta", getUserData)
   if(getUserData.length===0){
       res.status(404).send("User Data Not found....")
   }else{
           res.status(200).send(getUserData)
   }    
  }catch(err){
       res.status(400).send("Something Went wrong...")
  }

})

// Delete

app.delete("/user",async (req,res)=>{

  const userId=req.body.userId;
try{
  const user= await userModel.findByIdAndDelete({_id:userId})
  console.log("Deleted data",userId)
  res.status(200).send("Data Deleted sucessfuly..")
}catch(err){
res.status(400).send("Something went wrong..")
}
})

// Update 

app.patch("/user",async (req,res)=>{
  const userId=req.body.firstName
  try{
   
    // await userModel.findByIdAndUpdate(userId,req.body)
  await  userModel.findOneAndUpdate({firstName:userId},req.body,{new:true})
   
    res.status(200).send("Data Updated suceefuly..")

  }catch(err){
    res.status(404).send("Something went wrong...")
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