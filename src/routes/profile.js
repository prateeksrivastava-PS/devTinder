 const express=require("express");
 const profileRouter=express.Router();
 const {userAuth}= require("../mioddlewares/auth")
 profileRouter.use(express.json());
 


 
 profileRouter.get("/profile",userAuth,async (req,res)=>{
 try{
  const user= req.userData
  res.send(user)
 }catch(err){
    
  res.status(404).send(err.message);
 } 
 });

 module.exports= profileRouter;


