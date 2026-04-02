const { createPost } = require("../controllers/feedControllers");
const upload = require("../uploder/imageUploder");
const { protected } = require("../middlewares/authMiddilewares");

const feedRoute = require("express").Router();

feedRoute.post("/post", protected, upload.single("image"),createPost);


module.exports = feedRoute;