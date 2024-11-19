import { Router } from "express";
import {
  checkAvailability,
  generateAccessToken,
  generateTokens,
  google,
  googleCallback,
  googleRedirect,
  login,
  logout,
  requestEmailUpdate,
  sendVerificationEmail,
  updateUsername,
  verifyAndCreate,
  verifyAndUpdateEmail,
} from "../controllers/auth.controllers.js";

/**
 *
 * @returns {Router}
 */
function createAuthV1Router() {
  const router = Router();

  router.route("/register/check-availability").get(checkAvailability);
  router.route("/register/send-verification-email").post(sendVerificationEmail);
  router.route("/register/verify-and-create").post(verifyAndCreate);
  router.route("/login").post(login);
  router.route("/logout").post(logout);

  router.route("/update/username").patch(updateUsername);
  router.route("/update/send-verification-email").post(requestEmailUpdate);
  router.route("/update/email").patch(verifyAndUpdateEmail);

  router.route("/tokens").post(generateTokens);
  router.route("/tokens/access-token").post(generateAccessToken);

  router.route("/google").get(google);
  router.route("/google/callback").get(googleCallback, googleRedirect);

  // TODO: implement
  router.route("/password/forgot").post();
  router.route("/password/reset").post();
  router.route("/password/change").post();

  return router;
}

export { createAuthV1Router };
