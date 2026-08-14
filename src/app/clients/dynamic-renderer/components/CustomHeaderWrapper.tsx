"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CustomHeaderWrapperProps {
  html: string;
  menus: { label: string; path: string }[];
}

export default function CustomHeaderWrapper({ html, menus }: CustomHeaderWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  const handleClick = (e: React.MouseEvent) => {
    // Only intercept clicks on mobile
    if (window.innerWidth >= 768) return;

    const target = e.target as HTMLElement;
    
    // Look for button or svg clicks that are likely the hamburger menu
    // Typical AI generated mobile menus have <button> or <svg> inside a hidden div on desktop
    const buttonElement = target.closest('button');
    const svgElement = target.closest('svg');
    const hiddenWrapper = target.closest('.md\\:hidden, .lg\\:hidden, .hidden.sm\\:flex');

    if (buttonElement || svgElement || hiddenWrapper) {
      // If it's a link, we don't intercept (unless it's empty or #)
      const linkElement = target.closest('a');
      if (linkElement && linkElement.getAttribute('href') && linkElement.getAttribute('href') !== '#') {
        return; // Normal link click
      }
      
      e.preventDefault();
      
      if (!isMobileMenuOpen) {
        if (headerRef.current) {
           const rect = headerRef.current.getBoundingClientRect();
           setHeaderHeight(rect.height > 0 ? rect.height : 64);
        }
        setIsMobileMenuOpen(true);
      } else {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const [extractedLinks, setExtractedLinks] = useState<{label: string, path: string}[]>([]);

  // Parse original HTML to extract desktop navigation links for the mobile drawer
  useEffect(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const aTags = Array.from(doc.querySelectorAll('a'));
      
      const links: {label: string, path: string}[] = [];
      const seenLabels = new Set();
      
      aTags.forEach(a => {
        const text = a.textContent?.trim();
        const href = a.getAttribute('href');
        
        // Filter out empty links, logo links (contain img/svg), and social links
        if (text && href && href !== '#' && !a.querySelector('img') && !a.querySelector('svg')) {
          if (!seenLabels.has(text)) {
            links.push({ label: text, path: href });
            seenLabels.add(text);
          }
        }
      });
      
      // Combine extracted links with any dynamic subpage menus (avoiding duplicates)
      const combined = [...links];
      menus.forEach(m => {
        if (!seenLabels.has(m.label)) {
          combined.push(m);
          seenLabels.add(m.label);
        }
      });
      
      setExtractedLinks(combined);
    } catch (e) {
      console.error("Failed to extract links for mobile menu", e);
      setExtractedLinks(menus || []);
    }
  }, [html, menus]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Raw AI Header HTML with Click Interceptor */}
      <div 
        ref={headerRef}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: html }} 
        suppressHydrationWarning
        className="sticky top-0 z-[10000] w-full"
      />

      {/* Standardized Mobile Drawer Overlay (Starts strictly below the header) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed left-0 right-0 bottom-0 z-[9999] bg-white animate-fade-in flex flex-col shadow-2xl border-t border-slate-100"
          style={{ top: `${headerHeight}px` }}
        >
          <div className="flex flex-col p-6 gap-6 overflow-y-auto mt-4">
            {extractedLinks.map((menu) => {
              const href = menu.path.startsWith('/') || menu.path.startsWith('#') || menu.path.startsWith('http') 
                ? menu.path 
                : `/${menu.path}`;
                
              return (
                <a
                  key={menu.label}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-extrabold text-slate-800 hover:text-[var(--primary)] transition-colors pb-4 border-b border-slate-100 last:border-0"
                >
                  {menu.label}
                </a>
              );
            })}
          </div>
          
          {/* Close Area overlay just in case */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
}
