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
  try {
    const loggedInUser = req.userData;

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    let limit = parseInt(req.query.limit) || 10;

    limit = Math.min(limit, 50);

    const skip = (page - 1) * limit;

    // Find all sent and received connection requests
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id },
          { toUserId: loggedInUser._id },
        ],
      })
      .select("fromUserId toUserId")
      .populate("fromUserId", "firstName")
      .populate("toUserId", "firstName");

    // Hide users who have a connection request
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((request) => {
      if (request.fromUserId?._id) {
        hideUsersFromFeed.add(request.fromUserId._id.toString());
      }

      if (request.toUserId?._id) {
        hideUsersFromFeed.add(request.toUserId._id.toString());
      }
    });

    // Common filter for find and countDocuments
    const filter = {
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    };

    // Fetch paginated users
    const users = await user
      .find(filter)
      .select(user_safe_data)
      .skip(skip)
      .limit(limit);

    // Count total available users
    const totalRecords = await user.countDocuments(filter);

    res.json({
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (err) {
    console.log("Feed API Error:", err);
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
