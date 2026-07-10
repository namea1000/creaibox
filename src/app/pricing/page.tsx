"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Check,
  Lock,
  Sparkles,
  Building2,
  ArrowRight,
  Users
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // 1. 요금제 카드 기본 정보
  const plans = [
    {
      name: "Free Plan",
      desc: "스타터 크리에이터를 위한 기본 창작 체험 플랜",
      priceMonthly: "0원",
      priceYearly: "0원",
      yearlyTotal: "무료 이용",
      badge: "Beta 무료",
      buttonText: "시작하기",
      buttonHref: "/signup",
      highlight: false,
    },
    {
      name: "Creator Plan",
      desc: "블로그, 이미지, 음악 작업을 활발하게 하는 창작자용 플랜",
      priceMonthly: "9,900원",
      priceYearly: "7,900원",
      yearlyTotal: "연 94,800원 (24,000원 절약)",
      badge: "1달 무료",
      buttonText: "시작하기",
      buttonHref: "/signup",
      highlight: false,
    },
    {
      name: "Pro Plan",
      desc: "도메인 연결 및 독립 홈페이지를 활용하는 고급 창작자 플랜",
      priceMonthly: "19,900원",
      priceYearly: "15,900원",
      yearlyTotal: "연 190,800원 (48,000원 절약)",
      badge: "1달 무료 (Best)",
      buttonText: "시작하기",
      buttonHref: "/signup",
      highlight: true,
    },
    {
      name: "Premier Plan",
      desc: "협업 기능 및 무제한 DB 저장을 원하는 전문 에이전시 플랜",
      priceMonthly: "29,900원",
      priceYearly: "23,900원",
      yearlyTotal: "연 286,800원 (72,000원 절약)",
      badge: "1달 무료",
      buttonText: "시작하기",
      buttonHref: "/signup",
      highlight: false,
    }
  ];

  // 2. 상세 요금 비교 데이터셋 (Suno Style)
  const comparisonSections = [
    {
      title: "기본 구성 및 혜택",
      rows: [
        {
          feature: "추천 대상",
          free: "스타터 크리에이터",
          creator: "크리에이터",
          pro: "인플루언서",
          premier: "전문가 및 기업"
        },
        {
          feature: "베타 기간 이용",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "정식 서비스 오픈 후",
          free: "무료 이용",
          creator: "1달 무료 후 결제",
          pro: "1달 무료 후 결제",
          premier: "1달 무료 후 결제"
        },
        {
          feature: "특별 혜택",
          free: "-",
          creator: "-",
          pro: "-",
          premier: "팀원 협업 편집 기능 (최대 3명)"
        },
        {
          feature: "공식 앰버서더 지원",
          free: "제휴 문의 지원(무료 이용)",
          creator: "-",
          pro: "-",
          premier: "-"
        }
      ]
    },
    {
      title: "블로그 & 홈페이지 (웹호스팅 포함)",
      rows: [
        {
          feature: "용도 및 스타일",
          free: "처음 시작하는 개인 크리에이터용",
          creator: "블로그, 이미지, 음악 다작용",
          pro: "독립 도메인 고급 브랜드용",
          premier: "대형 채널 및 멀티 홈페이지용"
        },
        {
          feature: "글쓰기 & SEO 최적화 도구",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "AI 자동 콘텐츠 생성",
          free: "일 5회 API 호출 제한 (개인 API 사용 시 무제한)",
          creator: "무제한 (개인 API 사용 필수)",
          pro: "무제한 (개인 API 사용 필수)",
          premier: "무제한 (개인 API 사용 필수)"
        },
        {
          feature: "AI 썸네일 이미지 제작",
          free: "무제한 (개인 API 사용 필수)",
          creator: "무제한 (개인 API 사용 필수)",
          pro: "무제한 (개인 API 사용 필수)",
          premier: "무제한 (개인 API 사용 필수)"
        },
        {
          feature: "블로그 홈페이지 개설",
          free: "1개 개설 가능 (id.creaibox.com)",
          creator: "2개 개설 가능 (id.creaibox.com)",
          pro: "5개 개설 가능 (id.creaibox.com)",
          premier: "10개 개설 가능 (id.creaibox.com)"
        },
        {
          feature: "개인 독립 도메인 연결",
          free: "L",
          creator: "L",
          pro: "V",
          premier: "V"
        },
        {
          feature: "Premium 디자인 템플릿",
          free: "L",
          creator: "L",
          pro: "V",
          premier: "V"
        },
        {
          feature: "홈페이지 내 광고 정책",
          free: "중앙 광고 노출",
          creator: "광고 없음 (독립 블로그)",
          pro: "광고 없음 (독립 도메인)",
          premier: "광고 없음 (독립 도메인)"
        },
        {
          feature: "상업적 이용 권한",
          free: "L",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "콘텐츠 아이디어 허브",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "콘텐츠 아이디어 기획",
          free: "무제한 (개인 API 사용 필수)",
          creator: "무제한 (개인 API 사용 필수)",
          pro: "무제한 (개인 API 사용 필수)",
          premier: "무제한 (개인 API 사용 필수)"
        },
        {
          feature: "포스트 글 DB 저장",
          free: "최대 1,000개",
          creator: "최대 10,000개",
          pro: "최대 50,000개",
          premier: "최대 100,000개"
        }
      ]
    },
    {
      title: "미디어 라이브러리 (Media Library)",
      rows: [
        {
          feature: "기본 에셋 다운로드",
          free: "무제한",
          creator: "무제한",
          pro: "무제한",
          premier: "무제한"
        },
        {
          feature: "Premium 에셋 이용",
          free: "L",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "개인 스토리지 용량",
          free: "1GB (용량 애드온 가능)",
          creator: "2GB (용량 애드온 가능)",
          pro: "3GB (용량 애드온 가능)",
          premier: "5GB (용량 애드온 가능)"
        }
      ]
    },
    {
      title: "영상 제작 (Video Studio)",
      rows: [
        {
          feature: "비디오 에디터 기본 편집",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "에디터 내 라이브러리 연동",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "쇼츠 & 릴스 자동 제작",
          free: "L",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "유튜브 자동 연동 & 업로드",
          free: "L",
          creator: "V",
          pro: "V",
          premier: "V"
        }
      ]
    },
    {
      title: "디자인 편집 (Design Studio)",
      rows: [
        {
          feature: "디자인 에디터 편집기",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "기본 디자인 템플릿",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "프리미엄 디자인 템플릿",
          free: "L",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "이미지 업스케일러",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "확장자 변환 / 누끼 제거",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "이미지 크기 조절기",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        }
      ]
    },
    {
      title: "음악 & 가사 (Music & Lyrics)",
      rows: [
        {
          feature: "음악 가사 소재 아이디어 허브",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "AI 음악 가사 기획",
          free: "무제한 (개인 API 필수)",
          creator: "무제한 (개인 API 필수)",
          pro: "무제한 (개인 API 필수)",
          premier: "무제한 (개인 API 필수)"
        },
        {
          feature: "스타일 프롬프트 생성",
          free: "무제한 (개인 API 필수)",
          creator: "무제한 (개인 API 필수)",
          pro: "무제한 (개인 API 필수)",
          premier: "무제한 (개인 API 필수)"
        },
        {
          feature: "기획안 및 프롬프트 DB 저장",
          free: "L",
          creator: "최대 10,000개",
          pro: "최대 50,000개",
          premier: "최대 100,000개"
        },
        {
          feature: "CreAibox Music Play",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "음악 파일 다운로드",
          free: "V",
          creator: "무제한 다운로드",
          pro: "무제한 다운로드",
          premier: "무제한 다운로드"
        },
        {
          feature: "음악 상용 이용 권한",
          free: "V (체험권 포함)",
          creator: "상용 이용 가능",
          pro: "상용 이용 가능",
          premier: "상용 이용 가능"
        }
      ]
    },
    {
      title: "분석 & 유틸리티 도구",
      rows: [
        {
          feature: "Cre Note / 해시태그 생성",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "유튜브 / 키워드 트렌드 분석",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "QR 생성 / OCR 문자 추출",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "프롬프트 스튜디오",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "PDF 문서 인공지능 분석",
          free: "V",
          creator: "V",
          pro: "V",
          premier: "V"
        },
        {
          feature: "신규 기능 우선 출시 접근",
          free: "L",
          creator: "V",
          pro: "V",
          premier: "V"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#070913] dark:text-slate-100 transition-colors duration-305 antialiased">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 lg:px-8">
        
        {/* 상단 헤더 섹션 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-900 bg-white dark:bg-violet-950/30 px-4 py-2 text-sm font-black text-violet-600 dark:text-violet-400 shadow-sm">
            <Sparkles size={16} className="animate-pulse" />
            CreAibox Pricing Plans
          </div>

          <h1 className="mt-6 break-keep text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
            창작을 가속화하는
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-700 dark:from-violet-400 dark:via-fuchsia-400 dark:to-indigo-400 bg-clip-text text-transparent">
              최적의 요금제를 만나보세요
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl break-keep text-base font-medium leading-relaxed text-slate-650 dark:text-slate-400">
            개인 크리에이터부터 전문 기업 대행사까지, 작업 스타일과 규모에 맞는 합리적인 요금제를 선택하고 AI 멀티미디어 창작의 가능성을 극대화해 보세요.
          </p>

          {/* 베타 서비스 공지 안내 박스 */}
          <div className="mt-10 mx-auto max-w-4xl rounded-[20px] border border-violet-200/60 bg-gradient-to-r from-violet-50/40 to-fuchsia-50/40 dark:border-violet-900/60 dark:from-violet-950/20 dark:to-fuchsia-950/20 py-4 px-6 md:px-10 flex flex-col md:flex-row items-center justify-center gap-4 shadow-xl">
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="break-keep text-base md:text-lg font-bold text-slate-800 dark:text-slate-200">
                베타 기간 동안 크리에이터분들의 소중한 피드백을 반영하여 요금 정책을 정밀하게 다듬을 예정입니다.
              </p>
              <span className="hidden md:inline text-slate-300 dark:text-slate-700 font-semibold">|</span>
              <p className="break-keep text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">
                정식 서비스 시작과 함께 최종 가격이 확정됩니다.
              </p>
            </div>
          </div>

          {/* 월간/연간 결제 토글 */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer border ${
                billingCycle === "monthly"
                  ? "bg-violet-600 border-violet-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-500 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-full text-sm font-black transition-all cursor-pointer border flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-violet-600 border-violet-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-500 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              연간 결제
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                billingCycle === "yearly"
                  ? "bg-white text-violet-700 dark:bg-[#1f1747] dark:text-violet-300"
                  : "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
              }`}>
                20% 할인
              </span>
            </button>
          </div>
        </div>

        {/* 1. 요금 카드 그리드 */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isPro = plan.highlight;
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={plan.name}
                className={`relative rounded-[28px] border p-8 flex flex-col justify-between transition-all duration-350 hover:-translate-y-1 ${
                  isPro
                    ? "border-violet-450 bg-gradient-to-b from-violet-50/40 via-white to-white dark:border-violet-500 dark:from-slate-900 dark:to-[#120e29]/70 shadow-xl dark:shadow-2xl dark:shadow-violet-950/40"
                    : "border-slate-200 bg-white dark:border-slate-850 dark:bg-slate-950/50 hover:border-slate-350 dark:hover:border-slate-700"
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-md">
                    Popular Plan
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-violet-650 dark:text-violet-400">
                      {plan.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px] break-keep">
                    {plan.desc}
                  </p>

                  <div className="mt-6 flex items-baseline text-slate-900 dark:text-white">
                    <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                    <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">/월</span>
                  </div>

                   {billingCycle === "yearly" && (
                    <p className="mt-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                      {plan.yearlyTotal}
                    </p>
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  {plan.name !== "Free Plan" && (
                    <div className="w-full inline-flex items-center justify-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 rounded-lg py-1.5 px-3 text-[11px] font-bold tracking-tight">
                      <span>🎁</span>
                      <span>1달 무료 사용 후 결제 시작(취소 가능)</span>
                    </div>
                  )}
                  <Link
                    href={plan.buttonHref}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-center inline-block transition-all ${
                      isPro
                        ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-800/20"
                        : "bg-slate-150 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-850 dark:text-white dark:border-slate-800"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. 상세 요금 비교 섹션 (Suno Style Feature Matrix) */}
        <div className="mt-28">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white md:text-3xl tracking-tight">
              Compare CreAibox plans
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              세부적인 기능별 지원 범위와 용량을 한눈에 비교해 보세요.
            </p>
          </div>

          {/* 테이블 컨테이너 */}
          <div className="overflow-x-auto rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/20 backdrop-blur-sm shadow-sm">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm border border-slate-250 dark:border-slate-850">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0c0f1d] text-slate-650 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-5 px-6 font-bold text-slate-800 dark:text-slate-200 border border-slate-250 dark:border-slate-850">기능 및 서비스 범위</th>
                  <th className="py-5 px-5 text-center w-[18%] border border-slate-250 dark:border-slate-850">Free Plan</th>
                  <th className="py-5 px-5 text-center w-[18%] border border-slate-250 dark:border-slate-850">Creator Plan</th>
                  <th className="py-5 px-5 text-center w-[18%] text-violet-750 dark:text-violet-400 font-bold bg-violet-50/50 dark:bg-violet-950/10 border border-slate-250 dark:border-slate-850">Pro Plan (Best)</th>
                  <th className="py-5 px-5 text-center w-[18%] border border-slate-250 dark:border-slate-850">Premier Plan</th>
                </tr>
              </thead>
              <tbody>
                {comparisonSections.map((section, sIdx) => (
                  <React.Fragment key={sIdx}>
                    {/* 카테고리 헤더 로우 */}
                    <tr className="bg-slate-100/70 dark:bg-slate-950/60">
                      <td colSpan={5} className="py-4.5 px-6 text-xs font-extrabold text-violet-650 dark:text-violet-400 tracking-widest uppercase text-center border border-slate-250 dark:border-slate-850">
                        {section.title}
                      </td>
                    </tr>

                    {/* 세부 기능별 로우 */}
                    {section.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="py-4.5 px-6 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-900">
                          {row.feature}
                        </td>
                        
                        {/* Free Plan */}
                        <td className="py-4.5 px-5 text-center text-xs text-slate-550 dark:text-slate-400 border border-slate-200 dark:border-slate-900">
                          {row.free === "V" ? (
                            <Check className="mx-auto text-violet-600 dark:text-violet-400" size={17} />
                          ) : row.free === "L" ? (
                            <Lock className="mx-auto text-slate-400 dark:text-slate-650" size={14} />
                          ) : (
                            row.free
                          )}
                        </td>

                        {/* Creator Plan */}
                        <td className="py-4.5 px-5 text-center text-xs text-slate-550 dark:text-slate-400 border border-slate-200 dark:border-slate-900">
                          {row.creator === "V" ? (
                            <Check className="mx-auto text-violet-600 dark:text-violet-400" size={17} />
                          ) : row.creator === "L" ? (
                            <Lock className="mx-auto text-slate-400 dark:text-slate-650" size={14} />
                          ) : (
                            row.creator
                          )}
                        </td>

                        {/* Pro Plan (Best) */}
                        <td className="py-4.5 px-5 text-center text-xs text-slate-700 dark:text-slate-300 bg-violet-50/20 dark:bg-violet-950/5 font-semibold border border-slate-200 dark:border-slate-900">
                          {row.pro === "V" ? (
                            <Check className="mx-auto text-violet-650 dark:text-violet-400 font-bold" size={17} />
                          ) : row.pro === "L" ? (
                            <Lock className="mx-auto text-slate-400 dark:text-slate-650" size={14} />
                          ) : (
                            row.pro
                          )}
                        </td>

                        {/* Premier Plan */}
                        <td className="py-4.5 px-5 text-center text-xs text-slate-550 dark:text-slate-400 border border-slate-200 dark:border-slate-900">
                          {row.premier === "V" ? (
                            <Check className="mx-auto text-violet-600 dark:text-violet-400" size={17} />
                          ) : row.premier === "L" ? (
                            <Lock className="mx-auto text-slate-400 dark:text-slate-650" size={14} />
                          ) : (
                            row.premier
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Business 및 제휴 제안 카드 */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* Business 플랜 카드 */}
          <div className="p-8 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 to-white dark:border-slate-850 dark:from-slate-950/60 dark:to-slate-900/60 flex flex-col justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Business 맞춤형 플랜</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">팀, 기업, 대행사를 위한 전용 플랜</p>
              </div>
            </div>
            <p className="break-keep text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              기업형 커스텀 개발, 대형 워크플로우 관리, 팀 단체 계정 추가 혜택과 프리미엄 1:1 테크니컬 서포트를 개별 조건 조율을 통해 최적으로 구축해 드립니다.
            </p>
            <div>
              <Link
                href="/business/enterprise"
                className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 transition"
              >
                금액 및 조건 개별 협의하기
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* 광고 / 협업 제안 카드 */}
          <div className="p-8 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 to-white dark:border-slate-850 dark:from-slate-950/60 dark:to-slate-900/60 flex flex-col justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-400">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">광고 및 협업 / 제휴 제안</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">CreAibox 크리에이터 생태계 참여</p>
              </div>
            </div>
            <p className="break-keep text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              공식 제휴 광고주 등록, 크리에이터 제휴 펀드 지원, 플랫폼 내 제휴 연동 등 크리에이터 생태계 활성화를 위한 마케팅 및 브랜드 협업을 제안해 주세요.
            </p>
            <div>
              <Link
                href="/business/ads"
                className="inline-flex items-center gap-1.5 text-xs font-black text-fuchsia-650 dark:text-fuchsia-400 hover:text-fuchsia-500 transition"
              >
                협업 / 파트너 제휴 문의 접수
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. 환불 정책 안내 풋노트 */}
        <div className="mt-16 text-center">
          <Link href="/refund-policy" className="inline-flex">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white dark:border-slate-900 dark:bg-slate-950/30 px-6 py-4.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-violet-900 hover:text-violet-400 transition shadow-lg cursor-pointer">
              <span>구매 및 환불에 대한 상세 기준은</span>
              <span className="text-violet-650 dark:text-violet-400 font-extrabold underline decoration-2">환불 정책 규정</span>
              <span>에서 확인하실 수 있습니다.</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}