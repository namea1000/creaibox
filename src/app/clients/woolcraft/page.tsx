"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import {
  ShoppingBag,
  Sparkles,
  Eye,
  Check,
  ArrowRight,
  ShieldCheck,
  Globe,
  Leaf,
  Thermometer,
  Droplets,
  RotateCcw,
  Star,
  Plus,
  Minus,
  X,
  Zap,
  Mail,
  Heart,
  MessageSquare,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  color: string;
  priceUsd: number;
  priceKrw: number;
  image: string;
  description: string;
  sizes: number[];
  tag?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Merino Classic",
    color: "Oat (오트)",
    priceUsd: 165,
    priceKrw: 219000,
    image: "/images/woolcraft/hero_sneakers.png",
    description: "100% 프리미엄 초미세 메리노 울로 제작된 시그니처 베이직 스니커즈. 구름 위를 걷는 듯한 가벼움과 사계절 온도 조절 기능을 제공합니다.",
    sizes: [230, 240, 250, 260, 270, 280],
    tag: "BEST SELLER",
  },
  {
    id: 2,
    name: "Merino Classic",
    color: "Fog Gray (안개 회색)",
    priceUsd: 165,
    priceKrw: 219000,
    image: "/images/woolcraft/hero_sneakers.png",
    description: "도회적인 세련미를 더한 포그 그레이 톤의 웰니스 메리노 스니커즈. 발 형태에 맞춰 유연하게 수축하고 확장합니다.",
    sizes: [230, 240, 250, 260, 270],
  },
  {
    id: 3,
    name: "Cashmere Luxe",
    color: "Taupe (토프)",
    priceUsd: 285,
    priceKrw: 379000,
    image: "/images/woolcraft/hero_sneakers.png",
    description: "최고급 캐시미어 울을 블렌딩하여 비단 같은 터치감과 극강의 안락함을 선사하는 하이엔드 럭셔리 스니커즈.",
    sizes: [240, 250, 260, 270, 280],
    tag: "LUXURY",
  },
  {
    id: 4,
    name: "Urban Runner",
    color: "Charcoal (숯 차콜)",
    priceUsd: 185,
    priceKrw: 245000,
    image: "/images/woolcraft/urban_runner.png",
    description: "도시의 오프로드와 데일리 러닝을 위해 쿠셔닝을 강화한 하이퍼 퍼포먼스 울 러닝화.",
    sizes: [250, 260, 270, 280, 290],
    tag: "NEW RELEASE",
  },
  {
    id: 5,
    name: "City Walker",
    color: "Midnight (미드나잇)",
    priceUsd: 155,
    priceKrw: 205000,
    image: "/images/woolcraft/urban_runner.png",
    description: "어두운 미드나잇 딥 톤의 스티치 디테일이 돋보이는 모던 시티 워킹 스니커즈.",
    sizes: [230, 240, 250, 260, 270],
  },
  {
    id: 6,
    name: "Weekend Slip-On",
    color: "Sand (모래 샌드)",
    priceUsd: 145,
    priceKrw: 192000,
    image: "/images/woolcraft/hero_sneakers.png",
    description: "신발끈 없이 간편하게 쓱 신는 주말 힐링 슬립온. 사계절 통기성이 뛰어난 천연 울 충전재 적용.",
    sizes: [230, 240, 250, 260, 270, 280],
  },
];

interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

export default function WoolCraftPage() {
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [selectedSizeMap, setSelectedSizeMap] = useState<Record<number, number>>({
    1: 260,
    2: 260,
    3: 260,
    4: 270,
    5: 260,
    6: 250,
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<string>("");

  const handleAddToCart = (product: Product, size?: number) => {
    const chosenSize = size || selectedSizeMap[product.id] || product.sizes[0];
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === chosenSize);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === chosenSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size: chosenSize, quantity: 1 }];
    });

    setAddedToast(`장바구니에 담겼습니다: ${product.name} (${chosenSize}mm)`);
    setTimeout(() => setAddedToast(""), 3000);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.product.priceKrw * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FEFCF8] text-[#2C2C2C]">
      {/* Header Container */}
      <Header cartCount={totalCartCount} onOpenCart={() => setCartDrawerOpen(true)} />

      {/* Added Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#2C2C2C] text-white px-5 py-3.5 text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-bounce border border-[#444]">
          <Check size={16} className="text-[#A8B5A0]" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FEFCF8] via-[#F5F1E8] to-[#E8E5E0] border-b border-[#E8E5E0]">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/woolcraft/hero_sneakers.png"
            alt="WoolCraft Hero Background"
            fill
            className="object-cover object-center filter blur-[2px]"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#A8B5A0]/20 border border-[#A8B5A0]/40 px-4 py-1.5 text-xs font-black text-[#5C6B53] backdrop-blur-md">
            <Leaf size={14} className="text-[#A8B5A0]" /> 100% NATURAL MERINO & CASHMERE SNEAKERS
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#2C2C2C] font-light leading-tight tracking-tight">
            Natural Wool Meets <br />
            <span className="font-normal italic text-[#A8B5A0]">Urban Functionality</span>
          </h1>

          <p className="text-base sm:text-lg text-[#666] font-light max-w-2xl mx-auto leading-relaxed">
            자연이 선사하는 최고의 울 소재와 도심 속 기능성의 완벽한 조화. <br className="hidden sm:inline" />
            타협 없는 편안함, 지속 가능한 지구, 그리고 감성적인 디자인을 직접 만나보세요.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-[#A8B5A0] hover:bg-[#96a388] text-white px-8 py-4 text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-[#A8B5A0]/20 hover:-translate-y-0.5"
            >
              Explore Collection <ArrowRight size={14} />
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md border border-[#E8E5E0] text-[#2C2C2C] hover:bg-white px-7 py-4 text-xs font-bold transition-all shadow-sm"
            >
              Brand Story <Leaf size={14} className="text-[#A8B5A0]" />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS COLLECTION GRID */}
      <section id="products" className="py-20 bg-[#FEFCF8] border-b border-[#E8E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#A8B5A0]">NEW ARRIVALS</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2C2C2C] font-light">Featured Collection</h2>
            <p className="text-xs text-[#777] font-medium">자연에서 온 천연 메리노 울 스니커즈 베스트 컬렉션</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="group rounded-3xl bg-white border border-[#E8E5E0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image Box */}
                <div className="relative aspect-square overflow-hidden bg-[#F5F1E8]">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.tag && (
                    <span className="absolute top-4 left-4 rounded-full bg-[#2C2C2C] text-white text-[10px] font-black px-3 py-1 tracking-wider uppercase">
                      {prod.tag}
                    </span>
                  )}

                  {/* Quick View Hover Overlay */}
                  <div className="absolute inset-0 bg-[#A8B5A0]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <button
                      onClick={() => setSelectedProductModal(prod)}
                      className="rounded-full bg-white text-[#2C2C2C] hover:bg-[#F5F1E8] px-6 py-3 text-xs font-black tracking-wider transition-all shadow-lg hover:scale-105 flex items-center gap-1.5"
                    >
                      <Eye size={14} /> Quick View (상세보기)
                    </button>
                  </div>
                </div>

                {/* Product Details & Purchase Controls */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-serif text-[#2C2C2C] font-normal">{prod.name}</h3>
                    <p className="text-xs text-[#777] font-medium">{prod.color}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-[#A8B5A0]">
                      ₩{prod.priceKrw.toLocaleString()} <span className="text-xs text-[#999] font-normal">(${prod.priceUsd})</span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      무료배송
                    </span>
                  </div>

                  {/* Size Selector & Add to Cart Action */}
                  <div className="pt-2 flex items-center gap-2">
                    <select
                      value={selectedSizeMap[prod.id]}
                      onChange={(e) => setSelectedSizeMap({ ...selectedSizeMap, [prod.id]: Number(e.target.value) })}
                      className="rounded-xl border border-[#E8E5E0] bg-[#FEFCF8] px-3 py-2 text-xs font-bold text-[#2C2C2C] focus:border-[#A8B5A0] focus:outline-none"
                    >
                      {prod.sizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz} mm
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="flex-1 rounded-xl bg-[#A8B5A0] hover:bg-[#96a388] text-white py-2.5 text-xs font-black tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY & BENEFIT CARDS */}
      <section id="story" className="py-20 bg-gradient-to-b from-[#F5F1E8] to-[#E8E5E0] border-b border-[#E8E5E0]">
        <div id="benefits" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#A8B5A0]">OUR PHILOSOPHY</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#2C2C2C] font-light leading-tight">
              Crafted for Comfort, <br className="hidden sm:inline" />
              Designed for Life
            </h2>
            <p className="text-sm text-[#555] font-medium leading-relaxed">
              Aura Merino(아우라 메리노)는 인공 합성 소재 대신 천연 메리노 울이 가진 기적 같은 특성에 주목했습니다. <br />
              윤리적 농가에서 채취한 최고 등급 미세 울 입자가 발을 감싸안아 365일 언제나 쾌적한 보온성과 통기성을 약속합니다.
            </p>
          </div>

          {/* 4 Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="rounded-2xl bg-white p-6 text-center space-y-3 shadow-md hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#A8B5A0]/20 text-[#5C6B53] flex items-center justify-center mx-auto text-xl">
                <Thermometer size={22} />
              </div>
              <h3 className="font-serif text-lg text-[#2C2C2C] font-normal">Temperature Regulating</h3>
              <p className="text-xs text-[#777] font-medium leading-relaxed">
                천연 울 섬유가 체온을 스스로 감지하여 겨울에는 따뜻하게, 여름에는 시원하게 체온을 유지합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center space-y-3 shadow-md hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#A8B5A0]/20 text-[#5C6B53] flex items-center justify-center mx-auto text-xl">
                <Droplets size={22} />
              </div>
              <h3 className="font-serif text-lg text-[#2C2C2C] font-normal">Moisture Wicking</h3>
              <p className="text-xs text-[#777] font-medium leading-relaxed">
                땀과 수분을 겉면으로 빠르게 배출하여 습기 없이 24시간 내내 뽀송뽀송함을 전달합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center space-y-3 shadow-md hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#A8B5A0]/20 text-[#5C6B53] flex items-center justify-center mx-auto text-xl">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-serif text-lg text-[#2C2C2C] font-normal">Odor Resistant</h3>
              <p className="text-xs text-[#777] font-medium leading-relaxed">
                울 고유의 항균 작용으로 오랜 시간 착용해도 발냄새 걱정 없이 청결한 상태를 자율 유지합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center space-y-3 shadow-md hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-full bg-[#A8B5A0]/20 text-[#5C6B53] flex items-center justify-center mx-auto text-xl">
                <Leaf size={22} />
              </div>
              <h3 className="font-serif text-lg text-[#2C2C2C] font-normal">100% Sustainable</h3>
              <p className="text-xs text-[#777] font-medium leading-relaxed">
                100% 재생 가능하고 생분해되는 생태 친화적 농가 재료만을 엄선하여 플라스틱 폐기물을 방지합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG INSIGHTS & DOFOLLOW SEO SECTION */}
      <section id="blog" className="py-16 bg-[#FEFCF8] border-b border-[#E8E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between border-b border-[#E8E5E0] pb-4">
            <div>
              <span className="text-xs font-black uppercase text-[#A8B5A0] tracking-wider">ECO INSIGHTS BLOG</span>
              <h2 className="text-2xl font-serif text-[#2C2C2C]">Aura Merino 트렌드 & 칼럼</h2>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Zap size={13} /> DoFollow SEO Ready</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#E8E5E0] bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-black text-[#A8B5A0] uppercase bg-[#A8B5A0]/10 px-2.5 py-0.5 rounded-full">지속가능성</span>
              <h3 className="text-base font-serif text-[#2C2C2C] font-semibold">2026 친환경 패션 소재로 메리노 울이 주목받는 이유</h3>
              <p className="text-xs text-[#666] line-clamp-2">미세 플라스틱을 유발하는 화학 섬유 대신 100% 생분해되는 울 스니커즈가 글로벌 패션계를 뒤흔들고 있습니다.</p>
              <span className="text-xs font-bold text-[#A8B5A0] block pt-2">읽기 →</span>
            </div>

            <div className="rounded-2xl border border-[#E8E5E0] bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-black text-[#A8B5A0] uppercase bg-[#A8B5A0]/10 px-2.5 py-0.5 rounded-full">스타일 가이드</span>
              <h3 className="text-base font-serif text-[#2C2C2C] font-semibold">오트 앤 차콜: 원마일웨어에 어울리는 최상의 컬러 매칭</h3>
              <p className="text-xs text-[#666] line-clamp-2">자연스러운 얼스 톤(Earth Tones)을 활용한 데일리 룩 코디네이션 스타일북을 제안합니다.</p>
              <span className="text-xs font-bold text-[#A8B5A0] block pt-2">읽기 →</span>
            </div>

            <div className="rounded-2xl border border-[#E8E5E0] bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
              <span className="text-[10px] font-black text-[#A8B5A0] uppercase bg-[#A8B5A0]/10 px-2.5 py-0.5 rounded-full">케어 팁</span>
              <h3 className="text-base font-serif text-[#2C2C2C] font-semibold">울 스니커즈 세탁 및 평생 관리 가이드라인</h3>
              <p className="text-xs text-[#666] line-clamp-2">세탁기 울 코스로 간편하게 세탁하는 노하우와 수명을 3배 끌어올리는 관리 팁을 전해드립니다.</p>
              <span className="text-xs font-bold text-[#A8B5A0] block pt-2">읽기 →</span>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-16 bg-[#2C2C2C] text-[#F5F1E8]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-light">Stay Connected with Aura Merino</h2>
          <p className="text-xs sm:text-sm text-[#AAA] font-light">
            뉴스레터를 구독하시고 신상품 출시 소식과 회원 전용 15% 할인 쿠폰 혜택을 받아보세요.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert("뉴스레터 구독 신청이 완료되었습니다!"); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="내 이메일 주소 입력..."
              className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-xs font-bold text-white placeholder-[#888] focus:border-[#A8B5A0] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#A8B5A0] hover:bg-[#96a388] text-white px-6 py-3 text-xs font-black tracking-wide transition-all shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* QUICK VIEW PRODUCT MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl space-y-0 flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 aspect-square bg-[#F5F1E8]">
              <Image src={selectedProductModal.image} alt={selectedProductModal.name} fill className="object-cover" />
            </div>

            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#A8B5A0] bg-[#A8B5A0]/10 px-2.5 py-0.5 rounded-full uppercase">
                    QUICK VIEW
                  </span>
                  <button onClick={() => setSelectedProductModal(null)} className="p-1 text-[#888] hover:text-[#2C2C2C]">
                    <X size={18} />
                  </button>
                </div>

                <h3 className="text-2xl font-serif text-[#2C2C2C]">{selectedProductModal.name}</h3>
                <p className="text-xs text-[#777]">{selectedProductModal.color}</p>
                <p className="text-xl font-black text-[#A8B5A0]">₩{selectedProductModal.priceKrw.toLocaleString()}</p>
                <p className="text-xs text-[#555] font-medium leading-relaxed">{selectedProductModal.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C2C2C]">사이즈 선택 (mm)</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProductModal.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSizeMap({ ...selectedSizeMap, [selectedProductModal.id]: sz })}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          selectedSizeMap[selectedProductModal.id] === sz
                            ? "border-[#A8B5A0] bg-[#A8B5A0] text-white"
                            : "border-[#E8E5E0] bg-[#FEFCF8] text-[#2C2C2C]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(selectedProductModal);
                    setSelectedProductModal(null);
                  }}
                  className="w-full rounded-xl bg-[#A8B5A0] hover:bg-[#96a388] text-white py-3 text-xs font-black tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={14} /> 장바구니에 담기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER / MODAL */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full flex flex-col justify-between p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E5E0] pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#A8B5A0]" />
                  <h3 className="text-lg font-serif text-[#2C2C2C] font-bold">장바구니 ({totalCartCount})</h3>
                </div>
                <button onClick={() => setCartDrawerOpen(false)} className="p-1 text-[#888] hover:text-[#2C2C2C]">
                  <X size={20} />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-[#888] space-y-2">
                  <ShoppingBag size={40} className="mx-auto text-[#CCC]" />
                  <p className="text-sm font-bold">장바구니가 비어있습니다.</p>
                  <p className="text-xs">마음에 드는 메리노 울 스니커즈를 담아보세요!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-[#E8E5E0] bg-[#FEFCF8]">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F5F1E8] shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#2C2C2C] truncate">{item.product.name}</h4>
                        <p className="text-[11px] text-[#777]">{item.product.color} / {item.size}mm</p>
                        <p className="text-xs font-black text-[#A8B5A0]">₩{item.product.priceKrw.toLocaleString()} x {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => setCartItems(cartItems.filter((_, i) => i !== idx))}
                        className="p-1 text-[#AAA] hover:text-rose-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-[#E8E5E0] space-y-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>총 결제금액</span>
                  <span className="text-lg font-black text-[#A8B5A0]">₩{totalCartPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => alert("주문 시뮬레이션 완료! 바로 구매 페이지로 이동합니다.")}
                  className="w-full rounded-2xl bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white py-3.5 text-xs font-black tracking-wider uppercase transition-all shadow-xl"
                >
                  주문 결제하기 (Checkout)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
