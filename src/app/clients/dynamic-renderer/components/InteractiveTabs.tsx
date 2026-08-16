"use client";

import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  contentHtml?: string;
  items?: any[];
}

export interface InteractiveTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function InteractiveTabs({
  tabs,
  defaultTabId,
  title,
  subtitle,
  className = "",
}: InteractiveTabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs && tabs.length > 0 ? tabs[0].id : "")
  );

  if (!tabs || tabs.length === 0) return null;

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className={`w-full max-w-7xl mx-auto py-8 ${className}`}>
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

      {/* Tab Selector Buttons Bar */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 md:gap-3 mb-10">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Area with Smooth Fade */}
      <div className="animate-fade-in transition-all duration-300">
        {currentTab.contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: currentTab.contentHtml }} />
        ) : currentTab.items && currentTab.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentTab.items.map((item, iIdx) => (
              <div
                key={iIdx}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {item.image && typeof item.image === "string" && item.image.trim() !== "" && (
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    <img
                      src={item.image}
                      alt={item.title || item.name || "Item"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">
                    {item.title || item.name}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.price && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-extrabold text-primary text-lg">
                      {typeof item.price === "number" ? `${item.price.toLocaleString()}원` : item.price}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            등록된 항목이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
