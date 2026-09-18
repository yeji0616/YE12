import React, { useState } from 'react';
import { Destination, FlightCategory } from '../types';
import { SlidersHorizontal, X, Check, Sparkles, Clock, Calendar, HeartHandshake, MapPin } from 'lucide-react';

interface TravelMatcherModalProps {
  destinations: Destination[];
  onClose: () => void;
  onSelectDestination: (dest: Destination) => void;
}

export const TravelMatcherModal: React.FC<TravelMatcherModalProps> = ({
  destinations,
  onClose,
  onSelectDestination,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightCategory | 'any'>('any');
  const [selectedTheme, setSelectedTheme] = useState<string>('any');
  const [companion, setCompanion] = useState<string>('any');

  // Compute matched score for each destination
  const scoredDestinations = destinations.map((dest) => {
    let score = 50;

    // Month match
    if (selectedMonth !== null) {
      if (dest.suitabilityByMonth[selectedMonth] === 'best') score += 35;
      else if (dest.suitabilityByMonth[selectedMonth] === 'good') score += 15;
      else score -= 30;
    } else {
      score += 15;
    }

    // Flight match
    if (selectedFlight !== 'any') {
      if (dest.flightCategory === selectedFlight) score += 20;
      else score -= 10;
    }

    // Theme match
    if (selectedTheme !== 'any') {
      const match = dest.tags.some((t) => t.includes(selectedTheme));
      if (match) score += 25;
    }

    // Companion match
    if (companion === '가족' && dest.tags.includes('가족여행')) score += 15;
    if (companion === '연인' && (dest.tags.includes('허니문') || dest.tags.includes('로맨틱') || dest.tags.includes('신혼여행'))) score += 15;
    if (companion === '부모님' && (dest.flightCategory === 'short' || dest.tags.includes('온천힐링') || dest.tags.includes('도보여행'))) score += 15;

    return {
      destination: dest,
      matchPercentage: Math.min(Math.max(score, 15), 99),
    };
  });

  const sortedResults = scoredDestinations.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 6);

  return (
    <div
      id="travel-matcher-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        id="travel-matcher-modal-content"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                나에게 딱 맞는 시기별 해외여행지 매칭
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                여행 시기와 비행시간, 동행자를 선택하면 가장 날씨 좋은 곳을 추천합니다.
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

        {/* Wizard Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-4 shrink-0">
          {/* Step 1: Month */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>1. 언제 떠나실 계획인가요?</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedMonth(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedMonth === null
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                언제든 상관없음
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedMonth === m
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {m}월
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 & 3: Flight + Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Flight */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>2. 선호 비행시간</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'any', label: '상관없음' },
                  { id: 'short', label: '단거리 (4시간 이하)' },
                  { id: 'medium', label: '중거리 (5~8시간)' },
                  { id: 'long', label: '장거리 (9시간 이상)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedFlight(item.id as any)}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedFlight === item.id
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>3. 원하는 여행 테마</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'any', label: '모두 좋아요' },
                  { id: '휴양', label: '에메랄드 바다 휴양' },
                  { id: '미식', label: '식도락 & 야시장' },
                  { id: '자연', label: '대자연 & 하이킹' },
                  { id: '낭만', label: '유럽 낭만 & 건축' },
                  { id: '온천', label: '온천 & 힐링' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTheme(item.id)}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedTheme === item.id
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span>4. 누구와 함께 가나요?</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'any', label: '상관없음' },
                  { id: '연인', label: '연인 / 신혼부부' },
                  { id: '가족', label: '아이 동반 가족' },
                  { id: '부모님', label: '부모님 효도여행' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCompanion(item.id)}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      companion === item.id
                        ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>매칭 추천 여행지 TOP 6</span>
              <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-semibold">
                실시간 적합도 계산됨
              </span>
            </h3>
            {selectedMonth && (
              <span className="text-xs text-slate-500 font-medium">
                {selectedMonth}월 기준 기후 및 최적기 분석
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {sortedResults.map(({ destination: dest, matchPercentage }) => (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className="group p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-2.5 bg-slate-100">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">
                      {dest.country}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-teal-600 text-white text-[11px] font-extrabold shadow-sm">
                      {matchPercentage}% 매칭
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                    {dest.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {dest.whyVisitNow}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{dest.flightHours}</span>
                  <span className="font-semibold text-teal-600 group-hover:underline">
                    상세보기 &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
