const express = require("express");
const app = express();
const connectDB = require("./config/database");

const cors = require("cors");

const authRouter= require("./routes/auth");
const profileRoute=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");
const restaurantFoodMenuRouter= require("./routes/restaurantFoodMenu")


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/",authRouter);
app.use("/",profileRoute);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",restaurantFoodMenuRouter)




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
