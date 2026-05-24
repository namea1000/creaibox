"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  ImageIcon, Heading1, Heading2, Bold, Italic, Link2,
  Type, Wand2, Copy, Save, Cpu, Trash2, Send, RefreshCw, Download, Eye
} from 'lucide-react';

interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}

interface NaverEditorCanvasProps {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  charCount: number;
  images: ImageBlock[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isSaving: boolean;
  isEnhancing: boolean;
  handleImageUploadClick: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateCaption: (id: string, text: string) => void;
  handleDeleteImage: (id: string) => void;
  handleEnhanceContent: (type: 'expand' | 'tone' | 'correct') => void;
  handleSavePostToSupabase: (status?: any) => Promise<boolean | void>;
  handleCopy?: () => void;
  handleFormDelete?: () => void;
  isRecreateMode?: boolean;
  isDetailMode?: boolean;
  targetKeyword?: string;
  isLoading?: boolean;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function applyInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function isMarkdownTableSeparator(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function parseMarkdownTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function markdownToEditableHtml(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, '\n').trim();
  if (!normalized) return '';

  const lines = normalized.split('\n');
  const blocks: string[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const cleaned = paragraphBuffer.map((line) => line.trimEnd()).filter(Boolean);
    if (cleaned.length > 0) {
      blocks.push(`<p>${cleaned.map((line) => applyInlineMarkdown(line)).join('<br />')}</p>`);
    }
    paragraphBuffer = [];
  };

  let index = 0;
  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      index += 1;
      continue;
    }

    if (/^####\s+/.test(line)) {
      flushParagraph();
      blocks.push(`<h4>${applyInlineMarkdown(line.replace(/^####\s+/, ''))}</h4>`);
      index += 1;
      continue;
    }

    if (/^###\s+/.test(line)) {
      flushParagraph();
      blocks.push(`<h3>${applyInlineMarkdown(line.replace(/^###\s+/, ''))}</h3>`);
      index += 1;
      continue;
    }

    if (/^##\s+/.test(line)) {
      flushParagraph();
      blocks.push(`<h2>${applyInlineMarkdown(line.replace(/^##\s+/, ''))}</h2>`);
      index += 1;
      continue;
    }

    if (/^#\s+/.test(line)) {
      flushParagraph();
      blocks.push(`<h1>${applyInlineMarkdown(line.replace(/^#\s+/, ''))}</h1>`);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(`<li>${applyInlineMarkdown(lines[index].trim().replace(/^[-*]\s+/, ''))}</li>`);
        index += 1;
      }
      blocks.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(`<li>${applyInlineMarkdown(lines[index].trim().replace(/^\d+\.\s+/, ''))}</li>`);
        index += 1;
      }
      blocks.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(applyInlineMarkdown(lines[index].trim().replace(/^>\s?/, '')));
        index += 1;
      }
      blocks.push(`<blockquote>${quoteLines.join('<br />')}</blockquote>`);
      continue;
    }

    if (
      line.includes('|') &&
      index + 1 < lines.length &&
      isMarkdownTableSeparator(lines[index + 1])
    ) {
      flushParagraph();
      const headerCells = parseMarkdownTableRow(line);
      index += 2;

      const bodyRows: string[][] = [];
      while (index < lines.length) {
        const tableLine = lines[index].trim();
        if (!tableLine || !tableLine.includes('|')) break;
        bodyRows.push(parseMarkdownTableRow(tableLine));
        index += 1;
      }

      const headerHtml = headerCells
        .map((cell) => `<th>${applyInlineMarkdown(cell)}</th>`)
        .join('');
      const bodyHtml = bodyRows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => `<td>${applyInlineMarkdown(cell)}</td>`)
              .join('')}</tr>`
        )
        .join('');

      blocks.push(
        `<div class="cb-table-wrap"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`
      );
      continue;
    }

    paragraphBuffer.push(rawLine);
    index += 1;
  }

  flushParagraph();
  return blocks.join('');
}

function editableSurfaceToMarkdown(root: HTMLDivElement) {
  const blocks: string[] = [];

  const stringifyNode = (node: ChildNode): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ?? '';
    }
    if (!(node instanceof HTMLElement)) return '';

    if (node.tagName === 'BR') return '\n';

    const childText = Array.from(node.childNodes).map(stringifyNode).join('');

    switch (node.tagName) {
      case 'STRONG':
      case 'B':
        return `**${childText}**`;
      case 'EM':
      case 'I':
        return `*${childText}*`;
      default:
        return childText;
    }
  };

  Array.from(root.children).forEach((element) => {
    if (!(element instanceof HTMLElement)) return;
    const tag = element.tagName;

    if (tag === 'H1') {
      blocks.push(`# ${element.innerText.trim()}`);
      return;
    }
    if (tag === 'H2') {
      blocks.push(`## ${element.innerText.trim()}`);
      return;
    }
    if (tag === 'H3') {
      blocks.push(`### ${element.innerText.trim()}`);
      return;
    }
    if (tag === 'H4') {
      blocks.push(`#### ${element.innerText.trim()}`);
      return;
    }
    if (tag === 'UL') {
      const items = Array.from(element.querySelectorAll(':scope > li'))
        .map((li) => `- ${Array.from(li.childNodes).map(stringifyNode).join('').trim()}`)
        .join('\n');
      blocks.push(items);
      return;
    }
    if (tag === 'OL') {
      const items = Array.from(element.querySelectorAll(':scope > li'))
        .map((li, index) => `${index + 1}. ${Array.from(li.childNodes).map(stringifyNode).join('').trim()}`)
        .join('\n');
      blocks.push(items);
      return;
    }
    if (tag === 'BLOCKQUOTE') {
      const lines = element.innerText
        .split('\n')
        .map((line: string) => line.trim())
        .filter(Boolean)
        .map((line: string) => `> ${line}`)
        .join('\n');
      blocks.push(lines);
      return;
    }
    if (tag === 'DIV' && element.classList.contains('cb-table-wrap')) {
      const table = element.querySelector('table');
      if (!table) return;

      const rows = Array.from(table.querySelectorAll('tr')).map((row) =>
        Array.from(row.children).map((cell) =>
          Array.from(cell.childNodes).map(stringifyNode).join('').trim()
        )
      );

      if (rows.length > 0) {
        const header = `| ${rows[0].join(' | ')} |`;
        const separator = `| ${rows[0].map(() => '---').join(' | ')} |`;
        const body = rows
          .slice(1)
          .map((row) => `| ${row.join(' | ')} |`)
          .join('\n');
        blocks.push([header, separator, body].filter(Boolean).join('\n'));
      }
      return;
    }

    const text = Array.from(element.childNodes).map(stringifyNode).join('').trim();
    if (text) {
      blocks.push(text);
    }
  });

  return blocks.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

export default function NaverEditorCanvas({
  title, setTitle, content, setContent, charCount, images, fileInputRef,
  isSaving, isEnhancing, handleImageUploadClick, handleImageChange,
  handleUpdateCaption, handleDeleteImage, handleEnhanceContent, 
  handleSavePostToSupabase, handleCopy, handleFormDelete,
  isRecreateMode = false, isDetailMode = false, targetKeyword = "AI 글쓰기", isLoading = false
}: NaverEditorCanvasProps) {
  const [saveFeedback, setSaveFeedback] = useState<'idle' | 'saved'>('idle');
  const contentEditableRef = useRef<HTMLDivElement | null>(null);
  const [isBodyEditing, setIsBodyEditing] = useState(false);

  useEffect(() => {
    if (saveFeedback !== 'saved') return;

    const timer = setTimeout(() => {
      setSaveFeedback('idle');
    }, 3000);

    return () => clearTimeout(timer);
  }, [saveFeedback]);

  const handleSaveClick = async (status?: any) => {
    const result = await handleSavePostToSupabase(status);
    if (result !== false) {
      setSaveFeedback('saved');
    }
  };

  useEffect(() => {
    if (!contentEditableRef.current || isBodyEditing) return;

    const nextHtml = markdownToEditableHtml(content);
    if (contentEditableRef.current.innerHTML !== nextHtml) {
      contentEditableRef.current.innerHTML = nextHtml;
    }
  }, [content, isBodyEditing]);

  const handleInlineContentInput = () => {
    if (!contentEditableRef.current) return;
    const nextValue = editableSurfaceToMarkdown(contentEditableRef.current)
      .replace(/\u00a0/g, ' ')
      .replace(/\r\n/g, '\n');
    setContent(nextValue);
  };

  const focusEditableSurface = () => {
    if (!contentEditableRef.current) return;
    contentEditableRef.current.focus();
  };

  const handleBodyFocus = () => {
    setIsBodyEditing(true);
  };

  const handleBodyBlur = () => {
    if (!contentEditableRef.current) {
      setIsBodyEditing(false);
      return;
    }

    const nextValue = editableSurfaceToMarkdown(contentEditableRef.current)
      .replace(/\u00a0/g, ' ')
      .replace(/\r\n/g, '\n');
    setContent(nextValue);
    setIsBodyEditing(false);
  };

  const handleDownload = () => {
    const fileContent = `# ${title}\n\n${content}`;
    const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${(title || targetKeyword || 'blog-post').slice(0, 40).replace(/[\\\\/:*?"<>|]/g, '').trim() || 'blog-post'}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!previewWindow) return;

    const previewHtml = `
      <!doctype html>
      <html lang="ko">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${escapeHtml(title || '미리보기')}</title>
          <style>
            body { margin: 0; padding: 48px 24px; background: #f5f5f4; color: #18181b; font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif; }
            .sheet { max-width: 920px; margin: 0 auto; background: white; padding: 56px 64px; box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-radius: 24px; }
            h1 { margin: 0 0 24px; font-size: 2.25rem; line-height: 1.2; font-weight: 900; }
            h2 { margin: 48px 0 18px; font-size: 1.7rem; line-height: 1.35; font-weight: 900; }
            h3 { margin: 40px 0 16px; font-size: 1.35rem; line-height: 1.45; font-weight: 800; }
            p, li { font-size: 1.08rem; line-height: 2; }
            ul, ol { margin: 0 0 28px 24px; }
            blockquote { margin: 32px 0; padding: 20px 24px; background: #f4f4f5; border-radius: 18px; color: #52525b; }
          </style>
        </head>
        <body>
          <article class="sheet">
            <h1>${escapeHtml(title || '제목 없음')}</h1>
            ${markdownToEditableHtml(content)}
          </article>
        </body>
      </html>
    `;

    previewWindow.document.open();
    previewWindow.document.write(previewHtml);
    previewWindow.document.close();
  };

  return (
    /* 🌟 [수술 핵심] 우측 관제탑 길이에 밀리지 않도록 에디터 박스 자체의 최소 높이를 min-h-[750px]로 고정 적출 */
    <div className="lg:col-span-6 flex flex-col bg-[#0a0c10] overflow-hidden h-full min-h-[750px]">
      <div className="h-14 border-b border-zinc-800 bg-gradient-to-r from-[#131722] via-[#141926] to-[#10141f] px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
            <span className="truncate text-[0.78rem] font-black tracking-[0.24em] text-zinc-300 uppercase">
              Creaibox Blog Edit Mode
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleCopy ? handleCopy : () => { navigator.clipboard.writeText(`제목: ${title}\n\n${content}`); }}
          className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Copy size={13} /> 전체 복사
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Download size={13} /> 다운로드
        </button>
        <button
          onClick={handlePreview}
          className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Eye size={13} /> 미리보기
        </button>
        <button 
          onClick={() => handleSaveClick(isDetailMode ? 'completed' : undefined)} 
          disabled={isSaving}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 text-xs font-black active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Save size={13} /> {isSaving ? "저장중..." : saveFeedback === 'saved' ? "저장완료" : "원고 저장"}
        </button>
        </div>
      </div>
      
      {/* 최상단 에디터 포맷터 핫 버튼 제어반 */}
      <div className="h-14 border-b border-zinc-800 bg-[#0b0d12] px-4 flex items-center justify-start overflow-x-auto shrink-0">
        <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button onClick={handleImageUploadClick} className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-all text-xs font-bold border border-zinc-800 bg-zinc-900/50 flex items-center gap-1"><ImageIcon size={14} /> 사진 추가</button>
          
          <div className="w-px h-5 bg-zinc-800 mx-1" />
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"><Heading1 size={15} /></button>
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"><Heading2 size={15} /></button>
          <div className="w-px h-4 bg-zinc-800 mx-1" />
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl font-bold transition-colors"><Bold size={15} /></button>
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl italic transition-colors"><Italic size={15} /></button>
          <div className="w-px h-4 bg-zinc-800 mx-1" />
          <button type="button" className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl transition-colors"><Link2 size={15} /></button>
          <div className="w-px h-5 bg-zinc-800 mx-1" />
          
          <button onClick={() => handleEnhanceContent('correct')} className="p-2 hover:bg-zinc-800 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1 text-zinc-300"><Type size={14} /> 맞춤법</button>
          <button onClick={() => handleEnhanceContent('expand')} disabled={isEnhancing} className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl text-xs font-black text-emerald-400 flex items-center gap-1"><Wand2 size={14} /> AI 보강</button>
        </div>

      </div>

      {/* 에디터 인풋 메인 프레임 격실 */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center gap-1.5 text-xs font-mono text-zinc-500">
            <RefreshCw size={14} className="animate-spin text-emerald-400" /> Supabase 원고 복원 데이터 바인딩 중...
          </div>
        ) : (
          <div className="mx-auto flex min-h-full w-full max-w-[920px] flex-col px-8 pb-12 pt-8 md:px-10">
            <div className="flex min-h-[760px] flex-col">
              <div className="mb-6 flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
                <input
                  type="text"
                  placeholder={isRecreateMode ? "AI 글 재창조를 가동하시면 중복 필터를 완전히 회피하는 제목이 빌드됩니다." : "제목을 입력하세요..."}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-[2.05rem] font-black leading-[1.28] tracking-[-0.03em] text-zinc-950 placeholder-zinc-400 focus:outline-none"
                />
                <span className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-mono text-zinc-500">
                  Chars: <strong className="text-emerald-500">{charCount}</strong>
                </span>
              </div>

              {images && images.length > 0 && (
                <div className="mb-6 grid grid-cols-1 gap-3 border-b border-zinc-200 pb-5 sm:grid-cols-2">
                  {images.map((img) => (
                    <div key={img.id} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm">
                      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-zinc-100">
                        <img src={img.url} alt="Uploaded Block" className="h-full w-full object-cover" />
                        <button onClick={() => handleDeleteImage(img.id)} className="absolute top-2 right-2 rounded-md bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"><Trash2 size={12} /></button>
                      </div>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                        className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div
                ref={contentEditableRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInlineContentInput}
                onFocus={handleBodyFocus}
                onBlur={handleBodyBlur}
                onClick={focusEditableSurface}
                tabIndex={0}
                role="textbox"
                aria-multiline="true"
                spellCheck={false}
                data-placeholder={isRecreateMode ? "재창조 본문 결과 영역..." : "내용을 채워주세요..."}
                className="min-h-[760px] w-full flex-1 cursor-text rounded-[10px] bg-transparent px-1 py-1 text-zinc-800 caret-zinc-950 outline-none transition-colors before:pointer-events-none before:absolute before:text-zinc-400 empty:before:content-[attr(data-placeholder)] focus:bg-zinc-50/70 [&_.cb-table-wrap]:my-8 [&_.cb-table-wrap]:overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_thead]:bg-zinc-100 [&_th]:border [&_th]:border-zinc-300 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-[1rem] [&_th]:font-black [&_td]:border [&_td]:border-zinc-200 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-[1rem] [&_td]:leading-[1.8] [&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-zinc-200 [&_h1]:pb-4 [&_h1]:text-[2.05rem] [&_h1]:font-black [&_h1]:leading-[1.25] [&_h1]:tracking-[-0.03em] [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-[1.72rem] [&_h2]:font-black [&_h2]:leading-[1.34] [&_h2]:tracking-[-0.02em] [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[1.35rem] [&_h3]:font-black [&_h3]:leading-[1.42] [&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:text-[1.18rem] [&_h4]:font-black [&_h4]:leading-[1.5] [&_p]:mb-6 [&_p]:text-[1.18rem] [&_p]:leading-[2.05] [&_p]:tracking-[-0.012em] [&_ul]:mb-8 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:text-[1.12rem] [&_ul]:leading-[1.95] [&_ol]:mb-8 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:text-[1.12rem] [&_ol]:leading-[1.95] [&_blockquote]:my-8 [&_blockquote]:rounded-[22px] [&_blockquote]:border [&_blockquote]:border-zinc-200 [&_blockquote]:bg-zinc-50 [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:text-[1.02rem] [&_blockquote]:font-medium [&_blockquote]:leading-[1.9] [&_blockquote]:text-zinc-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* 에디터 최하단 마감 마스터 필터 */}
      <div className="h-16 border-t border-zinc-800 bg-[#0b0d12] px-6 flex items-center justify-between shrink-0">
        {isDetailMode ? (
          <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 세션 완공 동기화 모드 : #{targetKeyword}</div>
        ) : (
          <span className="text-[11px] text-zinc-500 font-medium">
            {isRecreateMode ? "AI 재창조 원고 검증 파이프라인 대기 중" : "AI 스마트블록 통합 엔진 실시간 동기화 상태"}
          </span>
        )}
        <div className="flex items-center gap-2">
          {isDetailMode ? (
            <>
              <button onClick={handleFormDelete} className="p-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all flex items-center gap-1"><Trash2 size={13} /> 영구 삭제</button>
              <button onClick={() => handleSavePostToSupabase('published')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-500 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg"><Send size={13} /> 네이버로 즉시 발행</button>
            </>
          ) : isRecreateMode ? (
            <>
              <button onClick={handleCopy} className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800 transition-all"><Copy size={13} /> 결과 복사</button>
              <button onClick={() => handleSavePostToSupabase()} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">원고 최종 저장</button>
            </>
          ) : (
            <span className="text-[11px] text-zinc-600 font-medium flex items-center gap-1">
              <Cpu size={12} className="text-emerald-500" /> Supabase Authenticated Session Token Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
