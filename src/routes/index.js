import { Router } from "express";
import { createAuthV1Router } from "./auth.routes.js";

function createRouter() {
  const router = Router();

  router.use("/v1", createV1Router());

  return router;
}

function createV1Router() {
  const router = Router();

  router.use("/auth", createAuthV1Router());

  return router;
}

export { createRouter };
