const mongoose = require("mongoose");

const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      index:true,
      require: true,
      minLength: 2,
      maxLength: 40,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowerCase: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid..");
        }
      },
    },
    password: {
      type: String,
      require: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender Not Valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/isolated-object-avatar-dummy-symbol-260nw-1290296656.jpg",

      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Inavliad Image url..");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about  of the user!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

//Compound Index

userSchema.index({
  firstName:1,
  lastName:1
});

// Method for genrating JWT

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "KOBE@DEV$2021", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword= async function(inputPassword){

 const isPasswordValid = await bcrypt.compare(inputPassword, this.password);

 return isPasswordValid;

}

module.exports = mongoose.model("User", userSchema);
