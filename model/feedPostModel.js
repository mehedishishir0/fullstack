const mongoose = require("mongoose");
const { url } = require("../config/cloudinaryConfig");

const feedPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
     url:{ type: String },
      public_id: { type: String },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublic: { type: Boolean, default: true }, 
  },
  { timestamps: true },
);

module.exports = mongoose.model("FeedPost", feedPostSchema);
