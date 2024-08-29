import { Schema, model } from "mongoose";

const tempGoogleUserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  avatarURL: {
    type: String,
  },
  sessionId: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const TempGoogleUser = model("Temp_Google_User", tempGoogleUserSchema);

export { TempGoogleUser };
