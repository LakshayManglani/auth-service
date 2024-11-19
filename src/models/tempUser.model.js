import { Schema, model } from "mongoose";
import {
  AvailableVerificationTokens,
  VerificationTokenEnum,
} from "../constants.js";

// TODO: Make sure that password is encrypted
const tempUserSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  tokenType: {
    type: String,
    required: true,
    enum: AvailableVerificationTokens,
    default: VerificationTokenEnum.REGISTER,
  },
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  givenName: {
    type: String,
  },
  familyName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});

const TempUser = model("Temp_User", tempUserSchema);

export { TempUser };
