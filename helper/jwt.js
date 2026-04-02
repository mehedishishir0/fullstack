// const jwt = require("jsonwebtoken");

// exports.createToken = (payload, secretKey, expire) => {
//   if (typeof payload != "object" || !payload) {
//     throw new Error("Payload must be a non-empty object");
//   }
//   if (typeof secretKey != "string" || secretKey === "") {
//     throw new Error("secretKet must be a non-empty string");
//   }
//   try {
//     if (expire) {
//       const token = jwt.sign(payload, secretKey, { expiresIn: expire });
//       return token;
//     } else {
//       const token = jwt.sign(payload, secretKey);
//       return token;
//     }
//   } catch (error) {
//     console.error("Failed to sign the JWT: ", error);
//     throw error;
//   }
// };




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