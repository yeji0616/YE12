import React from 'react';
import { Destination } from '../types';
import { Heart, Sun, Clock, MapPin, Sparkles, ChevronRight, Check } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  currentSelectedMonth: number;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelect: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  currentSelectedMonth,
  isWishlisted,
  onToggleWishlist,
  onSelect,
}) => {
  const isOptimalNow = destination.bestMonths.includes(currentSelectedMonth);
  const currentMonthSuitability = destination.suitabilityByMonth[currentSelectedMonth] || 'good';

  return (
    <div
      id={`destination-card-${destination.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-teal-400/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Card Image Area */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/20">
            {destination.country}
          </span>
          <span className={`px-2 py-0.5 text-xs font-bold rounded-lg text-white backdrop-blur-xs ${
            destination.seasonCategory === '봄'
              ? 'bg-pink-600'
              : destination.seasonCategory === '여름'
              ? 'bg-amber-600'
              : destination.seasonCategory === '가을'
              ? 'bg-orange-600'
              : 'bg-sky-600'
          }`}>
            {destination.seasonCategory === '봄' ? '🌸 봄 추천' : destination.seasonCategory === '여름' ? '☀️ 여름 추천' : destination.seasonCategory === '가을' ? '🍁 가을 추천' : '❄️ 겨울 추천'}
          </span>
        </div>

        {/* Heart Wishlist Button */}
        <button
          id={`wishlist-toggle-${destination.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(destination.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-black/40 text-white hover:bg-black/60 hover:text-rose-400'
          }`}
          title={isWishlisted ? '찜한 목록에서 제거' : '찜 목록에 추가'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Image Overlay: Suitability Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white drop-shadow-md">
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span>{destination.averageTemp}</span>
            <span className="text-white/60">·</span>
            <span className="text-emerald-300 font-medium">{destination.rainfallLevel}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-white/90 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
            <Clock className="w-3 h-3 text-slate-300" />
            <span>{destination.flightHours}</span>
          </div>
        </div>
      </div>

      {/* Card Body Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title & Timing Status */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {destination.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{destination.nameEn}</p>
            </div>

            {/* Current Month Best Indicator */}
            {currentMonthSuitability === 'best' ? (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                {currentSelectedMonth}월 최적기
              </span>
            ) : (
              <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                {currentSelectedMonth}월 여행가능
              </span>
            )}
          </div>

          {/* Short summary */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
            {destination.summary}
          </p>

          {/* 6 Key Information Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2 mb-3 text-xs">
            {/* 2. 추천 시기 & 5. 예상 경비 */}
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <span className="text-teal-600">🗓️ 추천 시기:</span>
                <span className="text-teal-900 font-bold">{destination.recommendedPeriod}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                destination.costLevel === '저가'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : destination.costLevel === '중간'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                경비: {destination.costLevel}
              </span>
            </div>

            {/* 3. 추천 이유 */}
            <div className="text-slate-700 leading-snug line-clamp-2">
              <strong className="text-slate-900 font-semibold">✨ 추천 이유: </strong>
              {destination.seasonReason || destination.whyVisitNow}
            </div>

            {/* 4. 추천 활동 (관광, 액티비티, 음식) */}
            {destination.recommendedActivities && (
              <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 flex flex-wrap gap-x-2 gap-y-0.5">
                <span>🏛️ <strong className="text-slate-700">관광:</strong> {destination.recommendedActivities.sightseeing[0]}</span>
                <span>🏄 <strong className="text-slate-700">액티비티:</strong> {destination.recommendedActivities.activities[0]}</span>
                <span>🍜 <strong className="text-slate-700">음식:</strong> {destination.recommendedActivities.food[0]}</span>
              </div>
            )}

            {/* 6. 간단한 여행 팁 */}
            {destination.travelTip && (
              <div className="text-[11px] text-slate-600 leading-snug line-clamp-1 bg-white p-1.5 rounded-lg border border-slate-200/60">
                <span className="font-bold text-amber-700">💡 팁: </span>
                {destination.travelTip}
              </div>
            )}
          </div>

          {/* 12-Month Suitability Mini Grid */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
              <span>연간 추천 시기:</span>
              <span className="text-teal-700 font-semibold">
                {destination.bestMonths.map((m) => `${m}월`).join(', ')} 추천
              </span>
            </div>
            <div className="grid grid-cols-12 gap-0.5 bg-slate-100 p-1 rounded-lg">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                const isCurrent = currentSelectedMonth === m;
                const status = destination.suitabilityByMonth[m];
                let color = 'bg-slate-300 text-slate-500';
                if (status === 'best') color = 'bg-emerald-500 text-white font-bold';
                else if (status === 'good') color = 'bg-amber-300 text-amber-900 font-medium';

                return (
                  <div
                    key={m}
                    className={`h-4.5 text-[9px] rounded-xs flex items-center justify-center transition-all ${color} ${
                      isCurrent ? 'ring-2 ring-teal-600 scale-110 z-10' : ''
                    }`}
                    title={`${m}월: ${status === 'best' ? '최적기' : status === 'good' ? '여행 무난' : '비추천/우기'}`}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1 mb-2">
            {destination.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
              >
                #{tag}
              </span>
            ))}
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200/60">
              예산: {destination.budgetLevel}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          id={`view-detail-btn-${destination.id}`}
          onClick={() => onSelect(destination)}
          className="w-full mt-2 py-2.5 px-3 bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
        >
          <span>상세 가이드 & 날씨 꿀팁 보기</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
