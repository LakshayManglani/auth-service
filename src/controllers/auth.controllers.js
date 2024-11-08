import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import kafkaProducer from "../utils/kafkaProducer.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { TempUser } from "../models/tempUser.model.js";
import { UserLoginEnum } from "../constants.js";
import validator from "validator";
import passport from "passport";
import { TempGoogleUser } from "../models/tempGoogleUser.model.js";

const checkAvailability = asyncHandler(async (req, res) => {
  const { email, username } = req.query;

  const result = {};

  if (email) {
    if (!validator.isEmail(email)) {
      result.email = false;
    } else {
      const existedUser = await User.findOne({ email });
      result.email = existedUser === null;
    }
  }

  if (username) {
    if (!validator.isAlphanumeric(username)) {
      result.username = false;
    } else {
      const existedUser = await User.findOne({ username });
      result.username = existedUser === null;
    }
  }

  return res
    .status(200)
    .json(apiResponse(200, result, "Check availability successfully."));
});

const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { givenName, familyName, email, username, password } = req.body;
  // ====> Send Email <====

  // write code to find user by email or username
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  const token = jwt.sign(
    { email, username },
    String(env.VERIFICATION_TOKEN_SECRET),
    {
      expiresIn: env.VERIFICATION_TOKEN_EXPIRES,
    }
  );

  const tempUser = await TempUser.create({
    email,
    token,
    givenName,
    familyName,
    username,
    password,
  });

  await kafkaProducer.getInstance().send({
    topic: "email",
    messages: [
      {
        partition: 0,
        value: JSON.stringify({
          id: tempUser._id,
          type: "auth/verification",
          data: {
            username,
            verificationLink: `${env.VERIFICATION_LINK}/${token}`,
            to: email,
          },
        }),
      },
    ],
  });

  return res
    .status(201)
    .json(apiResponse(201, null, "Verification email sent."));
});

const verifyAndCreate = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const { email, username } = jwt.verify(
    token,
    String(env.VERIFICATION_TOKEN_SECRET)
  );

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  const tempUser = await TempUser.findOne({ email, username, token });

  if (!tempUser) {
    throw new ApiError(404, "Token not found.");
  }

  const user = new User({
    email,
    username,
    givenName: tempUser.givenName,
    familyName: tempUser.familyName,
    password: tempUser.password,
    loginType: UserLoginEnum.EMAIL_PASSWORD,
  });

  await user.save();
  await tempUser.deleteOne();

  return res
    .status(201)
    .json(apiResponse(201, null, "User created successfully."));
});

const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;
  const isEmail = validator.isEmail(emailOrUsername);

  const query = isEmail
    ? { email: emailOrUsername }
    : { username: emailOrUsername };
  const user = await User.findOne(query);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.isPasswordCorrect(password)) {
    throw new ApiError(400, "Password is incorrect.");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken.push(refreshToken);

  await user.save();

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: env.REFRESH_TOKEN_EXPIRES * 1000,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    })
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: env.ACCESS_TOKEN_EXPIRES * 1000,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    })
    .json(
      apiResponse(
        201,
        {
          userId: user._id,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(400, "Refresh token not found.");
  }

  const { _id } = jwt.verify(refreshToken, String(env.REFRESH_TOKEN_SECRET));

  const user = await User.findById(_id);
  if (user) {
    user.refreshToken = user.refreshToken.filter(
      (token) => token !== refreshToken
    );
    await user.save();
  }

  return res
    .status(201)
    .clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    })
    .clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    })
    .json(apiResponse(201, null, "User logged out successfully."));
});

const generateTokens = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(400, "Refresh token not found.");
  }

  const { _id } = jwt.verify(refreshToken, String(env.REFRESH_TOKEN_SECRET));

  const user = await User.findById(_id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.refreshToken.includes(refreshToken)) {
    throw new ApiError(403, "Invalid refresh token.");
  }

  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = user.refreshToken.filter(
    (token) => token !== refreshToken
  );
  user.refreshToken.push(newRefreshToken);

  await user.save();

  return res
    .status(201)
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: env.REFRESH_TOKEN_EXPIRES * 1000,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    })
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: env.ACCESS_TOKEN_EXPIRES * 1000,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    })
    .json(
      apiResponse(
        201,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Tokens refreshed successfully."
      )
    );
});

const generateAccessToken = asyncHandler(async (req, res) => {
  const payload = { _id: req.user._id };
  const accessToken = jwt.sign(payload, String(env.ACCESS_TOKEN_SECRET), {
    expiresIn: env.ACCESS_TOKEN_EXPIRES,
  });
  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: env.ACCESS_TOKEN_EXPIRES * 1000,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
    })
    .json(apiResponse(201, null, "Access token refreshed successfully."));
});

const google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

const googleRedirect = asyncHandler(async (req, res) => {
  const existedUser = await User.findOne({ email: req.user.emails[0].value });

  if (!existedUser) {
    const tempGoogleUser = new TempGoogleUser({
      email: req.user.emails[0].value,
      givenName: req.user.name.givenName,
      familyName: req.user.name.familyName,
      avatarURL: req.user.photos[0]?.value || "",
      sessionId: req.sessionID,
      googleId: req.user.id,
    });

    await tempGoogleUser.save();

    return res.redirect("/complete-profile");
  }

  if (!existedUser.loginType.includes(UserLoginEnum.GOOGLE)) {
    existedUser.googleId = req.user.id;
    existedUser.loginType.push(UserLoginEnum.GOOGLE);
    await existedUser.save();
  }

  return res.redirect("/");
});

export {
  checkAvailability,
  sendVerificationEmail,
  verifyAndCreate,
  login,
  logout,
  generateTokens,
  generateAccessToken,
  google,
  googleCallback,
  googleRedirect,
};
