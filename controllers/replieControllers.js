const Reply = require("../model/replyModel");
const Comment = require("../model/commentModel");
const { successResponse } = require("../response/response");

exports.addReply = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = await Reply.create({
      comment: comment._id,
      user: req.user.userId,
      text,
    });

    successResponse(res, {
      statusCode: 201,
      message: "Reply added successfully",
      data: reply,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeUnlikeReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const userId = req.user.userId.toString();
    if (reply.likes.includes(userId)) {
      reply.likes = reply.likes.filter(id => id.toString() !== userId);
    } else {
      reply.likes.push(userId);
    }

    await reply.save();
    successResponse(res, {
      statusCode: 200,
      message: "Reply liked/unliked successfully",
      data: reply,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};