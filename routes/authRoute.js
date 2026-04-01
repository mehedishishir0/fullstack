const {
  registereUser,
  loginUser,
} = require("../controllers/authControllers");

const authRoute = require("express").Router();

authRoute.post("/register", registereUser);
authRoute.post("/login", loginUser);

module.exports = authRoute;