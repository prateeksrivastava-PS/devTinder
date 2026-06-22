const express = require("express");

const app = express();

const connectDB = require("./config/database");

const userModel = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new userModel({
    firstName: "Prateek",
    lastName: "Srivastava",
    emailId: "prateek.srivastava6397@gmail.com",
    password: "Kobe@200",
  });
  try {
    await user.save();
    res.send("Sucessfuly signup acount !!");
  } catch (err) {
    res.status(400).send("Error TO Saving  Data !!!" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DataBase conection stablized...");
    app.listen(7777, () => {
      console.log("Server start listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database Error:", err);
  });
