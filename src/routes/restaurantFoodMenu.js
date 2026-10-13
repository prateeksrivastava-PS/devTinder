const express = require("express");

const restaurantFoodMenuRouter = express.Router();

const restaurantInfoModel = require("../models/restaurantInfo");

const restaurantMenuModel = require("../models/restaurantMenu");

restaurantFoodMenuRouter.post("/add/restaurants", async (req, res) => {
  try {
    const { restaurantId, name, image, rating, deliveryTime } = req.body;
    const restaurantInfo = new restaurantInfoModel({
      restaurantId,
      name,
      image,
      rating,
      deliveryTime,
    });
    await restaurantInfo.save();
    res.status(200).json("Data Saved Sucessfuly");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

restaurantFoodMenuRouter.post(
    "/add/restaurants/:restaurantId/menu",
    async (req, res) => {

        try {

            const { restaurantId } = req.params;

            const menuItems = req.body.map((item) => ({
                ...item,
                restaurantId
            }));

            const savedMenuItems =
                await restaurantMenuModel.insertMany(menuItems);

            res.status(200).json({
                message: "Data saved successfully",
                data: savedMenuItems
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: "Something went wrong",
                error: err.message
            });

        }

    }
);

restaurantFoodMenuRouter.get(
    "/restaurants/:restaurantId/menu",
    async (req, res) => {

        try {

            const { restaurantId } = req.params;

            // 1. Find restaurant
            const restaurant = await restaurantInfoModel.findOne({
                restaurantId: restaurantId
            });

            // 2. Check restaurant
            if (!restaurant) {
                return res.status(404).json({
                    message: "Restaurant Not Found!!"
                });
            }

            // 3. Get all menu items
            const menuItems = await restaurantMenuModel.find({
                restaurantId: restaurantId
            });

            // 4. Create category object
            const categoryMap = {};

            // 5. Group items by category
            menuItems.forEach((item) => {

                if (!categoryMap[item.category]) {

                    categoryMap[item.category] = [];

                }

                categoryMap[item.category].push(item);

            });

            // 6. Convert category object into array
            const menu = Object.keys(categoryMap).map((category) => {

                return {
                    category: category,
                    items: categoryMap[category]
                };

            });

            // 7. Send response
            res.status(200).json({

                message: "Data get successfully",

                Data: {

                    restaurant: restaurant,

                    menu: menu

                }

            });

        } catch (err) {

            console.log(err);

            res.status(500).json({

                message: "Something went wrong!!",

                error: err.message

            });

        }

    }
);

module.exports = restaurantFoodMenuRouter;
