const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "intrested", "accepeted", "rejected"],
        message: "{VALUE} is incorrect  status type",
      },
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

// Making compound index

connectionRequestSchema.index({ toUserId: 1 ,fromUserId:1});

connectionRequestSchema.pre("save", function (next) {
  if (this.toUserId.equals(this.fromUserId)) {
    throw new Error("Cant't send request yourself!");
  }
  next();
});

const connectionReuestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = connectionReuestModel;
