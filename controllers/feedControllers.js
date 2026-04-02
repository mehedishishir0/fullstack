const FeedPost = require("../model/feedPostModel");
const cloudinary = require("../config/cloudinaryConfig");
const Comment = require("../model/commentModel");
const Reply = require("../model/replyModel");
const { successResponse } = require("../response/response");

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

exports.getFeed = async (req, res) => {
  try {

    const posts = await FeedPost.find({
      $or: [
        { isPublic: true },
        { user: req.user.userId },
      ]
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName")
      .lean();

    // Attach comments and replies
    for (let post of posts) {
      post.comments = await Comment.find({ post: post._id })
        .populate("user", "firstName lastName")
        .sort({ createdAt: 1 })
        .lean();

      for (let comment of post.comments) {
        comment.replies = await Reply.find({ comment: comment._id })
          .populate("user", "firstName lastName")
          .sort({ createdAt: 1 })
          .lean();
      }
    }

    successResponse(res, {
      statusCode: 200,
      message: "Feed retrieved successfully",
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeUnlikePost = async (req, res) => {
  try {
    console.log(req.params.postId)
    const post = await FeedPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.userId.toString();

    if (post.likes.includes(userId)) {
                                                                         
      post.likes = post.likes.filter(id => id.toString() !== userId);
 
    } else {
      post.likes.push(userId);
    }

    await post.save();

      successResponse(res, {
        statusCode: 200,
        message: "Post like status updated",
        data: post,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

