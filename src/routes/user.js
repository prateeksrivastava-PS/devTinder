const express=require("express");
const userRouter= express.Router();
const {userAuth} = require("../mioddlewares/auth");
const connectionRequest=require("../models/connectionRequest")
const user = require("../models/user");
const user_safe_data="firstName lastName photoUrl age gender "


// Get all the pending  connection request for the logged in usser 
userRouter.get("/user/requests/received", userAuth, async (req,res)=>{
  try{
     
    const loggedInUser= req.userData;

    const connectionRequests= await connectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested'
    }).populate("fromUserId",
      user_safe_data
    );
      
    // }).populate("fromUserId",["firstName","lastName"]);

  res.status(200).json({
    message:"Data fetch sucessfully",
    data:connectionRequests
  })
 
  }catch(err){
    res.status(400).send(err.message);
  }
})

 
userRouter.get("/user/connections",userAuth , async ( req,res)=>{
try{
  const loggedInUser= req.userData;

  const connection= await connectionRequest.find({
    $or:[
      {toUserId:loggedInUser._id,status:"accepted"},
      {fromUserId:loggedInUser._id,status:"accepted"}
    ]
  }).populate("fromUserId",user_safe_data).populate("toUserId",user_safe_data)

  // we just want to data fromUserID (Means filtering the geting data)

  const  filterData= connection.map((row)=>{
    if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
      return row.toUserId;
    }
    return row.fromUserId;



  })
  res.status(200).json({
    message:"Data fetch sucessfuly",
    data: filterData
  }) 

}catch(err){
  res.status(400).send(err.message);

}


})








module.exports=userRouter;
