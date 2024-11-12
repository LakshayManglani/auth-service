import { Schema, model } from "mongoose";
import {
  AvailableUserRoles,
  UserRoleEnum,
  AvailableUserLogins,
  AccountStatusEnum,
  AvailableAccountStatus,
} from "../constants.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "../config/env.config.js";

const authUserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRoleEnum.USER,
      required: true,
    },
    accountStatus: {
      type: String,
      enum: AvailableAccountStatus,
      default: AccountStatusEnum.ACTIVE,
      required: true,
    },
    loginType: {
      type: [String],
      enum: AvailableUserLogins,
      required: true,
    },
    googleId: {
      type: String,
    },
    refreshToken: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

authUserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcryptjs.hash(this.password, 10);

    next();
  } catch (error) {
    console.error("Error occurred during userSchema pre save:");
    next(error);
  }
});

authUserSchema.methods.isPasswordCorrect = function (password) {
  return bcryptjs.compareSync(password, this.password);
};

authUserSchema.methods.generateAccessToken = function () {
  const payload = { _id: this._id };

  return jwt.sign(payload, String(env.ACCESS_TOKEN_SECRET), {
    expiresIn: env.ACCESS_TOKEN_EXPIRES,
  });
};

authUserSchema.methods.generateRefreshToken = function () {
  const payload = { _id: this._id };

  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES,
  });
};

const AuthUser = model("AuthUser", authUserSchema);

export { AuthUser };
