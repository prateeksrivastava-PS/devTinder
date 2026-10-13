const mongoose = require("mongoose");

const restaurantMenuSchema = new mongoose.Schema({

    itemId: {
        type: String,
        required: true,
        unique: true
    },

    restaurantId: {
        type: String,
        required: true
    },

    // NEW FIELD
    category: {
        type: String,
        required: true
    },

    foodName: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    rating: {
        type: Number
    },

    ratingCount: {
        type: Number
    },

    isVeg: {
        type: Boolean
    },

    foodImage: {
        type: String
    },

    isCustomisable: {
        type: Boolean
    },

    isBestSeller: {
        type: Boolean
    },

    foodDescription: {
        type: String
    },

    isFoodItemAvailable: {
        type: Boolean
    },

    foodAvailableSumary: {
        type: String
    }

});

const restaurantMenuModel = mongoose.model(
    "restaurantMenu",
    restaurantMenuSchema
);

module.exports = restaurantMenuModel;