const express=require("express");


const {adminAuth,userAuth}=require("./mioddlewares/auth")

const app=express();



app.use("/admin",adminAuth)
// Here implement middleware

app.get("/user",userAuth,(req,res)=>{
   console.log("User Api Hit")
   res.send({
      userName:"Prateek",
      lastName:"Srivastava"
   })

})

app.post("/admin/getAllData",(req,res)=>
   {
        res.send("All Data Send")
})

//Error Handling.....

app.get("/login",(req,res)=>{
   try{
      throw new Error("fhsjfh")
      res.send("User Data Send ")
   }catch(err){
      res.status(501).send("Internal Error From Server")
   }

})

// Wild Card Eror Handing

app.get("/profile",(req,res)=>{
      throw new Error("jfhsdjh");
      res.send("Profile Data Fetch Succefuly");
})

app.use("/",(err,req,res,next)=>{
   if(err){
      res.status(404).send("Somthing went wrong from server side....")
   }

})
app.listen(7777,()=>{
    console.log("Server start listening on port 7777...")
});