import React, { useState } from 'react';
import { Sparkles, X, Send, Compass, Loader2, AlertCircle, CheckCircle, MapPin, Plane, Shirt } from 'lucide-react';
import { AiTravelResponse } from '../types';

interface AiConsultantModalProps {
  initialPrompt?: string;
  onClose: () => void;
  onSelectDestinationByName?: (name: string) => void;
}

const PRESET_PROMPTS = [
  '3월에 부모님과 함께 가기 좋은 4박5일 힐링 여행지 추천해줘',
  '7~8월 여름휴가 때 한국보다 덜 덥고 시원한 피서지 어디가 좋을까?',
  '10월 추석 황금연휴에 떠나기 좋은 낭만적인 유럽 여행지',
  '12월 연말에 크리스마스 마켓과 눈꽃 설경을 만끽할 수 있는 곳',
  '1~2월 겨울에 따뜻하고 바다 물놀이하기 좋은 건기 휴양지',
  '20대 친구들과 5월에 3박4일로 가성비 있게 다녀올 수 있는 곳',
];

export const AiConsultantModal: React.FC<AiConsultantModalProps> = ({
  initialPrompt = '',
  onClose,
  onSelectDestinationByName,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiTravelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (queryToAsk?: string) => {
    const finalQuery = queryToAsk || prompt;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-travel-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalQuery }),
      });

      if (!response.ok) {
        throw new Error('AI 여행 추천 서버 통신에 실패했습니다.');
      }

      const data: AiTravelResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '추천 결과를 가져오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="ai-consultant-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        id="ai-consultant-modal-content"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                AI 시기별 해외여행 컨설턴트
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                여행 가고 싶은 달이나 조건, 취향을 질문하면 가장 최적의 여행지를 분석해 드립니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Presets */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          {/* Quick preset buttons */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>자주 묻는 질문 템플릿:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p);
                    handleAsk(p);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 transition-all text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input field */}
          <div className="flex gap-2">
            <input
              id="ai-consultant-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="예: 9월에 혼자 4박5일로 가기 좋은 아시아 여행지 추천해줘"
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 text-slate-800"
            />
            <button
              id="ai-consultant-submit-btn"
              onClick={() => handleAsk()}
              disabled={loading || !prompt.trim()}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>분석 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>질문하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {loading && (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                전 세계 기후 데이터와 최적기를 분석하고 있습니다...
              </h4>
              <p className="text-xs text-slate-500">
                강수량, 평균 기온, 현지 축제, 비행시간을 종합 매칭 중입니다.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">오류 안내: </strong>
                {error}
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Compass className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm">
                질문 템플릿을 누르거나 원하는 여행 시기와 테마를 입력해 보세요.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Summary / Source Notification */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span>AI 맞춤 여행지 큐레이션 결과</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {result.advice || "해당 시기에 가장 날씨가 쾌적하고 특별한 매력이 있는 여행지들을 엄선했습니다."}
                </p>
                {result.source === 'curated-fallback' && (
                  <p className="text-[11px] text-teal-600 mt-2">
                    💡 Gemini AI 기반 전 세계 기후 데이터 큐레이션이 적용되었습니다.
                  </p>
                )}
              </div>

              {/* Recommended Destinations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-2">
                    추천 여행지 리스트 ({result.recommendations.length}곳)
                  </h4>
                  <div className="space-y-3">
                    {result.recommendations.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-xs transition-all space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 text-sm sm:text-base">
                              {item.destination}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              ({item.country})
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                              {item.weather}
                            </span>
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              예산: {item.budgetLevel}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-8">
                          <strong className="text-slate-900">추천 이유: </strong>
                          {item.reason}
                        </p>

                        {item.highlights && item.highlights.length > 0 && (
                          <div className="pl-8 flex flex-wrap gap-1.5 text-xs text-slate-600 pt-1">
                            <strong className="text-slate-700">핵심 포인트:</strong>
                            {item.highlights.map((h, hIdx) => (
                              <span
                                key={hIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[11px]"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.packingTip && (
                          <div className="pl-8 pt-1 text-[11px] text-teal-800 flex items-center gap-1.5">
                            <Shirt className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span><strong>옷차림 팁:</strong> {item.packingTip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
