const {
  registereUser,
  loginUser,
  refreshToken,
  logoutUser,
  googleAuth,
} = require("../controllers/authControllers");
const { protected } = require("../middlewares/authMiddilewares");

const authRoute = require("express").Router();

authRoute.post("/register", registereUser);
authRoute.post("/login", loginUser);
authRoute.post("/google", googleAuth);
authRoute.post("/refresh-token", refreshToken);
authRoute.post("/logout",protected, logoutUser);

module.exports = authRoute;