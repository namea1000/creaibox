"use client";

import React from "react";
import PublishDashboard from "../components/PublishDashboard";

export default function PublishPostsPage() {
  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#06080d] px-5 py-8 text-zinc-800 dark:text-zinc-100 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <PublishDashboard defaultTab="publish" />
      </div>
    </div>
  );
}
