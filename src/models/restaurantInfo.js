const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    restaurantId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    rating: {
        type: Number
    },

    deliveryTime: {
        type: String
    }
});

const restaurantInfoModel = mongoose.model(
    "restaurantInfo",
    restaurantSchema
);

module.exports = restaurantInfoModel;