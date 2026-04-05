const jwt = require("jsonwebtoken");


exports.createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};


exports.createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};


exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};