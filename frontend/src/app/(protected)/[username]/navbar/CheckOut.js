"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

export default function CheckoutModal({ isOpen, onClose }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  if (!isOpen) return null;

  const tiers = [
    {
      name: "Basic",
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        "Access to up to 500k deposits",
        "Monthly performance charts",
        "Yearly performance charts",
        "Basic asset tracking",
        "Email support",
      ],
      isPopular: false,
    },
    {
      name: "Premium",
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        "Unlimited deposits",
        "Unlimited performance charts",
        "Unlimited asset purchases",
        "Advanced analytics dashboard",
        "Real-time data updates",
        "Priority support",
        "Export data functionality",
      ],
      isPopular: true,
    },
  ];

  const handleCheckout = async (tierName) => {
    // Hardcoded endpoint for now
    const res = await fetch(
      "https://flash-trading-simulator-production.up.railway.app/api/v1/create-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you have auth token, include it here
          // Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tierName,
          billingCycle,
        }),
      }
    );

    const data = await res.json();

    if (data.checkoutUrl) {
      window.open(data.checkoutUrl, "_blank");
    } else {
      alert("Failed to create checkout session");
    }
  };

  const PricingTier = ({
    name,
    monthlyPrice,
    yearlyPrice,
    features,
    isPopular,
    billingCycle,
  }) => {
    const price = billingCycle === "monthly" ? monthlyPrice : yearlyPrice;

    return (
      <div
        className={`relative flex flex-col p-6 rounded-xl border-2 transition-all ${
          isPopular
            ? "border-blue-500 bg-blue-500/5 scale-105"
            : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
        }`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
            MOST POPULAR
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">${price}</span>
            <span className="text-gray-400">
              /{billingCycle === "monthly" ? "mo" : "yr"}
            </span>
          </div>
        </div>

        <ul className="space-y-3 mb-6 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Check
                size={16}
                className="text-green-400 mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleCheckout(name)}
          className={`w-full py-3 rounded-lg font-semibold transition cursor-pointer text-center ${
            isPopular
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          Get Started
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-800 p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Choose Your Plan
          </h2>
          <p className="text-gray-400">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <span
            className={`text-sm font-medium ${
              billingCycle === "monthly" ? "text-white" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className={`relative w-14 h-7 rounded-full transition cursor-pointer ${
              billingCycle === "yearly" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingCycle === "yearly" ? "translate-x-7" : ""
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              billingCycle === "yearly" ? "text-white" : "text-gray-500"
            }`}
          >
            Yearly
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <PricingTier
              key={tier.name}
              name={tier.name}
              monthlyPrice={tier.monthlyPrice}
              yearlyPrice={tier.yearlyPrice}
              features={tier.features}
              isPopular={tier.isPopular}
              billingCycle={billingCycle}
            />
          ))}
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Secure checkout powered by Whop
        </p>
      </div>
    </div>
  );
}
