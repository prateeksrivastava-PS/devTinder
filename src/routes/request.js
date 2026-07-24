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


      const allowedStatus = ["ignored", "intrested"];
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

module.exports = requestRouter;
