"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, Trash2, Edit3, Eye, 
  Share2, Mail, Download, ChevronRight, 
  Filter, Calendar, MoreVertical, LayoutGrid, List,
  Type, AlignLeft, MessageSquare, Copy, Send, ChevronDown, Loader2, X, Settings, Save, FileDown
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
        
        // 🌟 [수정] ReactDOMServer 없이 수동으로 마크다운 표를 HTML 테이블로 변환
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
            <h1 style="font-size: 30px; font-weight: 900; color: #000; border-bottom: 6px solid #f3e8ff; padding-bottom: 15px; margin-bottom: 30px; font-style: italic;">
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
        };

        html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error("PDF 에러:", err);
        alert("PDF 라이브러리를 로딩할 수 없습니다. 터미널에서 npm install html2pdf.js 를 실행했는지 확인해주세요.");
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
        <div className={`w-[65%] h-full flex flex-col animate-in slide-in-from-right duration-500 ${isDarkMode ? 'bg-[#0d1117]' : 'bg-white shadow-2xl'}`}>
          <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#0a0c10] border-zinc-800/50' : 'bg-zinc-50 border-zinc-200'}`}>
            <button onClick={() => setSelectedPost(null)} className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ${subTextColor} hover:text-blue-500 transition-all`}>
              <ChevronRight className="rotate-180" size={16}/> Back to List
            </button>
            
            <div className="flex gap-2 relative">
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

              <button className="px-4 py-2 rounded-xl text-[11px] font-black bg-zinc-600/10 text-zinc-500 border border-zinc-500/30 flex items-center gap-2 hover:bg-zinc-800 hover:text-white transition-all">
                <Settings size={14} /> WP Setting
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar font-sans">
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
                 <textarea value={selectedPost.content} onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})} className={`w-full min-h-[60vh] bg-transparent border-none font-mono text-[15px] leading-[2.2] focus:outline-none resize-none ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} />
               ) : (
                 <div className={`prose prose-invert max-w-none text-[15px] leading-[2.0] ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <pre className="whitespace-pre-wrap font-sans">{selectedPost.content}</pre>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Full Preview 모달 */}
      {isPreviewOpen && selectedPost && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-sans">
          <div className="bg-white text-zinc-900 w-full max-w-6xl h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col relative animate-in zoom-in duration-300 font-sans">
            <div className="px-10 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/80 font-sans">
              <span className="text-[11px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-2 font-sans">
                <Eye size={16}/> WordPress Live Preview Mode
              </span>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-zinc-200 rounded-full transition-all active:scale-90 font-sans"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 lg:p-20 bg-white custom-scrollbar text-left font-sans">
              <article className="max-w-3xl mx-auto font-sans">
                <h1 className="text-4xl font-black mb-12 leading-tight tracking-tighter italic border-b-8 border-purple-500/10 pb-8 font-sans">{selectedPost.title}</h1>
                <div className="markdown-content leading-[2.1] text-zinc-800 font-medium font-sans">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    table: ({node, ...props}) => (<div className="my-8 w-full overflow-hidden rounded-xl border border-zinc-200 shadow-sm"><table className="w-full text-sm text-left border-collapse" {...props} /></div>),
                    thead: ({node, ...props}) => <thead className="bg-zinc-50 border-b border-zinc-200" {...props} />,
                    th: ({node, ...props}) => <th className="px-5 py-4 font-black text-zinc-700 border-r border-zinc-200 last:border-0" {...props} />,
                    td: ({node, ...props}) => <td className="px-5 py-4 border-t border-zinc-100 border-r border-zinc-200 last:border-0" {...props} />,
                    h2: ({node, ...props}) => <h2 className="border-l-8 border-purple-500 pl-6 text-2xl font-black mt-16 mb-8 uppercase italic font-sans" {...props} />,
                    p: ({node, ...props}) => <p className="mb-6 font-sans" {...props} />,
                  }}>
                    {selectedPost.content}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}