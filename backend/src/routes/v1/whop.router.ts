import express from "express";
const router = express.Router();
import { validateToken } from "../../middlewares/authHandler.js";

import * as whopController from "../../controllers/whop/index.js";

router.post("/", whopController.handlePayments);
router.post(
  "/create-session",
  validateToken,
  whopController.createWhopCheckout
);

export default router;
