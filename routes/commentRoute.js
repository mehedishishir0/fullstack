const commentRoute = require("express").Router();

const { addComment, likeUnlikeComment } = require("../controllers/commentControllers");
const { protected } = require("../middlewares/authMiddilewares");


commentRoute.post("/:postId", protected, addComment);
commentRoute.put("/like/:commentId", protected, likeUnlikeComment);

module.exports = commentRoute;