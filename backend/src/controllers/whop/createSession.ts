import asyncHandler from "express-async-handler";
import { success, fail } from "../../lib/index.js";
import fetch from "node-fetch"; // or global fetch if Node >=18

export const createWhopCheckout = asyncHandler(async (req, res) => {
  const { tierName, billingCycle } = req.body;

  if (!tierName || !billingCycle) return fail(res, 400);

  try {
    // Map your tierName + billingCycle to Whop product IDs
    const productIdMap: Record<string, Record<string, string>> = {
      Basic: {
        monthly: "prod_basic_monthly_id",
        yearly: "prod_basic_yearly_id",
      },
      Pro: { monthly: "prod_pro_monthly_id", yearly: "prod_pro_yearly_id" },
    };

    const productId = productIdMap[tierName]?.[billingCycle];
    if (!productId) return fail(res, 400);

    // Create checkout session via Whop V2 API
    const response = await fetch("https://api.whop.com/v2/checkout_sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_WHOP_APP_ID,
        agent_user_id: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
        company_id: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
        product_id: productId,
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      }),
    });

    const data: any = await response.json();
    if (!response.ok) return fail(res, 500);

    return success(res, { checkoutUrl: data.checkout_url });
  } catch (err: any) {
    console.error("Whop create-checkout error:", err);
    return fail(res, 500);
  }
});
