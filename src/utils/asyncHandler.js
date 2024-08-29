/**
 *
 * @description wrapper for controllers which returns a given requestHandler function
 *
 * @param {import("express").RequestHandler} requestHandler
 *
 * @returns {import("express").RequestHandler}
 */
function asyncHandler(requestHandler) {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
}

export { asyncHandler };
