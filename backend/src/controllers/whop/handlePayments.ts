import asyncHandler from "express-async-handler";
import { success, fail } from "../../lib/index.js";

export const handlePayments = asyncHandler(async (req, res) => {
  // Hardcoded secret for now
  const WHOP_WEBHOOK_SECRET =
    "ws_80d66263e7f673c21591b4404e63026d1280b49b6359669a4ef25e68710d2911";

  const whopSignature = req.headers["whop-signature"];

  console.log("Incoming Whop webhook signature:", whopSignature);
  console.log("Expected secret (hardcoded):", WHOP_WEBHOOK_SECRET);
  console.log("Payload:", req.body);

  return success(res, { received: true });
});
