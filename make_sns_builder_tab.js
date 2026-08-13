const fs = require('fs');

const path = '/Users/a1234/Local Sites/creaibox/src/components/studio/custom-client-site/tabs/SnsBuilderTab.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove PLATFORMS and PlatformType
code = code.replace(/type PlatformType[\s\S]*?\];/m, '');
code = code.replace(/const activePlaceholder = .*?;/g, 'const activePlaceholder = "예) https://blog.naver.com/my_id";');

// 2. Change states
code = code.replace(/const \[platform, setPlatform\] = useState<PlatformType>\("instagram"\);/g, 
  `const [refType, setRefType] = useState<"none" | "text" | "pdf">("none");
  const [refText, setRefText] = useState("");
  const [refFile, setRefFile] = useState<File | null>(null);`);
code = code.replace(/const \[urls, setUrls\] = useState<string\[\]>\(\[""\]\);/g, 'const [urls, setUrls] = useState<string[]>(["", "", ""]);');

// 3. handleFileChange
code = code.replace(/const fetchHistory/g, `const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setRefFile(file);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
        e.target.value = "";
      }
    }
  };

  const fetchHistory`);

// 4. Update handleFinalSubmit for FormData
const submitOld = `const res = await fetch("/api/studio/sns-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: validUrls, platform, vibe, themeId }),
      });`;
const submitNew = `const formData = new FormData();
      validUrls.forEach(url => formData.append("urls", url));
      formData.append("vibe", vibe);
      formData.append("themeId", themeId);
      formData.append("refType", refType);
      if (refType === "text") formData.append("refText", refText);
      if (refType === "pdf" && refFile) formData.append("refPdf", refFile);

      const res = await fetch("/api/studio/sns-builder", {
        method: "POST",
        body: formData,
      });`;
code = code.replace(submitOld, submitNew);
code = code.replace(/setUrls\(\[""\]\);/g, 'setUrls(["", "", ""]); setRefText(""); setRefFile(null);');

// 5. Remove Platform Selection UI
code = code.replace(/\{\/\* Platform Selection \*\/\}[\s\S]*?\{\/\* URL Input \(Multi\) \*\/\}/m, '{/* URL Input (Multi) */}');

// 6. Update URL UI
const urlUIOld = `<div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2. 채널 및 참조 주소 입력 (최대 3개)</label>
              {urls.length < 3 && (
                <button
                  type="button"
                  onClick={() => setUrls([...urls, ""])}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <span>+ 주소 추가하기</span>
                </button>
              )}
            </div>`;
const urlUINew = `<div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1. 다중 참조 주소 입력 (고정 3개)</label>
            </div>`;
code = code.replace(urlUIOld, urlUINew);

// Remove the delete URL button and mapping logic update
const deleteUrlOld = `\{urls.length > 1 && \([\s\S]*?\<\/button\>\n                  \)\}`;
code = code.replace(/\{urls\.length > 1 && \([\s\S]*?\<\/button\>\n                  \)\}/m, '');
code = code.replace(/placeholder=\{index === 0 \? activePlaceholder : "참조할 추가 웹사이트 URL \(예: 네이버 플레이스 주소\)"\}/, 'placeholder={index === 0 ? activePlaceholder : index === 1 ? "예) https://map.naver.com/..." : "예) https://instagram.com/..."}');

// 7. Add Ref UI
const refUI = `
          {/* Reference Input */}
          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2. 참조 자료 첨부 (선택 사항)</label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRefType("none")}
                className={\`p-4 rounded-2xl border text-left transition-all \${refType === "none" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}\`}
              >
                <Sparkles className={\`w-5 h-5 mb-2 \${refType === "none" ? "text-indigo-400" : "text-slate-500"}\`} />
                <div className="text-sm font-bold text-white mb-1">AI 자율 창작</div>
                <div className="text-xs text-slate-400 leading-relaxed">자료 없이 기존 문맥만으로 알아서 유추 생성</div>
              </button>
              
              <button
                type="button"
                onClick={() => setRefType("text")}
                className={\`p-4 rounded-2xl border text-left transition-all \${refType === "text" ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}\`}
              >
                <FileText className={\`w-5 h-5 mb-2 \${refType === "text" ? "text-blue-400" : "text-slate-500"}\`} />
                <div className="text-sm font-bold text-white mb-1">텍스트 입력</div>
                <div className="text-xs text-slate-400 leading-relaxed">핵심 키워드나 원하는 내용을 직접 타이핑</div>
              </button>

              <button
                type="button"
                onClick={() => setRefType("pdf")}
                className={\`p-4 rounded-2xl border text-left transition-all \${refType === "pdf" ? "border-rose-500 bg-rose-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}\`}
              >
                <Layers className={\`w-5 h-5 mb-2 \${refType === "pdf" ? "text-rose-400" : "text-slate-500"}\`} />
                <div className="text-sm font-bold text-white mb-1">PDF 파일</div>
                <div className="text-xs text-slate-400 leading-relaxed">보유 중인 소개서나 문서 업로드</div>
              </button>
            </div>

            {/* Dynamic Input Area */}
            <div className="mt-4">
              {refType === "text" && (
                <textarea
                  value={refText}
                  onChange={(e) => setRefText(e.target.value)}
                  className="w-full h-32 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl p-4 text-white text-sm transition-colors outline-none resize-none"
                  placeholder="새 홈페이지에 들어가야 할 내용, 키워드, 인사말 등을 자유롭게 적어주세요."
                />
              )}

              {refType === "pdf" && (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer hover:bg-slate-900 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Layers className="w-8 h-8 mb-3 text-slate-500" />
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold text-white">클릭하여 업로드</span> 하거나 파일을 끌어다 놓으세요.
                      </p>
                      <p className="text-xs text-slate-500">PDF 파일만 지원됩니다. {refFile && <span className="text-rose-400 block mt-1">선택된 파일: {refFile.name}</span>}</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </label>
                </div>
              )}
            </div>
          </div>
`;

code = code.replace(/\{\/\* Vibe and Theme Selection \*\/\}/, refUI + '\n          {/* Vibe and Theme Selection */}');
code = code.replace(/Step 3\. 브랜드 분위기 선택/, 'Step 3. 브랜드 분위기 선택');
code = code.replace(/Step 4\. 웹사이트 레이아웃 테마/, 'Step 4. 웹사이트 레이아웃 테마');
code = code.replace(/AI Zero-to-One Site Builder/, 'AI Magic Website Builder');
code = code.replace(/SNS\/블로그 URL 입력 시 AI 홈페이지 자동 창작/, '다중 URL 및 참조 자료 기반 AI 홈페이지 자동 창작');

fs.writeFileSync(path, code);
