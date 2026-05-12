"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, Trash2, Edit3, Eye, 
  Share2, Mail, Download, ChevronRight, 
  Filter, Calendar, MoreVertical, LayoutGrid, List,
  Type, AlignLeft, MessageSquare, Copy, Send, ChevronDown, Loader2, X, Settings, Save, FileDown,
  Zap, Sparkles, Code, Database, CheckCircle2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PostListTab({ user: propUser, isDarkMode }: any) { 
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // 🌟 스키마 관련 상태 추가
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [schemaType, setSchemaType] = useState('AI_AUTO');
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
  const [tempSchemaCode, setTempSchemaCode] = useState('');
  const [aiSuggestionMsg, setAiSuggestionMsg] = useState('');
  
  const supabase = createClient(); 

  const themeBg = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const headerBg = isDarkMode ? "bg-[#0a0c10]/50" : "bg-zinc-50/80";
  const cardBg = isDarkMode ? "bg-zinc-900/20 border-zinc-800/50 hover:bg-zinc-800/40" : "bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const subTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-400";
  const borderColor = isDarkMode ? "border-zinc-800/50" : "border-zinc-200";

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      const currentUserEmail = sessionUser?.email || propUser?.email;
      if (!currentUserEmail) return;

      const { data, error } = await supabase
        .from('writing_wordpress_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data);
        if (data.length > 0 && !selectedPost) {
          setSelectedPost(data[0]);
        }
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [propUser]);
  
  const handleDelete = async (id: string) => {
    if(confirm("정말 이 포스팅을 삭제하시겠습니까?")) {
      const { error } = await supabase.from('writing_wordpress_posts').delete().eq('id', id);
      if(!error) {
        const updatedPosts = posts.filter(p => p.id !== id);
        setPosts(updatedPosts);
        if (selectedPost?.id === id) {
          setSelectedPost(updatedPosts.length > 0 ? updatedPosts[0] : null);
        }
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    try {
      const { error } = await supabase
        .from('writing_wordpress_posts')
        .update({ title: selectedPost.title, content: selectedPost.content })
        .eq('id', selectedPost.id);
      if (!error) {
        alert("수정사항이 저장되었습니다.");
        setIsEditing(false);
        fetchPosts();
      }
    } catch (error) { console.error(error); }
  };

  const handleCopy = () => {
    if (!selectedPost) return;
    navigator.clipboard.writeText(selectedPost.content);
    alert("복사되었습니다!");
  };

  // 🌟 스키마 생성 및 AI 자동 추천 로직
  const generateSchemaMarkup = async () => {
    if (!selectedPost) return;
    setIsGeneratingSchema(true);
    setAiSuggestionMsg('');
    
    // AI 분석 시뮬레이션
    setTimeout(() => {
      let finalType = schemaType;
      const content = selectedPost.content;

      if (schemaType === 'AI_AUTO') {
        if (content.includes('방법') || content.includes('순서') || content.includes('단계')) {
          finalType = 'HowTo';
          setAiSuggestionMsg("이 글은 단계별 설명이 포함되어 있네요? 'HowTo' 스키마를 추천합니다.");
        } else if (content.includes('맛집') || content.includes('위치') || content.includes('식당')) {
          finalType = 'LocalBusiness';
          setAiSuggestionMsg("장소 정보가 감지되었습니다. 'LocalBusiness' 스키마를 추천합니다.");
        } else if (content.includes('리뷰') || content.includes('별점')) {
          finalType = 'Review';
          setAiSuggestionMsg("평가 내용이 포함되어 있군요. 'Review' 스키마를 추천합니다.");
        } else {
          finalType = 'Article';
          setAiSuggestionMsg("일반적인 정보성 글이군요. 'Article' 스키마를 추천합니다.");
        }
      }

      const schemaTemplate: any = {
        "@context": "https://schema.org",
        "@type": finalType === 'AI_AUTO' ? 'BlogPosting' : finalType,
        "headline": selectedPost.title,
        "description": selectedPost.content.substring(0, 150).replace(/\n/g, " "),
        "author": { "@type": "Person", "name": "AI Editor" },
        "datePublished": new Date(selectedPost.created_at).toISOString()
      };

      // 타입별 특화 필드 추가
      if (finalType === 'HowTo') schemaTemplate["step"] = [{ "@type": "HowToStep", "text": "첫 번째 단계를 입력하세요." }];
      if (finalType === 'Review') schemaTemplate["reviewRating"] = { "@type": "Rating", "ratingValue": "5", "bestRating": "5" };
      if (finalType === 'VideoObject') schemaTemplate["uploadDate"] = new Date().toISOString();

      setTempSchemaCode(JSON.stringify(schemaTemplate, null, 2));
      setIsGeneratingSchema(false);
    }, 1200);
  };

  const applySchemaToContent = () => {
    const schemaScript = `\n\n<script type="application/ld+json">\n${tempSchemaCode}\n</script>\n`;
    setSelectedPost({ ...selectedPost, content: selectedPost.content + schemaScript });
    setIsSchemaModalOpen(false);
    setIsEditing(true);
    alert("스키마가 본문 하단에 삽입되었습니다. 'Save Changes'를 눌러 완료하세요!");
  };

  // 🌟 [배포 에러 완벽 해결] PDF/TXT 다운로드 함수
const downloadFile = async (type: 'txt' | 'pdf') => {
    if (!selectedPost) return;
    
    if (type === 'txt') {
      const element = document.createElement("a");
      const file = new Blob([selectedPost.content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${selectedPost.title}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        
        const parseMarkdownForPdf = (text: string) => {
          return text
            .replace(/^\|(.+)\|$/gim, (match) => {
              const rows = match.trim().split('\n');
              let res = '<table style="width:100%; border-collapse:collapse; margin:20px 0; border:1px solid #ddd;">';
              rows.forEach((row, i) => {
                if (row.includes('---')) return;
                const cells = row.split('|').filter(c => c.trim() !== '');
                res += '<tr>';
                cells.forEach(cell => {
                  const style = i === 0 ? 'background:#f8fafc; font-weight:bold; border:1px solid #ddd; padding:10px;' : 'border:1px solid #ddd; padding:10px;';
                  res += `<td style="${style}">${cell.trim()}</td>`;
                });
                res += '</tr>';
              });
              return res + '</table>';
            })
            .replace(/^## (.*$)/gim, '<h2 style="border-left:5px solid #8b5cf6; padding-left:12px; margin-top:30px; font-weight:900; color:#000;">$1</h2>')
            .replace(/\*\*(.*)\*\*/gim, '<strong style="font-weight:900; color:#000;">$1</strong>')
            .replace(/\n\n/g, '<div style="margin-bottom:15px;"></div>')
            .replace(/\n/g, '<br/>');
        };

        const element = document.createElement('div');
        element.innerHTML = `
          <div style="padding: 40px; font-family: sans-serif; background: white;">
            <h1 style="font-size: 30px; font-weight: 900; color: #000; border-bottom: 8px solid #f3e8ff; padding-bottom: 15px; margin-bottom: 30px; font-style: italic;">
              ${selectedPost.title}
            </h1>
            <div style="line-height: 1.8; font-size: 14px; color: #333;">
              ${parseMarkdownForPdf(selectedPost.content)}
            </div>
          </div>
        `;

        const opt = {
          margin: 10,
          filename: `${selectedPost.title}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        } as const;

        html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error("PDF 에러:", err);
      }
    }
    setShowDownloadMenu(false);
  };

  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={`flex h-full border-l ${borderColor} divide-x ${borderColor} font-sans ${themeBg} ${textColor}`}>
      
      {/* --- [왼쪽] 리스트 영역 (35%) --- */}
      <div className={`w-[35%] flex flex-col border-r ${borderColor} ${selectedPost ? 'hidden lg:flex' : 'flex'}`}>
        <div className={`p-8 border-b backdrop-blur-xl shrink-0 transition-all ${headerBg} ${borderColor}`}>
          <div className="flex justify-between items-end mb-8">
            <h2 className={`text-2xl font-black italic tracking-tighter uppercase ${textColor}`}>Post Management</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="제목 검색..."
              className={`w-full border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" size={30} /></div>
          ) : (
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>
                  <th className="px-4 py-2 text-left w-12">No</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left w-24">Date</th>
                  <th className="px-6 py-2 text-center w-24 text-blue-500 italic font-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, idx) => (
                  <tr key={post.id} className={`group border transition-all cursor-pointer ${selectedPost?.id === post.id ? 'bg-blue-600/10 border-blue-500/50' : cardBg}`} onClick={() => { setSelectedPost(post); setIsEditing(false); }}>
                    <td className={`px-4 py-4 rounded-l-2xl border-y border-l text-[11px] font-bold ${selectedPost?.id === post.id ? 'text-blue-500' : subTextColor} ${borderColor}`}>{posts.length - idx}</td>
                    <td className={`px-4 py-4 border-y ${borderColor}`}><span className={`text-[13px] font-black group-hover:text-blue-500 transition-colors ${selectedPost?.id === post.id ? 'text-blue-500' : textColor}`}>{post.title}</span></td>
                    <td className={`px-4 py-4 border-y text-[10px] font-bold ${subTextColor} ${borderColor}`}>{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className={`px-4 py-4 rounded-r-2xl border-y border-r ${borderColor}`} onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setSelectedPost(post); setIsEditing(true); }} className="p-1.5 hover:bg-blue-500/10 rounded-lg text-zinc-500 hover:text-blue-500 transition-all"><Edit3 size={14}/></button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

{/* --- [오른쪽] 작업 영역 (65%) --- */}
      {selectedPost && (
        <div className={`w-[65%] min-h-screen flex flex-col animate-in slide-in-from-right duration-500 ${isDarkMode ? 'bg-[#0d1117]' : 'bg-white shadow-2xl'}`}>
          {/* 상단 툴바: 스크롤해도 상단에 고정되게 하려면 sticky를 씁니다 */}
          <div className={`sticky top-0 z-20 p-6 border-b flex justify-between items-center backdrop-blur-md ${isDarkMode ? 'bg-[#0a0c10]/90 border-zinc-800/50' : 'bg-zinc-50/90 border-zinc-200'}`}>
            <button onClick={() => setSelectedPost(null)} className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ${subTextColor} hover:text-blue-500 transition-all`}>
              <ChevronRight className="rotate-180" size={16}/> Back to List
            </button>
            
            <div className="flex gap-2 relative">
              <button 
                onClick={() => setIsSchemaModalOpen(true)}
                className="px-4 py-2 rounded-xl text-[11px] font-black bg-violet-600 text-white flex items-center gap-2 hover:bg-violet-500 transition-all shadow-lg"
              >
                <Zap size={14} /> 스키마 마크업 생성
              </button>

              <button 
                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${isEditing ? 'bg-emerald-600 text-white' : 'bg-emerald-400 text-emerald-950 border border-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
              >
                {isEditing ? <Save size={14}/> : <Edit3 size={14}/>}
                {isEditing ? 'Save Changes' : 'Edit Post'}
              </button>

              <button onClick={handleCopy} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isDarkMode ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'}`}>
                <Copy size={14} /> Copy
              </button>

              <div className="relative">
                <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isDarkMode ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600 shadow-sm'}`}>
                  <FileDown size={14} /> Download
                </button>
                {showDownloadMenu && (
                  <div className={`absolute top-full right-0 mt-2 w-36 rounded-xl border shadow-2xl z-50 overflow-hidden ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                    <button onClick={() => downloadFile('txt')} className="w-full px-4 py-3 text-[10px] font-black uppercase text-left hover:bg-blue-600 hover:text-white transition-all">.TXT Download</button>
                    <button onClick={() => downloadFile('pdf')} className="w-full px-4 py-3 text-[10px] font-black uppercase text-left hover:bg-purple-600 hover:text-white transition-all">.PDF Download</button>
                  </div>
                )}
              </div>

              <button onClick={() => handleDelete(selectedPost.id)} className="px-4 py-2 rounded-xl text-[11px] font-black bg-red-600/10 text-red-500 border border-red-500/30 flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                <Trash2 size={14}/> 삭제하기
              </button>
            </div>
          </div>
          
          {/* 🌟 핵심 수정: overflow-y-auto를 제거하고 높이 제한을 풀었습니다 */}
          <div className="flex-1 p-12 font-sans">
            <div className="grid grid-cols-4 gap-4 mb-10">
               <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">WP Category</p>
                  <p className="text-[12px] font-bold text-blue-500 truncate">{selectedPost.categories?.[0] || 'N/A'}</p>
               </div>
               <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">WP Post ID</p>
                  <p className="text-[12px] font-bold text-emerald-500 truncate">{selectedPost.wp_post_id || 'Draft'}</p>
               </div>
               <button className="p-4 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all flex flex-col items-center justify-center gap-1 shadow-xl shadow-blue-900/20 active:scale-95">
                  <Send size={16} />
                  <span className="text-[10px] font-black uppercase">WP Publish</span>
               </button>
               <button onClick={() => setIsPreviewOpen(true)} className="p-4 bg-purple-600 rounded-xl text-white hover:bg-purple-500 transition-all flex flex-col items-center justify-center gap-1 shadow-xl shadow-purple-900/20 active:scale-95">
                  <Eye size={16} />
                  <span className="text-[10px] font-black uppercase">Full Preview</span>
               </button>
            </div>

            <div className="max-w-4xl mx-auto font-sans">
               {isEditing ? (
                 <input value={selectedPost.title} onChange={(e) => setSelectedPost({...selectedPost, title: e.target.value})} className={`w-full text-3xl font-black italic tracking-tighter leading-tight mb-8 bg-transparent border-none focus:outline-none ${textColor}`} />
               ) : (
                 <h1 className="text-3xl font-black italic tracking-tighter leading-tight mb-8">{selectedPost.title}</h1>
               )}
               
               {isEditing ? (
                 <textarea 
                    value={selectedPost.content} 
                    onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})} 
                    className={`w-full min-h-[1000px] bg-transparent border-none font-mono text-[15px] leading-[2.2] focus:outline-none resize-none ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} 
                    style={{ height: 'auto' }} // 내용에 따라 늘어나게 하려면 이 설정이 중요합니다
                 />
               ) : (
                 <div className={`prose prose-invert max-w-none text-[15px] leading-[2.0] ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({...props}) => (
                          <div className="my-6 overflow-hidden rounded-lg border border-zinc-200 shadow-sm">
                            <table className="w-full text-sm text-left border-collapse" {...props} />
                          </div>
                        ),
                        thead: ({...props}) => <thead className="bg-zinc-50 border-b border-zinc-200" {...props} />,
                        th: ({...props}) => <th className="px-4 py-3 font-bold text-zinc-700 border-r border-zinc-200 last:border-0" {...props} />,
                        td: ({...props}) => <td className="px-4 py-3 border-t border-zinc-100 border-r border-zinc-200 last:border-0" {...props} />,
                        h2: ({...props}) => <h2 className="border-l-4 border-blue-500 pl-4 text-xl font-black mt-10 mb-4 text-zinc-900 dark:text-zinc-100" {...props} />,
                        p: ({...props}) => <p className="mb-4" {...props} />,
                      }}
                    >
                      {selectedPost.content}
                    </ReactMarkdown>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* 🌟 스키마 마크업 생성 모달 추가 */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white'} border w-full max-w-2xl rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
            <div className="p-8 border-b border-zinc-800/50 flex justify-between items-center bg-violet-600/5">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2 tracking-tighter italic">
                  <Sparkles className="text-violet-500" size={20} /> AI SCHEMA ENGINE PRO
                </h3>
                <p className="text-[11px] font-bold text-zinc-500 mt-1 uppercase tracking-wider font-sans">구글/네이버 검색 엔진 최적화</p>
              </div>
              <button onClick={() => setIsSchemaModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-all text-zinc-500"><X size={24} /></button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto font-sans">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">스키마 유형 선택</label>
                  <select 
                    value={schemaType}
                    onChange={(e) => setSchemaType(e.target.value)}
                    className={`w-full p-4 rounded-2xl border font-bold text-sm focus:outline-none focus:border-violet-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200'}`}
                  >
                    <option value="AI_AUTO">✨ AI 스키마 자동 추천 (기본)</option>
                    <option value="Article">📄 기사 (Article / Blog)</option>
                    <option value="FAQ">❓ 자주 묻는 질문 (FAQ)</option>
                    <option value="Product">🛍️ 상품 정보 (Product)</option>
                    <option value="HowTo">🪜 단계별 가이드 (HowTo)</option>
                    <option value="Review">⭐ 별점 및 리뷰 (Review)</option>
                    <option value="LocalBusiness">📍 지역 업체 (Restaurant/Hospital)</option>
                    <option value="VideoObject">🎬 영상 정보 (Video)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={generateSchemaMarkup}
                    disabled={isGeneratingSchema}
                    className="w-full p-4 bg-violet-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-violet-500 transition-all disabled:opacity-50"
                  >
                    {isGeneratingSchema ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                    {isGeneratingSchema ? 'AI 분석 중...' : '스키마 생성 및 분석'}
                  </button>
                </div>
              </div>

              {aiSuggestionMsg && (
                <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center gap-3 animate-in zoom-in">
                  <div className="bg-violet-500 p-2 rounded-xl text-white"><Sparkles size={16} /></div>
                  <p className="text-sm font-bold text-violet-500">{aiSuggestionMsg}</p>
                </div>
              )}

              {tempSchemaCode && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-violet-500 tracking-widest flex items-center gap-2 font-sans">
                      <Code size={14} /> JSON-LD 편집기
                    </label>
                    <span className="text-[9px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded">편집 가능</span>
                  </div>
                  <textarea 
                    value={tempSchemaCode}
                    onChange={(e) => setTempSchemaCode(e.target.value)}
                    className={`w-full h-64 p-6 rounded-2xl border font-mono text-[12px] leading-relaxed focus:outline-none focus:border-violet-500 ${isDarkMode ? 'bg-black border-zinc-800 text-emerald-400' : 'bg-zinc-900 border-zinc-200 text-emerald-400'}`}
                  />
                </div>
              )}
            </div>

            <div className="p-8 border-t border-zinc-800/50 bg-zinc-800/20 flex gap-3 font-sans">
              <button onClick={() => setIsSchemaModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-[12px] uppercase bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-all">취소</button>
              <button 
                onClick={applySchemaToContent}
                disabled={!tempSchemaCode}
                className="flex-[2] py-4 rounded-2xl font-black text-[12px] uppercase bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/30 disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> 본문 하단에 스키마 삽입하기
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Full Preview 모달 (마크다운 실제 화면 렌더링 버전) */}
      {isPreviewOpen && selectedPost && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-sans">
          <div className="bg-white text-zinc-900 w-full max-w-6xl h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col relative animate-in zoom-in duration-300 font-sans">
            
            {/* 상단 헤더 바 */}
            <div className="px-10 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/80 font-sans">
              <span className="text-[11px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-2 font-sans">
                <Eye size={16}/> WordPress Live Preview Mode
              </span>
              <button 
                onClick={() => setIsPreviewOpen(false)} 
                className="p-2 hover:bg-zinc-200 rounded-full transition-all active:scale-90 font-sans"
              >
                <X size={24} />
              </button>
            </div>

            {/* 실제 렌더링 본문 영역 */}
            <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-white custom-scrollbar text-left font-sans">
              <article className="max-w-3xl mx-auto font-sans">
                {/* 제목: 블랙 테마 적용 */}
                <h1 className="text-4xl font-black mb-12 leading-tight tracking-tighter italic border-b-8 border-purple-500/10 pb-8 font-sans text-zinc-900">
                  {selectedPost.title}
                </h1>

                {/* --- Full Preview 모달 본문 영역 수정 --- */}
<div className="markdown-content leading-[2.1] text-zinc-800 font-medium font-sans">
  <ReactMarkdown 
    remarkPlugins={[remarkGfm]} 
    components={{
      table: ({...props}) => (
        <div className="my-8 w-full overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
          <table className="w-full text-sm text-left border-collapse" {...props} />
        </div>
      ),
      thead: ({...props}) => <thead className="bg-zinc-50 border-b border-zinc-200" {...props} />,
      th: ({...props}) => <th className="px-5 py-4 font-black text-zinc-700 border-r border-zinc-200 last:border-0" {...props} />,
      td: ({...props}) => <td className="px-5 py-4 border-t border-zinc-100 border-r border-zinc-200 last:border-0" {...props} />,
      h2: ({...props}) => <h2 className="border-l-8 border-purple-500 pl-6 text-2xl font-black mt-16 mb-8 uppercase italic font-sans text-zinc-900" {...props} />,
      h3: ({...props}) => <h3 className="text-xl font-black mt-10 mb-4 text-zinc-800" {...props} />,
      p: ({...props}) => <p className="mb-6 font-sans text-zinc-700" {...props} />,
      strong: ({...props}) => <strong className="font-black text-zinc-900" {...props} />,
    }}
  >
    {/* 🌟 핵심: 스키마 script 태그를 정규식으로 제거하고 렌더링합니다 */}
    {selectedPost.content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")}
  </ReactMarkdown>
</div>
              </article>
            </div>
          </div>
        </div>
      )}
      {/* 🌟 여기서부터 컴포넌트 실제 마무리 괄호들 */}
    </div>
  );
}