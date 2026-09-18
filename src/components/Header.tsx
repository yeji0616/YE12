import React from 'react';
import { Compass, Sparkles, Calendar, Heart, Search, SlidersHorizontal } from 'lucide-react';

import { SeasonType } from '../types';

interface HeaderProps {
  currentMonth: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCalendar: () => void;
  onOpenAiConsultant: () => void;
  onOpenMatcher: () => void;
  onOpenWishlist: () => void;
  seasonTheme?: {
    name: string;
    emoji: string;
    headerAccent: string;
    badge: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentMonth,
  wishlistCount,
  searchQuery,
  onSearchChange,
  onOpenCalendar,
  onOpenAiConsultant,
  onOpenMatcher,
  onOpenWishlist,
  seasonTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs relative">
      {/* Dynamic Seasonal Top Line Accent */}
      {seasonTheme && (
        <div
          className={`h-1 w-full bg-gradient-to-r ${seasonTheme.headerAccent} transition-all duration-700`}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  SeasonTrip
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                  시기별 해외여행지 추천
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                1월부터 12월까지, 가장 날씨 좋은 최적의 여행지를 찾아보세요
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="도시명, 국가명, 태그 (예: 다낭, 스위스, 오로라, 휴양)"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-teal-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  id="header-clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Travel Matcher Quiz */}
            <button
              id="header-matcher-btn"
              onClick={onOpenMatcher}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-xl transition-all"
              title="조건별 맞춤 여행지 매칭"
            >
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span className="hidden md:inline">맞춤 찾기</span>
            </button>

            {/* Annual Calendar Matrix */}
            <button
              id="header-calendar-matrix-btn"
              onClick={onOpenCalendar}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-xl transition-all"
              title="12개월 전체 여행지 최적기 매트릭스 보기"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="hidden md:inline">12개월 캘린더</span>
            </button>

            {/* AI Consultant */}
            <button
              id="header-ai-consultant-btn"
              onClick={onOpenAiConsultant}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl shadow-xs shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 animate-bounce" />
              <span>AI 여행상담</span>
            </button>

            {/* Wishlist Drawer Toggle */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-all"
              title="찜한 여행지 목록"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 sm:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="header-mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="도시명, 국가, 태그 검색"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
