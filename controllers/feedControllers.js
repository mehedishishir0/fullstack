const FeedPost = require("../model/feedPostModel");
const cloudinary = require("../config/cloudinaryConfig");

exports.createPost = async (req, res) => {
  try {
    const { text, isPublic } = req.body;
    const file = req.file;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const response = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "fullstack/feedPosts",
    });

    if (!response.secure_url) {
      throw createError(
        404,
        "image not uploaded on cloudinary. Please try again",
      );
    }

    const post = await FeedPost.create({
      user: req.user.userId,
      text,
      image: {
        url: response.secure_url,
        public_id: response.public_id,
      },
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
