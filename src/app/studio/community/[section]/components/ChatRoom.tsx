"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  PenTool,
  Newspaper,
  Music,
  Image as ImageIcon,
  Video,
  PlayCircle,
  Bot,
  Share2,
  BadgeDollarSign,
  Send,
  Users,
  Search,
  Smile,
  Paperclip,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { channels, mockCreators, initialMessages, botReplies } from "../lib/chat-data";
import { Message, Creator } from "../lib/types";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  MessageCircle,
  PenTool,
  Newspaper,
  Music,
  ImageIcon,
  Video,
  PlayCircle,
  Bot,
  Share2,
  BadgeDollarSign,
};

interface ChatRoomProps {
  section: string;
}

export default function ChatRoom({ section }: ChatRoomProps) {
  const router = useRouter();
  const activeSection = section || "chat";
  
  // States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on channel change
  useEffect(() => {
    setMessages(initialMessages[activeSection] || initialMessages["chat"] || []);
    setIsTyping(false);
    setTypingUser("");
  }, [activeSection]);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const activeChannel = channels.find((c) => c.id === activeSection) || channels[0];
  const activeCreators = mockCreators[activeSection] || mockCreators["chat"] || [];
  const currentReplies = botReplies[activeSection] || botReplies["chat"] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "나 (크리에이터)",
      avatarColor: "bg-gradient-to-br from-pink-500 to-rose-600",
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    const sentText = inputText;
    setInputText("");

    // Simulate community response after 1.5 seconds
    if (activeCreators.length > 0 && currentReplies.length > 0) {
      const randomCreatorIndex = Math.floor(Math.random() * activeCreators.length);
      const responder = activeCreators[randomCreatorIndex];
      
      setIsTyping(true);
      setTypingUser(responder.name);

      setTimeout(() => {
        setIsTyping(false);
        const replyIndex = Math.floor(Math.random() * currentReplies.length);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: responder.name,
          avatarColor: responder.avatarColor,
          content: currentReplies[replyIndex],
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
          isUser: false,
          badge: responder.role,
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 1500);
    }
  };

  const filteredChannels = channels.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ActiveIcon = iconMap[activeChannel.icon] || MessageCircle;

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-[#06080d] text-zinc-100">
      {/* Left Sidebar: Channels */}
      <aside className="hidden w-80 shrink-0 flex-col border-r border-zinc-800 bg-[#090d16] md:flex">
        {/* Search Header */}
        <div className="p-4 border-b border-zinc-800/80">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="대화방 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
          <div className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            주제별 채널 ({filteredChannels.length})
          </div>
          {filteredChannels.map((chan) => {
            const ChanIcon = iconMap[chan.icon] || MessageCircle;
            const isActive = chan.id === activeSection;

            return (
              <Link
                key={chan.id}
                href={`/studio/community/${chan.id}`}
                className={`flex items-center justify-between rounded-xl px-3 py-3 transition ${
                  isActive
                    ? "bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 text-white shadow-md shadow-black/40"
                    : "hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${
                      chan.color
                    } text-white ${isActive ? "shadow-inner scale-95" : ""}`}
                  >
                    <ChanIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? "text-pink-400" : ""}`}>
                      {chan.title}
                    </p>
                    <p className="text-[11px] font-medium text-zinc-500 truncate leading-tight">
                      {chan.desc}
                    </p>
                  </div>
                </div>
                {chan.unreadCount ? (
                  <span className={`h-2 w-2 rounded-full ${chan.badgeColor} animate-pulse`} />
                ) : (
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-zinc-600 transition" />
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Content */}
      <section className="flex flex-1 flex-col bg-[#06080d]/80 backdrop-blur-sm relative">
        {/* Chat Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800/80 px-6">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${activeChannel.color} text-white shadow-lg`}>
              <ActiveIcon size={20} />
            </div>
            <div>
              <h1 className="text-base font-black text-white flex items-center gap-1.5">
                {activeChannel.title}
                <span className="text-[11px] font-bold text-zinc-500 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                  실시간
                </span>
              </h1>
              <p className="text-xs font-semibold text-zinc-500">{activeChannel.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-zinc-400" />
            <span className="text-sm font-bold text-zinc-300">
              {activeCreators.length + 1}명 접속 중
            </span>
          </div>
        </header>

        {/* Message View Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 bg-gradient-to-b from-[#080b12] to-[#06080d]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-[85%] ${
                msg.isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ${
                  msg.avatarColor
                }`}
              >
                {msg.sender.substring(0, 2)}
              </div>

              {/* Message Details */}
              <div className="space-y-1">
                <div className={`flex items-center gap-2 ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <span className="text-xs font-bold text-zinc-300">{msg.sender}</span>
                  {msg.badge && (
                    <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/20">
                      {msg.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-medium text-zinc-500">{msg.timestamp}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed border ${
                    msg.isUser
                      ? "bg-pink-600/90 border-pink-500/30 text-white rounded-tr-none shadow-md shadow-pink-900/10"
                      : "bg-zinc-900/80 border-zinc-800/80 text-zinc-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3.5 max-w-[80%] mr-auto animate-pulse">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                {typingUser.substring(0, 2)}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-500">{typingUser}</span>
                <div className="rounded-2xl rounded-tl-none bg-zinc-900/50 border border-zinc-800/50 px-4 py-2.5 text-sm text-zinc-500 flex items-center gap-1">
                  <span>작성 중</span>
                  <span className="inline-flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce"></span>
                    <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 rounded-full bg-zinc-500 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#090d16]">
          <form onSubmit={handleSendMessage} className="flex gap-2.5">
            <div className="flex-1 relative flex items-center bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 focus-within:border-pink-500/50 focus-within:ring-1 focus-within:ring-pink-500/30 transition">
              <button
                type="button"
                className="text-zinc-500 hover:text-zinc-300 p-1.5 hover:bg-zinc-900 rounded-lg transition"
                title="파일 첨부"
              >
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-transparent border-0 py-3 px-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none"
              />
              <button
                type="button"
                className="text-zinc-500 hover:text-zinc-300 p-1.5 hover:bg-zinc-900 rounded-lg transition"
                title="이모지"
              >
                <Smile size={18} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-white transition hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0 shadow-lg shadow-pink-900/10"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Right Sidebar: Active Creators list & Channel rules */}
      <aside className="hidden w-64 shrink-0 flex-col border-l border-zinc-800 bg-[#090d16] xl:flex">
        {/* Active Members list */}
        <div className="p-5 border-b border-zinc-800/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-1.5">
            <Users size={13} />
            접속 중인 크리에이터 ({activeCreators.length})
          </h2>
          <div className="space-y-3">
            {activeCreators.map((creator) => (
              <div key={creator.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${creator.avatarColor}`}>
                      {creator.name.substring(0, 2)}
                    </div>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#090d16]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{creator.name}</p>
                    <p className="text-[10px] font-semibold text-zinc-500">{creator.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                  활동중
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Guideline Panel */}
        <div className="flex-1 p-5 space-y-4">
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 space-y-3.5">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-pink-400" />
              오늘의 채널 팁
            </h3>
            <p className="text-[11px] leading-relaxed text-zinc-400 font-medium">
              이곳은{" "}
              <span className="text-pink-400 font-bold">{activeChannel.title}</span> 관련
              자유 대화방입니다. 유용한 프롬프트, 꿀팁, 노하우를 공유해 보세요.
            </p>
            <p className="text-[10px] leading-normal text-zinc-500 font-medium border-t border-zinc-800/60 pt-2.5">
              상대방을 존중하는 클린한 대화 문화를 함께 만들어 나갑시다.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
