const {
  registereUser,
  loginUser,
  refreshToken,
  logoutUser,
} = require("../controllers/authControllers");

const authRoute = require("express").Router();

authRoute.post("/register", registereUser);
authRoute.post("/login", loginUser);
authRoute.post("/refresh-token", refreshToken);
authRoute.post("/logout", logoutUser);

module.exports = authRoute;