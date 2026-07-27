"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Link2 } from "lucide-react";

export interface OGData {
  url: string;
  domain: string;
  title: string;
  description?: string;
  image?: string | null;
}

interface OGLinkCardProps {
  url: string;
  data?: OGData | null;
  className?: string;
}

export default function OGLinkCard({ url, data: initialData, className = "" }: OGLinkCardProps) {
  const [ogData, setOgData] = useState<OGData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setOgData(initialData);
      setLoading(false);
      return;
    }

    if (!url) return;

    let isMounted = true;
    setLoading(true);
    setError(false);

    async function fetchOG() {
      try {
        const res = await fetch(`/api/og/fetch?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error("Failed to fetch OG data");
        const json = await res.json();
        if (isMounted) {
          setOgData(json);
        }
      } catch {
        if (isMounted) {
          setError(true);
          try {
            const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
            setOgData({
              url,
              domain: parsed.hostname,
              title: url,
              description: "",
              image: null,
            });
          } catch {
            setOgData({
              url,
              domain: "creaibox.com",
              title: url,
              description: "",
              image: null,
            });
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchOG();

    return () => {
      isMounted = false;
    };
  }, [url, initialData]);

  if (loading) {
    return (
      <div className={`my-6 max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm animate-pulse ${className}`}>
        <div className="h-44 w-full rounded-xl bg-zinc-100 mb-3" />
        <div className="h-4 w-3/4 bg-zinc-200 rounded mb-2" />
        <div className="h-3 w-1/2 bg-zinc-100 rounded" />
      </div>
    );
  }

  const title = ogData?.title || url;
  const description = ogData?.description || "";
  const image = ogData?.image;
  const domain = ogData?.domain || "creaibox.com";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group my-3.5 block max-w-2xl mx-auto overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-blue-400 hover:shadow-md no-underline ${className}`}
    >
      {image && (
        <div className="w-full aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={(e) => {
              // If image fails to load, hide thumbnail container
              (e.currentTarget.parentElement as HTMLElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-4 sm:p-4.5">
        <h4 className="text-[1.1rem] sm:text-lg font-bold text-zinc-950 group-hover:text-blue-600 line-clamp-2 leading-snug transition-colors">
          {title}
        </h4>
        {description && (
          <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal">
            {description}
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <Link2 size={13} className="text-emerald-500 shrink-0" />
          <span>{domain}</span>
        </div>
      </div>
    </a>
  );
}
