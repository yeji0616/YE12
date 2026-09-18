import React from 'react';
import { monthlyThemes } from '../data/monthlyThemes';
import { Sparkles, Compass, Sun, Plane, CalendarDays, ExternalLink, Play } from 'lucide-react';

interface SeasonBannerProps {
  selectedMonth: number;
  onOpenAiConsultant: () => void;
  onOpenCalendar: () => void;
}

export const SeasonBanner: React.FC<SeasonBannerProps> = ({
  selectedMonth,
  onOpenAiConsultant,
  onOpenCalendar,
}) => {
  const info = monthlyThemes[selectedMonth] || monthlyThemes[1];

  let themeGradient = 'from-sky-900/90 via-slate-900 to-indigo-950';
  let accentColor = 'text-sky-400';
  let badgeBg = 'bg-sky-500/20 text-sky-300 border-sky-400/30';

  if (info.season === 'spring') {
    themeGradient = 'from-pink-950 via-rose-950 to-slate-900';
    accentColor = 'text-pink-400';
    badgeBg = 'bg-pink-500/20 text-pink-300 border-pink-400/30';
  } else if (info.season === 'summer') {
    themeGradient = 'from-amber-950 via-stone-900 to-teal-950';
    accentColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-400/30';
  } else if (info.season === 'autumn') {
    themeGradient = 'from-orange-950 via-amber-950 to-stone-900';
    accentColor = 'text-orange-400';
    badgeBg = 'bg-orange-500/20 text-orange-300 border-orange-400/30';
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${themeGradient} text-white py-7 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-inner`}>
      {/* Subtle background decoration */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className={`absolute left-1/3 -bottom-20 w-72 h-72 rounded-full ${info.season === 'spring' ? 'bg-pink-500/15' : 'bg-teal-500/10'} blur-2xl pointer-events-none`} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Info (Left Col) */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
                <CalendarDays className="w-3.5 h-3.5" />
                {info.month}월 여행 가이드 · {info.seasonName}
              </span>
              {info.holidayName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  {info.holidayName}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {info.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {info.subtitle}
            </p>

            {/* Climate & Holiday tip summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-1">
                  <Sun className={`w-4 h-4 ${accentColor}`} />
                  <span>{info.month}월 글로벌 기후 특성</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {info.weatherOverview}
                </p>
              </div>

              {info.holidayTip && (
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 mb-1">
                    <Plane className="w-4 h-4 text-rose-400" />
                    <span>휴가 & 일정 예약 팁</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {info.holidayTip}
                  </p>
                </div>
              )}
            </div>

            {/* Key Trend Tags & Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">추천 테마:</span>
                {info.recommendedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-200 border border-white/10"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                <button
                  id="banner-ai-assistant-btn"
                  onClick={onOpenAiConsultant}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 ${
                    info.season === 'spring'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 shadow-pink-950/40'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 shadow-teal-900/30'
                  } text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{info.month}월 맞춤 AI 상담</span>
                </button>
                <button
                  id="banner-full-calendar-btn"
                  onClick={onOpenCalendar}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  <Compass className={`w-3.5 h-3.5 ${info.season === 'spring' ? 'text-pink-300' : 'text-teal-300'}`} />
                  <span>12개월 매트릭스</span>
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Video Widget (Right Col) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/15 shadow-2xl space-y-2.5">
              <div className="flex items-center justify-between px-1 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-red-500 text-red-500" />
                    여행 영감 추천 영상
                  </span>
                </div>
                <a
                  href="https://www.youtube.com/watch?v=Ui-U66uB-So"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-400 hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
                  title="YouTube에서 원본 영상 새 창으로 열기"
                >
                  <span>YouTube에서 보기</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* 16:9 Responsive Video Container */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner border border-white/10">
                <iframe
                  id="hero-youtube-video"
                  src="https://www.youtube.com/embed/Ui-U66uB-So?rel=0"
                  title="해외여행 추천 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                <span>사계절 해외여행지 영상 가이드</span>
                <span className="text-teal-400 font-medium">HD 고화질 재생 가능</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
