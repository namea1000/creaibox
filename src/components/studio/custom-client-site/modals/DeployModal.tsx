import React, { useState } from "react";
import { Zap, CheckCircle2, Globe, RefreshCw } from "lucide-react";
import { CustomTemplate } from "@/constants/custom-client-site";

interface DeployModalProps {
  deployModalTemplate: CustomTemplate | null;
  setDeployModalTemplate: (tpl: CustomTemplate | null) => void;
  deploySiteName: string;
  setDeploySiteName: (name: string) => void;
  deploySubdomain: string;
  setDeploySubdomain: (subdomain: string) => void;
  deploySuccess: boolean;
  setDeploySuccess: (success: boolean) => void;
  setActiveTab: (tab: "marketplace" | "migration" | "manage" | "request" | "admin_dashboard") => void;
}

export default function DeployModal({
  deployModalTemplate,
  setDeployModalTemplate,
  deploySiteName,
  setDeploySiteName,
  deploySubdomain,
  setDeploySubdomain,
  deploySuccess,
  setDeploySuccess,
  setActiveTab,
}: DeployModalProps) {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  if (!deployModalTemplate) return null;

  const handleConfirmDeploy = async () => {
    if (!deploySiteName || !deploySubdomain) return;
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
    }, 1500);
  };

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Zap className="text-cyan-400" size={20} />
                <h3 className="text-lg font-black text-white">1초 템플릿 즉시 구축</h3>
              </div>
              <button
                onClick={() => setDeployModalTemplate(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                닫기
              </button>
            </div>

            {deploySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-black text-white">
                  축하합니다! 홈페이지 구축이 완료되었습니다! 🎉
                </h4>
                <p className="text-xs font-medium text-slate-300">
                  선택하신 <strong className="text-cyan-400">{deployModalTemplate.name}</strong> 기반으로 내 신규 사이트가 정상 개설되었습니다.
                </p>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <a
                    href="https://sotongchaeum.creaibox.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-2xl bg-cyan-500 px-6 py-3 text-xs font-black text-slate-950 hover:bg-cyan-400 transition-all"
                  >
                    <Globe size={14} /> 신규 사이트 열기
                  </a>
                  <button
                    onClick={() => {
                      setDeployModalTemplate(null);
                      setActiveTab("manage");
                    }}
                    className="rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs font-extrabold text-white hover:bg-slate-700 transition-all"
                  >
                    사이트 관리로 이동
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="text-xs font-bold text-slate-400">선택 템플릿</p>
                  <p className="text-sm font-black text-cyan-300">{deployModalTemplate.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300">내 사이트 이름</label>
                  <input
                    type="text"
                    value={deploySiteName}
                    onChange={(e) => setDeploySiteName(e.target.value)}
                    className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300">희망 서브도메인 (영문)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={deploySubdomain}
                      onChange={(e) => setDeploySubdomain(e.target.value)}
                      className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none font-mono"
                    />
                    <span className="text-xs font-mono text-slate-400">.creaibox.com</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeployModalTemplate(null)}
                    className="rounded-2xl border border-slate-800 px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmDeploy}
                    disabled={isDeploying}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 transition-all shadow-md disabled:opacity-50"
                  >
                    {isDeploying ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                    <span>{isDeploying ? "구축 중..." : "즉시 구축 완료"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
  );
}
