"use client";

import React, { useState } from "react";
import { QrCode, Search, Download, ExternalLink } from "lucide-react";

export default function QrGenerator() {
  const [inputText, setInputText] = useState("https://creaibox.com");
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Call free real QR Server API to render real scanning code
    const generated = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inputText.trim())}`;
    setQrUrl(generated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-lg font-black text-white mb-2">
          <QrCode className="text-zinc-300 animate-pulse" size={20} />
          무료 QR 코드 생성기
        </h2>
        <p className="text-xs text-zinc-555 mb-4 leading-relaxed">
          블로그 링크, 홍보용 랜딩 페이지, SNS 프로필, 또는 텍스트 문구를 입력하여 스캔 시 즉시 연결되는 실제 QR 코드를 실시간으로 무제한 생성합니다.
        </p>

        <form onSubmit={handleGenerate} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="QR 코드로 연결할 링크나 단어 입력... (예: https://creaibox.com)"
            className="flex-1 h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-xs font-semibold text-white outline-none placeholder:text-zinc-650 focus:border-zinc-555 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 px-6 text-xs font-black text-black transition shrink-0"
          >
            <QrCode size={14} />
            QR 생성
          </button>
        </form>
      </div>

      {qrUrl && (
        <div className="mx-auto max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 backdrop-blur-md text-center space-y-4">
          <div className="flex justify-between items-center text-left">
            <div>
              <p className="text-[9px] font-black text-zinc-400 uppercase">LIVE PREVIEW</p>
              <h3 className="text-xs font-black text-white mt-0.5">스캔용 QR 코드</h3>
            </div>
            
            <a
              href={qrUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded bg-zinc-850 hover:bg-zinc-800 px-3 text-[10px] font-bold text-zinc-350 transition"
            >
              확대 <ExternalLink size={10} />
            </a>
          </div>

          {/* Real working QR code image */}
          <div className="h-44 w-44 mx-auto overflow-hidden rounded-xl border border-zinc-850 bg-white p-3.5 flex items-center justify-center">
            <img
              src={qrUrl}
              alt="Scan QR Code"
              className="max-h-full max-w-full"
            />
          </div>

          <p className="text-[10px] text-zinc-500 font-bold leading-normal">
            카메라 앱으로 비추면 즉시 <span className="text-white underline">{inputText}</span> 링크로 연결됩니다.
          </p>

          <a
            href={qrUrl}
            download="creaibox_qr.png"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition"
          >
            <Download size={13} />
            QR 코드 이미지 다운로드
          </a>
        </div>
      )}
    </div>
  );
}
