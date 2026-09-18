import React, { useState } from 'react';
import { Destination } from '../types';
import {
  X,
  Heart,
  Calendar,
  Sun,
  Clock,
  MapPin,
  Compass,
  AlertTriangle,
  Shirt,
  Utensils,
  Plane,
  BadgeDollarSign,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Sparkles,
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination | null;
  currentSelectedMonth: number;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onClose: () => void;
  onAskAiAboutThis: (destName: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  currentSelectedMonth,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAskAiAboutThis,
}) => {
  const [activeTab, setActiveTab] = useState<'weather' | 'highlights' | 'food' | 'itinerary'>('weather');
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (!destination) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div
      id="destination-detail-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        id="destination-detail-modal-content"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-900">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                {destination.country}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-600/90 backdrop-blur-md text-white">
                {destination.continent}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="modal-wishlist-toggle"
                onClick={() => onToggleWishlist(destination.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isWishlisted
                    ? 'bg-rose-500 text-white shadow-lg'
                    : 'bg-black/40 text-white hover:bg-black/60 hover:text-rose-400'
                }`}
                title={isWishlisted ? '찜 제거' : '찜 목록에 추가'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                id="modal-close-btn"
                onClick={onClose}
                className="p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title & Key Highlights on Image */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500 text-white">
                {destination.bestMonths.map((m) => `${m}월`).join(', ')} 최적기
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/20 backdrop-blur-xs text-slate-100">
                추천 일정: {destination.recommendedDuration}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
              {destination.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {destination.summary}
            </p>
          </div>
        </div>

        {/* Quick Travel Specs Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 p-3 bg-slate-50 border-b border-slate-200/80 text-xs shrink-0">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">인천 출발 비행</div>
              <div className="font-bold text-slate-800 truncate">{destination.flightHours}</div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">한국과의 시차</div>
              <div className="font-bold text-slate-800 truncate">{destination.timeDiff}</div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">비자 요건</div>
              <div className="font-bold text-slate-800 truncate">{destination.visa}</div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
            <BadgeDollarSign className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">현지 통화 / 예산</div>
              <div className="font-bold text-slate-800 truncate">{destination.budgetLevel} ({destination.currency.split(' ')[0]})</div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">평균 기온</div>
              <div className="font-bold text-slate-800 truncate">{destination.averageTemp}</div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium">건기 / 날씨</div>
              <div className="font-bold text-slate-800 truncate">{destination.rainfallLevel}</div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-4 sm:px-6 shrink-0 bg-white">
          <button
            id="tab-weather-btn"
            onClick={() => setActiveTab('weather')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'weather'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>시기별 날씨 & 옷차림</span>
          </button>

          <button
            id="tab-highlights-btn"
            onClick={() => setActiveTab('highlights')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'highlights'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>핵심 명소 (Top 3)</span>
          </button>

          <button
            id="tab-food-btn"
            onClick={() => setActiveTab('food')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'food'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>대표 미식</span>
          </button>

          <button
            id="tab-itinerary-btn"
            onClick={() => setActiveTab('itinerary')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'itinerary'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>추천 일정 & 팁</span>
          </button>
        </div>

        {/* Tab Content Area (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Dedicated 6 Key Database Information Box */}
          <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-sky-50/80 border border-teal-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-teal-200/70 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    시기별 6대 핵심 여행 정보
                  </h3>
                  <p className="text-[11px] text-teal-700 font-medium">
                    1.여행지 · 2.추천시기 · 3.좋은이유 · 4.추천활동 · 5.예상경비 · 6.여행팁
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-700 text-white shadow-xs">
                {destination.seasonCategory} 시즌 추천
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* 1 & 2 */}
              <div className="bg-white/90 p-3 rounded-xl border border-teal-100 space-y-1">
                <div className="text-[11px] font-bold text-teal-800">1. 여행지 & 2. 추천 시기</div>
                <div className="font-extrabold text-slate-900 text-sm">{destination.name} <span className="text-slate-500 font-normal text-xs">({destination.country})</span></div>
                <div className="text-teal-700 font-semibold flex items-center gap-1 pt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{destination.recommendedPeriod}</span>
                </div>
              </div>

              {/* 5 */}
              <div className="bg-white/90 p-3 rounded-xl border border-teal-100 space-y-1">
                <div className="text-[11px] font-bold text-teal-800">5. 예상 경비</div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-xs border ${
                    destination.costLevel === '저가'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : destination.costLevel === '중간'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-purple-100 text-purple-800 border-purple-300'
                  }`}>
                    {destination.costLevel}
                  </span>
                  <span className="text-slate-600 text-xs">
                    ({destination.budgetLevel} 등급 · {destination.currency})
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  권장 체류: {destination.recommendedDuration} / 비행: {destination.flightHours}
                </div>
              </div>

              {/* 3. 추천 이유 */}
              <div className="md:col-span-2 bg-white/90 p-3 rounded-xl border border-teal-100 space-y-1">
                <div className="text-[11px] font-bold text-teal-800">3. 해당 시기에 여행하기 좋은 이유 (날씨·축제·이벤트)</div>
                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
                  {destination.seasonReason || destination.whyVisitNow}
                </p>
              </div>

              {/* 4. 추천 활동 */}
              {destination.recommendedActivities && (
                <div className="md:col-span-2 bg-white/90 p-3.5 rounded-xl border border-teal-100 space-y-2">
                  <div className="text-[11px] font-bold text-teal-800">4. 추천 활동 (관광 · 액티비티 · 음식)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                        <span>🏛️</span> 관광 명소
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                        {destination.recommendedActivities.sightseeing.map((item, idx) => (
                          <li key={idx} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                        <span>🏄</span> 체험 & 액티비티
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                        {destination.recommendedActivities.activities.map((item, idx) => (
                          <li key={idx} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                        <span>🍜</span> 추천 대표 음식
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                        {destination.recommendedActivities.food.map((item, idx) => (
                          <li key={idx} className="truncate">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. 간단한 여행 팁 */}
              <div className="md:col-span-2 bg-amber-50/90 p-3 rounded-xl border border-amber-200 space-y-1">
                <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <span>💡 6. 실전 여행 팁</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                  {destination.travelTip}
                </p>
              </div>
            </div>
          </div>

          {activeTab === 'weather' && (
            <div className="space-y-5">
              {/* Why Visit Now Section */}
              <div className="bg-teal-50/80 border border-teal-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>왜 이 시기에 가야 할까요? (핵심 매력)</span>
                </div>
                <p className="text-xs sm:text-sm text-teal-950 leading-relaxed">
                  {destination.whyVisitNow}
                </p>
              </div>

              {/* 12-Month Suitability Detailed Calendar */}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span>12개월 월별 여행 적합도 가이드</span>
                </h4>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                    const status = destination.suitabilityByMonth[m];
                    const isSelected = currentSelectedMonth === m;

                    let bg = 'bg-slate-200 text-slate-600 border-slate-300';
                    let label = '비추천/우기';
                    if (status === 'best') {
                      bg = 'bg-emerald-500 text-white font-bold border-emerald-600 shadow-xs';
                      label = '최적기 (Best)';
                    } else if (status === 'good') {
                      bg = 'bg-amber-400 text-slate-900 font-semibold border-amber-500';
                      label = '무난 (Good)';
                    }

                    return (
                      <div
                        key={m}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${bg} ${
                          isSelected ? 'ring-2 ring-teal-600 scale-105' : ''
                        }`}
                      >
                        <span className="text-xs font-bold">{m}월</span>
                        <span className="text-[10px] mt-0.5 scale-90 truncate max-w-full">
                          {status === 'best' ? '최적기' : status === 'good' ? '보통' : '주의'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" /> 최적기 (화창한 건기/축제/선선)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" /> 여행 가능 (무난한 기후)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" /> 주의 (우기/몬순/혹서)
                  </span>
                </div>
              </div>

              {/* Avoid Periods Warning */}
              <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>주의해야 할 시기 & 이유</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
                  {destination.avoidMonthsInfo}
                </p>
              </div>

              {/* Clothing and Packing Advice */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1.5">
                  <Shirt className="w-4 h-4 text-teal-600" />
                  <span>추천 옷차림 및 준비물</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {destination.clothingAdvice}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                놓치면 안 될 {destination.name} 3대 하이라이트
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {destination.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:bg-teal-50/50 hover:border-teal-200 transition-colors"
                  >
                    <div>
                      <span className="inline-block w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold text-center leading-6 mb-2">
                        {i + 1}
                      </span>
                      <h5 className="font-bold text-slate-900 text-sm mb-1.5">
                        {h.title}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {h.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                {destination.name}에 가면 꼭 먹어봐야 할 대표 미식
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.mustEat.map((food, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{food}</div>
                      <div className="text-[11px] text-slate-500">현지 추천 필수 시식 메뉴</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-teal-600" />
                  <span>권장 일정: {destination.recommendedDuration} 골든 코스</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  인천에서 {destination.flightHours} 소요되며, {destination.timeDiff}이라 시차 적응이 빠릅니다.
                  첫날은 가벼운 도심 야경과 미식을 즐기고, 2~3일 차에 핵심 명소를 집중 투어하며, 마지막 날 쇼핑과 스파/휴식으로 마무리하는 코스를 가장 추천합니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                <h4 className="text-sm font-bold text-emerald-950 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>비자 및 출입국 편의</span>
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  대한민국 여권 소지자 기준 <strong>{destination.visa}</strong> 제도가 적용됩니다.
                  여권 만료일이 6개월 이상 남아있는지 꼭 사전에 확인하세요.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            id="ask-ai-from-modal-btn"
            onClick={() => onAskAiAboutThis(destination.name)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3.5 py-2.5 rounded-xl border border-teal-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI에게 이 여행지 3박4일 코스 질문하기</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="modal-share-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copyFeedback ? '링크 복사완료!' : '공유'}</span>
            </button>

            <button
              id="modal-wishlist-action-btn"
              onClick={() => onToggleWishlist(destination.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isWishlisted ? '찜한 여행지' : '내 찜 목록에 담기'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
