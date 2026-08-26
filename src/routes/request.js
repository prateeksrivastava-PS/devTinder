const express = require("express");
const { userAuth } = require("../mioddlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = req.userData._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;


      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid request status!");
      }

      //if there is an exisiting Connection Request

      const exisitingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      const isValidConnectionId= await User.findById(toUserId);
      if(!isValidConnectionId){
        res.status(404).send("Requested User Not Found!")

      }
      console.log("isValidConnectionId",isValidConnectionId)

      if (exisitingConnectionRequest ) {
          return res.status(409).json({
            message:"Connection request already exist",
            data: exisitingConnectionRequest
          });
      }
      

      const request = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await request.save();
      res.status(200).json({
        message: "Connection Request Sent Successfully!",
        data,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

requestRouter.post("/request/review/:status/:requestId",userAuth, async (req,res)=>{

  try{

    const loggedInUser= req.userData;
    const {status,requestId}=req.params;
    //Validate Status
    //logedInId=toUserId
    //status= intrested
    // request id Should be valid

    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Status not allowed!"});
    }

    const ConnectionRequest= await connectionRequest.findOne({ _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested"
    });



    if(!ConnectionRequest){
     return  res.status(404).json({message:"Connection request not found!"});
    }

    ConnectionRequest.status=status;
   const data= await  ConnectionRequest.save();

   res.status(200).json({message:"Connection request"+ status,data})
    


  }catch(err){
     res.status(400).send(err.message)
  }
})

module.exports = requestRouter;
