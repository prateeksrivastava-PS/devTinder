const express = require("express");
const app = express();

const mongoose = require("mongoose");

const connectDB = require("./config/database");

const userModel = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log(req.body);

  const user = new userModel(req.body);

  try {
    await user.save();

    res.send("Data Sucesfully save...");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//  Get the db data

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await userModel.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong...");
  }
});

// Get  the  all data from user

app.get("/feed", async (req, res) => {
  try {
    const allUserData = await userModel.find({});
    await res.status(200).send(allUserData);
  } catch (err) {
    res.status(400).send("Something went wrong...");
  }
});

//  finding old one  data from common data

app.get("/userfindOne", async (req, res) => {
  const userId = req.body.emailId;
  try {
    const getUserData = await userModel.findOne({ emailId: userId });
    console.log("Findta", getUserData);
    if (getUserData.length === 0) {
      res.status(404).send("User Data Not found....");
    } else {
      res.status(200).send(getUserData);
    }
  } catch (err) {
    res.status(400).send("Something Went wrong...");
  }
});

// Delete  the user db

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await userModel.findByIdAndDelete({ _id: userId });
    console.log("Deleted data", userId);
    res.status(200).send("Data Deleted sucessfuly..");
  } catch (err) {
    res.status(400).send("Something went wrong..");
  }
});

// Update the user db

app.patch("/user{/:userId}", async (req, res) => {
  try {
    const emailId = req.body?.emailId;
    const userId = req.params?.userId;
    // Copy request body
    const data = { ...req.body };

    // Remove emailId so it isn't updated
    delete data.emailId;

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills","photoUrl","password"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    if (data?.skills?.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }

    // await userModel.findByIdAndUpdate(userId,req.body)
    await userModel.findOneAndUpdate({ emailId: emailId }, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).send("Data Updated suceefuly..");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Server coneccted suceesfuly..");
    app.listen(7777, () => {
      console.log("Server start listining on port 7777....");
    });
  })
  .catch((err) => {
    console.error("Database Err", err);
  });
