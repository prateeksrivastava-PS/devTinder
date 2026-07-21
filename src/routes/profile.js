const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../mioddlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const userModel = require("../models/user");
profileRouter.use(express.json());
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.userData;
    res.send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.userData;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res
      .status(200)
      .json({ message: `Data Saved Sucessfuly`, data: loggedInUser });
    res.status(200).send("Data Sucessfuly updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/change-password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const logedInUserData = req.userData;
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      logedInUserData.password,
    );
    if (!isValidPassword) {
      throw new Error("Current Password is not valid!");
    }
    const isStrongPassword = validator.isStrongPassword(newPassword);
    if (!isStrongPassword) {
      throw new Error("Please enter valid new-password!");
    }

    const hasNewPassword = await bcrypt.hash(newPassword, 10);
    logedInUserData.password = hasNewPassword;
    await logedInUserData.save();
    res
      .status(200)
      .send(`Password change sucessfuly!`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
