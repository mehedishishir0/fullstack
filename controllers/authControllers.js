const createError = require("http-errors");
const bcryptjs = require("bcryptjs");
const AuthModel = require("../model/userModel");
const { successResponse } = require("../response/response");
const { createToken } = require("../helper/jwt");

exports.registereUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      throw createError(404, "all fields are required");
    }
    const existingUser = await AuthModel.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      throw createError(409, "email alrady exist");
    }
    const hash = await bcryptjs.hash(password, 10);
    const response = await AuthModel.create({
      firstName,
      lastName,
      email,
      password: hash,
    });
    successResponse(res, {
      statusCode: 201,
      message: "user registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError(404, "all faild are required");
    }

    const findUser = await AuthModel.findOne({ email });

    if (!findUser) {
      throw createError(404, "somthing want wrong");
    }

    const isMatch = await bcryptjs.compare(password, findUser.password);
    if (!isMatch) {
      throw createError(401, "Email or Password are incorrect ");
    }
    const token = createToken(
      { userId: findUser._id, role: findUser.role },
      process.env.JWT_SECRET,
      "30days"
    );
    const userData = findUser.toObject();
    delete userData.password;

    successResponse(res, {
      statusCode: 200,
      message: "Login successfully",
      data: { data: userData, accessToken: token },
    });
  } catch (error) {
    next(error);
  }
};

