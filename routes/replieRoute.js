const { addReply, likeUnlikeReply } = require("../controllers/replieControllers");
const { protected } = require("../middlewares/authMiddilewares");

const replyRoute = require("express").Router();

replyRoute.post("/:commentId", protected, addReply);
replyRoute.put("/like/:replyId", protected, likeUnlikeReply);

module.exports = replyRoute;