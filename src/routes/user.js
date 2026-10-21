const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../mioddlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const user = require("../models/user");
const user_safe_data = "firstName lastName photoUrl age gender ";

// Get all the pending  connection request for the logged in usser
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;

    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", user_safe_data);

    // }).populate("fromUserId",["firstName","lastName"]);

    res.status(200).json({
      message: "Data fetch sucessfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;

    const connection = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", user_safe_data)
      .populate("toUserId", user_safe_data);

    // we just want to data fromUserID (Means filtering the geting data)

    const filterData = connection.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({
      message: "Data fetch sucessfuly",
      data: filterData,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  // User should see all the user cards excepts
  // his own card
  // his connections
  // ignored pepople
  // alreday sent the connection request

  try {
    const loggedInUser = req.userData;

    // Implementing Pagination Api logic

    const page= parseInt(req.query.page) || 1;
    let limit= parseInt(req.query.limit) || 10;
    // adding  corner case for pagination 
    limit=limit>50?50 :limit;

    const skip= (page-1)*limit

    console.log("Logged in user:", loggedInUser);
    console.log("User ID:", loggedInUser?._id);

    //Find all conection request (sent + received)

    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId")
      .populate("fromUserId", "firstName")
      .populate("toUserId", "firstName");

    // Here hide the request

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((request) => {
      if (request.fromUserId?._id) {
        hideUsersFromFeed.add(request.fromUserId._id.toString());
      }

      if (request.toUserId?._id) {
        hideUsersFromFeed.add(request.toUserId._id.toString());
      }
    });
    console.log(hideUsersFromFeed);

    // find user which has not send or recivie request from logged in user(not include the hide fromuser feed)

    const users = await user.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(user_safe_data).skip(skip).limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
