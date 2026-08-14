"use client";

import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";

export interface PricingPlan {
  name: string;
  monthlyPrice: number | string;
  yearlyPrice?: number | string;
  description?: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  discountBadge?: string; // e.g. "연간 결제 시 20% 할인"
  className?: string;
}

export default function PricingTable({
  plans,
  title,
  subtitle,
  discountBadge = "20% 할인",
  className = "",
}: PricingTableProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  if (!plans || plans.length === 0) return null;

  return (
    <div className={`w-full max-w-7xl mx-auto py-12 px-4 md:px-8 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-10 space-y-3">
          {subtitle && (
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary px-3 py-1 bg-primary/10 rounded-full inline-block">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Monthly / Yearly Toggle Switch */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span
          onClick={() => setBillingCycle("monthly")}
          className={`text-sm md:text-base font-bold cursor-pointer transition-colors ${
            billingCycle === "monthly" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          월간 결제
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billingCycle === "yearly"}
          onClick={() => setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))}
          className="relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-900 transition-colors duration-200 ease-in-out focus:outline-none"
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
        <div className="flex items-center gap-2">
          <span
            onClick={() => setBillingCycle("yearly")}
            className={`text-sm md:text-base font-bold cursor-pointer transition-colors ${
              billingCycle === "yearly" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            연간 결제
          </span>
          {discountBadge && (
            <span className="bg-emerald-500/10 text-emerald-600 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {discountBadge}
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-${Math.min(plans.length, 3)} gap-8 items-stretch`}
      >
        {plans.map((plan, idx) => {
          const price =
            billingCycle === "yearly" && plan.yearlyPrice !== undefined
              ? plan.yearlyPrice
              : plan.monthlyPrice;

          return (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? "bg-slate-900 text-white shadow-2xl scale-105 ring-2 ring-primary border border-slate-800 z-10"
                  : "bg-white text-slate-900 shadow-md hover:shadow-xl border border-slate-100"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  가장 인기있는 선택
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight">{plan.name}</h3>
                </div>
                {plan.description && (
                  <p
                    className={`text-xs md:text-sm mb-6 ${
                      plan.isPopular ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {plan.description}
                  </p>
                )}

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-mono">
                    {typeof price === "number" ? `${price.toLocaleString()}원` : price}
                  </span>
                  <span
                    className={`text-xs md:text-sm ${
                      plan.isPopular ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    /{billingCycle === "yearly" ? "년" : "월"}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm md:text-base">
                      <span
                        className={`p-0.5 rounded-full mt-0.5 flex-shrink-0 ${
                          plan.isPopular
                            ? "bg-primary/20 text-primary"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                      <span className={plan.isPopular ? "text-slate-200" : "text-slate-600"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={plan.buttonLink || "#"}
                className={`w-full py-4 rounded-2xl font-bold text-center text-sm md:text-base transition-all duration-200 block shadow-sm ${
                  plan.isPopular
                    ? "bg-primary text-white hover:opacity-90 shadow-primary/30 shadow-lg"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {plan.buttonText || "시작하기"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
