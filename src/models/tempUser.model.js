import { Schema, model } from "mongoose";

const tempUserSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
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
