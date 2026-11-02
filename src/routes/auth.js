const express = require("express");

const authRouter = express.Router();

const userModel = require("../models/user");
const { validationSignUpData } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../mioddlewares/auth");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
authRouter.use(cookieParser());
authRouter.use(express.json());

authRouter.post("/signup", async (req, res) => {
  try {
    //Validtion of data
    validationSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the Password
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating new instance of the User model.
    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const saveduser = await user.save();
    const token = await saveduser.getJWT();
    // Add the token to cookie and send the response back to the user

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "User Added suceessfully!", data: saveduser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Login Api

authRouter.post("/login", async (req, res) => {
  try {
    //geting emailId from db
    const { emailId, password } = req.body;

    const user = await userModel.findOne({ emailId });

    if (!user) {
      return res.status(404).send("User  not found");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const userObj = user.toObject();

      delete userObj.password;
      // Create a JWT Token
      const token = await user.getJWT();
      // Add the token to cookie and send the response back to the user

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        message: "Successfully Login",
        user: userObj,
      });
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

authRouter.post("/logout", userAuth, (req, res) => {
  try {
    const { token } = req.cookies;
    res.clearCookie("token");
    res.status(200).send("User sucessfuly logout.");
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

module.exports = authRouter;
