const FeedPost = require("../model/feedPostModel");
const Comment = require("../model/commentModel");
const { successResponse } = require("../response/response");

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await FeedPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: post._id,
      user: req.user.userId,
      text,
    });

    successResponse(res, {
      statusCode: 201,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeUnlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.userId.toString();
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    
    successResponse(res, {
      statusCode: 200,
      message: "Comment like status updated",
      data: comment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
