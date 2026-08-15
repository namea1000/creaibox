"use client";

import { useEffect } from "react";

export default function CodeBlockCopyEnhancer() {
  useEffect(() => {
    function setupCodeBlockCopyButtons() {
      const codeBlocks = document.querySelectorAll<HTMLElement>("pre, .cb-code-wrapper");

      codeBlocks.forEach((block) => {
        // 이미 복사 버튼이 장착되어 있으면 패스
        if (block.querySelector(".cb-copy-code-btn") || block.classList.contains("cb-copy-enhanced")) {
          return;
        }

        block.classList.add("cb-copy-enhanced");

        // pre 요소인 경우 relative 포지션 보장
        if (getComputedStyle(block).position === "static") {
          block.style.position = "relative";
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cb-copy-code-btn";
        btn.setAttribute("aria-label", "Copy code");
        btn.innerHTML = `
          <svg class="copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span class="copy-text">Copy</span>
        `;

        btn.onclick = async (e) => {
          e.preventDefault();
          e.stopPropagation();

          // pre 내부의 순수 텍스트 추출 (코드 텍스트만)
          const codeEl = block.querySelector("code") || block;
          let textToCopy = codeEl.innerText || codeEl.textContent || "";
          
          // 가상요소 등 불필요한 줄바꿈/텍스트 정제
          textToCopy = textToCopy.replace(/^●\s*●\s*●\s*CODE\s*BLOCK\s*/i, "").trim();

          try {
            await navigator.clipboard.writeText(textToCopy);
            btn.classList.add("copied");
            btn.innerHTML = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span class="copy-text text-emerald-400 font-bold">Copied!</span>
            `;

            setTimeout(() => {
              btn.classList.remove("copied");
              btn.innerHTML = `
                <svg class="copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <span class="copy-text">Copy</span>
              `;
            }, 2000);
          } catch (err) {
            console.error("클립보드 복사 실패:", err);
          }
        };

        block.appendChild(btn);
      });
    }

    setupCodeBlockCopyButtons();

    // 동적 렌더링에 대응하기 위해 MutationObserver 설정
    const observer = new MutationObserver(() => {
      setupCodeBlockCopyButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <style jsx global>{`
      .cb-copy-code-btn {
        position: absolute;
        top: 10px;
        right: 12px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        background: rgba(24, 27, 36, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 6px;
        color: #94a3b8;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(8px);
        z-index: 20;
        user-select: none;
      }

      .cb-copy-code-btn:hover {
        background: rgba(38, 43, 56, 0.95);
        border-color: rgba(255, 255, 255, 0.25);
        color: #f1f5f9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      .cb-copy-code-btn.copied {
        background: rgba(6, 78, 59, 0.6);
        border-color: rgba(52, 211, 153, 0.4);
        color: #34d399;
      }

      .cb-copy-code-btn .copy-text {
        letter-spacing: 0.02em;
      }
    `}</style>
  );
}
