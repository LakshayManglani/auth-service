import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validations) => {
  return asyncHandler(async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    throw new ApiError(400, "Missing or invalid data.", errors.array());
  });
};

export { validate };
