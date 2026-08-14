"use client";

import React, { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

export interface AccordionItem {
  question: string;
  answer: string;
  category?: string;
}

export interface InteractiveAccordionProps {
  items: AccordionItem[];
  title?: string;
  subtitle?: string;
  styleType?: "modern" | "bordered" | "card";
  allowMultiple?: boolean;
  className?: string;
}

export default function InteractiveAccordion({
  items,
  title,
  subtitle,
  styleType = "card",
  allowMultiple = false,
  className = "",
}: InteractiveAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
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

      <div className="space-y-4">
        {items.map((item, idx) => {
          const isOpen = openIndexes.includes(idx);

          return (
            <div
              key={idx}
              className={`transition-all duration-200 overflow-hidden ${
                styleType === "card"
                  ? `rounded-2xl border ${
                      isOpen
                        ? "bg-slate-50/80 border-slate-300 shadow-md ring-1 ring-primary/20"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`
                  : styleType === "bordered"
                  ? "border-b border-slate-200 pb-4"
                  : "bg-white/60 backdrop-blur rounded-xl border border-white/40 shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer gap-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                    Q{idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-base md:text-lg">
                    {item.question}
                  </span>
                </div>
                <span
                  className={`flex-shrink-0 p-1.5 rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 ${
                    isOpen ? "rotate-180 bg-primary/10 text-primary" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </span>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out px-5 md:px-6 pb-6 pt-0 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden pb-0"
                }`}
              >
                <div className="text-slate-600 text-sm md:text-base leading-relaxed pl-10 border-l-2 border-primary/30 whitespace-pre-line">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
