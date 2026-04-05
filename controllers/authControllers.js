const createError = require("http-errors");
const bcryptjs = require("bcryptjs");
const AuthModel = require("../model/userModel");
const { successResponse } = require("../response/response");

const {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} = require("../helper/jwt");

// ================= REGISTER =================
exports.registereUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw createError(400, "All fields are required");
    }

    const existingUser = await AuthModel.findOne({ email });

    if (existingUser) {
      throw createError(409, "Email already exists");
    }

    const hash = await bcryptjs.hash(password, 10);

    await AuthModel.create({
      firstName,
      lastName,
      email,
      password: hash,
    });

    successResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, "Email and password required");
    }

    const user = await AuthModel.findOne({ email });

    if (!user) throw createError(404, "User not found");
    if (user.provider !== "credentials")
      throw createError(400, "Use Google login");

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) throw createError(401, "Invalid credentials");

    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });

    const newRefreshToken = createRefreshToken({
      userId: user._id,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      data: {
        user: userData,
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.googleAuth = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body;
    console.log(email, firstName, lastName);
    let user = await AuthModel.findOne({ email });

    if (user.provider !== "google")
      throw createError(400, "Use credentials login");
    
    if (!user) {
      user = await AuthModel.create({
        email,
        firstName,
        lastName,
        password: "",
        provider: "google",
      });
    }

    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      userId: user._id,
    });

    user.refreshToken = refreshToken;
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ================= REFRESH TOKEN =================
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError(401, "Refresh token required");
    }

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await AuthModel.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw createError(403, "Invalid refresh token");
    }

    const newAccessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

// ================= LOGOUT =================
exports.logoutUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    await AuthModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
