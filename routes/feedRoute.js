const { createPost, getFeed, likeUnlikePost } = require("../controllers/feedControllers");
const upload = require("../uploder/imageUploder");
const { protected } = require("../middlewares/authMiddilewares");

const feedRoute = require("express").Router();

feedRoute.post("/post", protected, upload.single("image"),createPost);
feedRoute.get("/", protected, getFeed);
feedRoute.put("/like/:postId", protected, likeUnlikePost);

module.exports = feedRoute;