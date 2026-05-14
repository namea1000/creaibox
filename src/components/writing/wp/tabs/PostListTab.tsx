"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, FileText, Trash2, Edit3, Eye, 
  ChevronRight, Loader2, X, Save, FileDown,
  Zap, Sparkles, Copy, Send
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PostListTab({ user: propUser }: any) { 
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [userNickname, setUserNickname] = useState<string>("");

  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [schemaType, setSchemaType] = useState('AI_AUTO');
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
  const [tempSchemaCode, setTempSchemaCode] = useState('');
  
  const supabase = createClient(); 

  const themeBg = "bg-[#0a0c10]";
  const headerBg = "bg-[#0a0c10]/50";
  const cardBg = "bg-zinc-900/20 border-zinc-800/50 hover:bg-zinc-800/40";
  const textColor = "text-zinc-100";
  const borderColor = "border-zinc-800/50";

  // 🌟 [핵심] 데이터 로드 로직: 닉네임과 이메일 동시 체크
  const fetchPosts = useCallback(async () => {
    try {
      console.log("🔄 [관리 페이지] 데이터 로드 시작...");
      setLoading(true);
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (!sessionUser) return;

      // 1. 프로필 닉네임 먼저 확인
      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', sessionUser.id)
        .single();
      
      const currentNickname = profile?.nickname || sessionUser.email?.split('@')[0];
      setUserNickname(currentNickname);

      // 2. OR 조건으로 데이터 호출 (이메일이 같거나 닉네임이 같거나)
      const { data, error } = await supabase
        .from('writing_wordpress_posts')
        .select('*')
        .or(`user_email.eq.${sessionUser.email},user_nickname.eq.${currentNickname}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPosts(data);
        // 선택된 글이 없으면 첫 번째 글 자동 선택
        if (data.length > 0 && !selectedPost) setSelectedPost(data[0]);
      }
      console.log("✅ [관리 페이지] 데이터 로드 완료:", data?.length, "건");
    } catch (error) {
      console.error("❌ 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedPost]);

  useEffect(() => { 
    fetchPosts(); 
  }, [propUser, fetchPosts]);
  
  const handleDelete = async (id: string) => {
    if(confirm("정말 이 포스팅을 삭제하시겠습니까?")) {
      const { error } = await supabase.from('writing_wordpress_posts').delete().eq('id', id);
      if(!error) {
        const updatedPosts = posts.filter(p => p.id !== id);
        setPosts(updatedPosts);
        if (selectedPost?.id === id) setSelectedPost(updatedPosts.length > 0 ? updatedPosts[0] : null);
        alert("삭제되었습니다.");
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;
    try {
      const { error } = await supabase
        .from('writing_wordpress_posts')
        .update({ 
          title: selectedPost.title, 
          content: selectedPost.content 
        })
        .eq('id', selectedPost.id);

      if (!error) {
        alert("수정사항이 저장되었습니다.");
        setIsEditing(false);
        fetchPosts();
      }
    } catch (error) { 
      console.error(error); 
      alert("수정 저장 중 오류가 발생했습니다.");
    }
  };

  const handleCopy = () => {
    if (!selectedPost) return;
    navigator.clipboard.writeText(selectedPost.content);
    alert("클립보드에 복사되었습니다!");
  };

  const generateSchemaMarkup = async () => {
    if (!selectedPost) return;
    setIsGeneratingSchema(true);
    
    // AI 추천 로직 시뮬레이션
    setTimeout(() => {
      let finalType = schemaType;
      const content = selectedPost.content;
      if (schemaType === 'AI_AUTO') {
        if (content.includes('방법') || content.includes('가이드')) finalType = 'HowTo';
        else if (content.includes('맛집') || content.includes('위치')) finalType = 'LocalBusiness';
        else if (content.includes('리뷰') || content.includes('추천')) finalType = 'Review';
        else finalType = 'Article';
      }
      
      const schemaTemplate = {
        "@context": "https://schema.org",
        "@type": finalType === 'AI_AUTO' ? 'BlogPosting' : finalType,
        "headline": selectedPost.title,
        "description": selectedPost.content.substring(0, 150).replace(/\n/g, " "),
        "author": { "@type": "Person", "name": userNickname || "AI Assistant" },
        "datePublished": new Date(selectedPost.created_at).toISOString()
      };
      
      setTempSchemaCode(JSON.stringify(schemaTemplate, null, 2));
      setIsGeneratingSchema(false);
    }, 1200);
  };

  const applySchemaToContent = () => {
    const schemaScript = `\n\n<script type="application/ld+json">\n${tempSchemaCode}\n</script>\n`;
    setSelectedPost({ ...selectedPost, content: selectedPost.content + schemaScript });
    setIsSchemaModalOpen(false);
    setIsEditing(true);
    alert("스키마가 본문 하단에 삽입되었습니다. 'Save' 버튼을 눌러 확정하세요.");
  };

  const downloadFile = async (type: 'txt' | 'pdf') => {
    if (!selectedPost) return;
    if (type === 'txt') {
      const element = document.createElement("a");
      const file = new Blob([selectedPost.content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${selectedPost.title}.txt`;
      element.click();
    } else {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.createElement('div');
        element.innerHTML = `
          <div style="padding:40px; font-family: sans-serif;">
            <h1 style="font-size: 24px; margin-bottom: 20px;">${selectedPost.title}</h1>
            <div style="line-height: 1.6; font-size: 14px;">${selectedPost.content}</div>
          </div>
        `;
        html2pdf().from(element).save(`${selectedPost.title}.pdf`);
      } catch (err) { 
        console.error(err);
        alert("PDF 생성 중 오류가 발생했습니다.");
      }
    }
    setShowDownloadMenu(false);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex h-full border-l ${borderColor} divide-x ${borderColor} font-sans ${themeBg} ${textColor}`}>
      
      {/* [왼쪽] 리스트 영역 */}
      <div className={`w-[35%] flex flex-col border-r ${borderColor} ${selectedPost ? 'hidden lg:flex' : 'flex'}`}>
        <div className={`p-8 border-b backdrop-blur-xl shrink-0 ${headerBg} ${borderColor}`}>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-8">Post Management</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="제목 검색..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-zinc-100 focus:outline-none focus:border-blue-600 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" size={30} /></div>
          ) : (
            <table className="w-full border-separate border-spacing-y-3">
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr><td className="text-center py-20 text-zinc-600 font-bold uppercase tracking-widest text-xs">No posts found.</td></tr>
                ) : (
                  filteredPosts.map((post, idx) => (
                    <tr 
                      key={post.id} 
                      className={`group border transition-all cursor-pointer ${selectedPost?.id === post.id ? 'bg-blue-600/10 border-blue-500/50' : cardBg}`} 
                      onClick={() => { setSelectedPost(post); setIsEditing(false); }}
                    >
                      <td className="px-4 py-4 rounded-l-2xl border-y border-l border-zinc-800/50 text-[11px] font-bold text-zinc-500">{posts.length - idx}</td>
                      <td className="px-4 py-4 border-y border-zinc-800/50">
                        <span className={`text-[13px] font-black group-hover:text-blue-500 transition-colors ${selectedPost?.id === post.id ? 'text-blue-500' : 'text-zinc-100'}`}>
                          {post.title}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-y border-zinc-800/50 text-[10px] font-bold text-zinc-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 rounded-r-2xl border-y border-r border-zinc-800/50" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => { setSelectedPost(post); setIsEditing(true); }} className="p-1.5 text-zinc-500 hover:text-blue-500 transition-all"><Edit3 size={14}/></button>
                          <button onClick={() => handleDelete(post.id)} className="p-1.5 text-zinc-500 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* [오른쪽] 작업 영역 */}
      {selectedPost && (
        <div className="w-[65%] min-h-screen flex flex-col bg-[#0d1117] animate-in slide-in-from-right duration-500">
          <div className="sticky top-0 z-20 p-6 border-b flex justify-between items-center backdrop-blur-md bg-[#0a0c10]/90 border-zinc-800/50">
            <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
              <ChevronRight className="rotate-180" size={16}/> Back to List
            </button>
            <div className="flex gap-2 relative">
              <button onClick={() => setIsSchemaModalOpen(true)} className="px-4 py-2 rounded-xl text-[11px] font-black bg-violet-600 text-white flex items-center gap-2 hover:bg-violet-500 transition-all shadow-lg"><Zap size={14} /> 스키마 생성</button>
              <button 
                onClick={() => isEditing ? handleUpdate() : setIsEditing(true)} 
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${isEditing ? 'bg-emerald-600 text-white' : 'bg-emerald-400 text-emerald-950 border border-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
              >
                {isEditing ? <Save size={14}/> : <Edit3 size={14}/>}
                {isEditing ? 'Save Changes' : 'Edit Post'}
              </button>
              
              <button onClick={handleCopy} className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white transition-all"><Copy size={14} /> Copy</button>
              
              <div className="relative">
                <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white transition-all"><FileDown size={14} /> Down</button>
                {showDownloadMenu && (
                  <div className="absolute top-full right-0 mt-2 w-36 rounded-xl border shadow-2xl z-50 overflow-hidden bg-zinc-900 border-zinc-800 animate-in slide-in-from-top-2">
                    <button onClick={() => downloadFile('txt')} className="w-full px-4 py-3 text-[10px] font-black uppercase text-left hover:bg-blue-600 text-white transition-all">.TXT Download</button>
                    <button onClick={() => downloadFile('pdf')} className="w-full px-4 py-3 text-[10px] font-black uppercase text-left hover:bg-purple-600 text-white transition-all border-t border-zinc-800">.PDF Download</button>
                  </div>
                )}
              </div>
              <button onClick={() => handleDelete(selectedPost.id)} className="px-4 py-2 rounded-xl text-[11px] font-black bg-red-600/10 text-red-500 border border-red-500/30 flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14}/> 삭제하기</button>
            </div>
          </div>
          
          <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
            {/* 상단 스탯 영역 */}
            <div className="grid grid-cols-4 gap-4 mb-10">
               <div className="p-4 rounded-xl border bg-zinc-900/40 border-zinc-800/50">
                  <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">WP Category</p>
                  <p className="text-[12px] font-bold text-blue-500 truncate">{selectedPost.categories?.[0] || 'Uncategorized'}</p>
               </div>
               <div className="p-4 rounded-xl border bg-zinc-900/40 border-zinc-800/50">
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Author Name</p>
                  <p className="text-[12px] font-bold text-emerald-500 truncate">{selectedPost.user_nickname || userNickname || 'AI Assistant'}</p>
               </div>
               <button className="p-4 bg-blue-600 rounded-xl text-white flex flex-col items-center justify-center gap-1 shadow-xl hover:bg-blue-500 transition-all active:scale-95">
                 <Send size={16} />
                 <span className="text-[10px] font-black uppercase">WP Publish</span>
               </button>
               <button onClick={() => setIsPreviewOpen(true)} className="p-4 bg-purple-600 rounded-xl text-white flex flex-col items-center justify-center gap-1 shadow-xl hover:bg-purple-500 transition-all active:scale-95">
                 <Eye size={16} />
                 <span className="text-[10px] font-black uppercase">Full Preview</span>
               </button>
            </div>

            <div className="max-w-4xl mx-auto text-left">
               {isEditing ? (
                 <input 
                   value={selectedPost.title} 
                   onChange={(e) => setSelectedPost({...selectedPost, title: e.target.value})} 
                   className="w-full text-3xl font-black italic tracking-tighter leading-tight mb-8 bg-transparent border-none focus:outline-none text-white placeholder:text-zinc-700" 
                   placeholder="제목을 입력하세요" 
                 />
               ) : (
                 <h1 className="text-3xl font-black italic tracking-tighter leading-tight mb-8 text-white">{selectedPost.title}</h1>
               )}
               
               {isEditing ? (
                 <textarea 
                    value={selectedPost.content} 
                    onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})} 
                    className="w-full min-h-[1000px] bg-transparent border-none font-mono text-[15px] leading-[2.2] focus:outline-none resize-none text-zinc-300 custom-scrollbar placeholder:text-zinc-700" 
                    placeholder="내용을 입력하세요..."
                 />
               ) : (
                 <div className="markdown-content leading-[2.1] text-zinc-300">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({...props}) => <p className="mb-6 whitespace-pre-wrap" {...props} />,
                        h2: ({...props}) => <h2 className="border-l-8 border-purple-500 pl-6 text-2xl font-black mt-16 mb-8 uppercase italic text-zinc-100 tracking-tight" {...props} />,
                        h3: ({...props}) => <h3 className="text-xl font-bold mt-10 mb-4 text-zinc-100" {...props} />,
                        strong: ({...props}) => <strong className="font-black text-white" {...props} />,
                        table: ({...props}) => (
                          <div className="my-8 w-full overflow-hidden rounded-xl border border-zinc-700 shadow-sm bg-zinc-900/40">
                            <table className="w-full text-sm text-left border-collapse" {...props} />
                          </div>
                        ),
                        thead: ({...props}) => <thead className="bg-zinc-800 border-b border-zinc-700" {...props} />,
                        th: ({...props}) => <th className="px-5 py-4 font-black text-zinc-300 border-r border-zinc-700 last:border-0" {...props} />,
                        td: ({...props}) => <td className="px-5 py-4 border-t border-zinc-800 border-r border-zinc-700 last:border-0" {...props} />,
                      }}
                    >
                      {selectedPost.content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")}
                    </ReactMarkdown>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* [스키마 모달] */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-800/50 flex justify-between items-center bg-violet-600/5">
              <h3 className="text-xl font-black flex items-center gap-2 tracking-tighter italic text-white"><Sparkles className="text-violet-500" size={20} /> AI SCHEMA ENGINE</h3>
              <button onClick={() => setIsSchemaModalOpen(false)} className="text-zinc-500 hover:text-white transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <select value={schemaType} onChange={(e) => setSchemaType(e.target.value)} className="w-full p-4 rounded-2xl border font-bold text-sm bg-zinc-800 border-zinc-700 text-white outline-none focus:border-violet-500 transition-all">
                <option value="AI_AUTO">AI SMART RECOMMEND (AUTO)</option>
                <option value="Article">📄 Article (Blog Posting)</option>
                <option value="FAQ">❓ Q&A (FAQ)</option>
                <option value="Review">⭐ Product Review</option>
                <option value="HowTo">🛠️ Step-by-Step Guide</option>
              </select>
              <button onClick={generateSchemaMarkup} disabled={isGeneratingSchema} className="w-full p-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black mt-6 transition-all flex items-center justify-center gap-2">
                {isGeneratingSchema ? <Loader2 className="animate-spin" size={18} /> : "Generate JSON-LD Schema"}
              </button>
              {tempSchemaCode && <textarea value={tempSchemaCode} readOnly className="w-full h-64 mt-4 p-6 rounded-2xl bg-black border border-emerald-900/20 text-emerald-400 font-mono text-[12px] custom-scrollbar animate-in slide-in-from-top-2" />}
            </div>
            <div className="p-8 border-t border-zinc-800/50 bg-zinc-800/20 flex gap-3">
              <button onClick={() => setIsSchemaModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-all">취소</button>
              <button onClick={applySchemaToContent} className="flex-[2] py-4 rounded-2xl font-black bg-violet-600 hover:bg-violet-500 text-white shadow-xl transition-all">본문에 삽입하기</button>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview 모달 */}
      {isPreviewOpen && selectedPost && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 text-zinc-100 w-full max-w-6xl h-[92vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col relative border border-zinc-800 animate-in zoom-in duration-300">
            <div className="px-10 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <div className="flex items-center gap-6">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF5F57]" /><div className="w-3 h-3 rounded-full bg-[#FFBD2E]" /><div className="w-3 h-3 rounded-full bg-[#28C840]" /></div>
                <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 italic">
                  <Eye size={16}/> Live Preview Mode
                </span>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="text-zinc-500 hover:text-white transition-all active:scale-90"><X size={30} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 lg:p-24 custom-scrollbar bg-zinc-900 text-left">
              <article className="max-w-3xl mx-auto prose prose-invert max-w-none">
                <h1 className="text-5xl font-black mb-16 leading-tight tracking-tighter text-white border-b-8 border-blue-500/10 pb-10 italic">
                  {selectedPost.title}
                </h1>
                <div className="markdown-content leading-[2.1] text-zinc-300 font-medium">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({...props}) => <p className="mb-6 whitespace-pre-wrap font-sans" {...props} />,
                      h2: ({...props}) => <h2 className="border-l-8 border-blue-500 pl-6 text-2xl font-black tracking-tight mt-16 mb-8 text-white uppercase italic font-sans" {...props} />,
                      table: ({...props}) => (<div className="my-10 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"><table className="w-full text-sm text-left border-collapse font-sans" {...props} /></div>),
                      thead: ({...props}) => <thead className="bg-zinc-800 border-b border-zinc-700 font-sans" {...props} />,
                      th: ({...props}) => <th className="px-5 py-4 font-black text-zinc-300 border-r border-zinc-700 last:border-0 font-sans" {...props} />,
                      td: ({...props}) => <td className="px-5 py-4 border-t border-zinc-800 border-r border-zinc-700 last:border-0 font-sans" {...props} />,
                    }}
                  >
                    {selectedPost.content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
            
            <div className="px-10 py-8 border-t border-zinc-800 bg-zinc-950 flex justify-center">
              <button onClick={() => setIsPreviewOpen(false)} className="px-14 py-4 bg-white text-black text-xs font-black rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-[0.3em] active:scale-95 shadow-xl">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}