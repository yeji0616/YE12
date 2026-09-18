import React, { useState, useEffect, useMemo } from 'react';
import { Destination, Continent, FlightCategory, BudgetLevel, SeasonType } from './types';
import { destinations } from './data/destinations';
import { monthlyThemes } from './data/monthlyThemes';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { SeasonBanner } from './components/SeasonBanner';
import { FilterBar } from './components/FilterBar';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { CalendarMatrixModal } from './components/CalendarMatrixModal';
import { TravelMatcherModal } from './components/TravelMatcherModal';
import { AiConsultantModal } from './components/AiConsultantModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import {
  Sparkles,
  Compass,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  HelpCircle,
  Plane,
  Sun,
  Award,
  TrendingUp,
} from 'lucide-react';

interface SeasonThemeStyle {
  id: SeasonType;
  name: string;
  emoji: string;
  periodText: string;
  badgeLabel: string;
  bgClass: string;
  gradientOverlay: string;
  orb1: string;
  orb2: string;
  orb3: string;
  headerAccent: string;
  accentBadge: string;
}

const SEASON_THEMES: Record<SeasonType, SeasonThemeStyle> = {
  spring: {
    id: 'spring',
    name: '봄',
    emoji: '🌸',
    periodText: '3월 ~ 5월',
    badgeLabel: '화사한 벚꽃 핑크 봄 테마',
    bgClass: 'bg-[#fff0f4]', // Pure lovely petal pink
    gradientOverlay: 'from-pink-200/60 via-pink-100/40 to-rose-50/40',
    orb1: 'bg-pink-400/30',
    orb2: 'bg-pink-300/35',
    orb3: 'bg-rose-200/35',
    headerAccent: 'from-pink-500 via-rose-400 to-pink-300',
    accentBadge: 'bg-pink-100 text-pink-800 border-pink-200',
  },
  summer: {
    id: 'summer',
    name: '여름',
    emoji: '☀️',
    periodText: '6월 ~ 8월',
    badgeLabel: '청량한 여름 테마',
    bgClass: 'bg-[#edf7fd]', // Crisp coastal sky & refreshing ocean azure
    gradientOverlay: 'from-sky-100/75 via-cyan-50/50 to-teal-50/30',
    orb1: 'bg-sky-300/30',
    orb2: 'bg-cyan-200/30',
    orb3: 'bg-amber-200/20',
    headerAccent: 'from-sky-500 via-cyan-400 to-amber-400',
    accentBadge: 'bg-sky-100/90 text-sky-800 border-sky-200/80',
  },
  autumn: {
    id: 'autumn',
    name: '가을',
    emoji: '🍁',
    periodText: '9월 ~ 11월',
    badgeLabel: '낭만적인 가을 테마',
    bgClass: 'bg-[#fbf4eb]', // Rich golden amber & warm maple foliage
    gradientOverlay: 'from-amber-100/75 via-orange-50/45 to-stone-100/40',
    orb1: 'bg-amber-300/30',
    orb2: 'bg-orange-200/30',
    orb3: 'bg-rose-200/20',
    headerAccent: 'from-amber-500 via-orange-400 to-rose-400',
    accentBadge: 'bg-amber-100/90 text-amber-800 border-amber-200/80',
  },
  winter: {
    id: 'winter',
    name: '겨울',
    emoji: '❄️',
    periodText: '12월 ~ 2월',
    badgeLabel: '포근한 겨울 테마',
    bgClass: 'bg-[#f1f5fa]', // Pristine alpine snow & northern aurora
    gradientOverlay: 'from-indigo-100/65 via-sky-50/50 to-slate-100/60',
    orb1: 'bg-indigo-300/25',
    orb2: 'bg-sky-200/30',
    orb3: 'bg-slate-200/35',
    headerAccent: 'from-indigo-500 via-sky-400 to-slate-400',
    accentBadge: 'bg-indigo-100/90 text-indigo-800 border-indigo-200/80',
  },
};

export default function App() {
  // Current calendar month detection (1~12)
  const defaultMonth = (() => {
    const current = new Date().getMonth() + 1;
    return current >= 1 && current <= 12 ? current : 9;
  })();

  const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth);
  const [activeSeason, setActiveSeason] = useState<SeasonType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'monthly' | 'season_db'>('monthly');
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'all'>('all');
  const [selectedFlight, setSelectedFlight] = useState<FlightCategory | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<BudgetLevel | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommend' | 'flight' | 'budget'>('recommend');

  // Wishlist state persisted in localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('seasontrip_wishlist');
      return saved ? JSON.parse(saved) : ['danang', 'bali', 'swiss'];
    } catch {
      return ['danang', 'bali', 'swiss'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('seasontrip_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [wishlistIds]);

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearWishlist = () => setWishlistIds([]);

  // Modals & Drawers
  const [selectedDetailDest, setSelectedDetailDest] = useState<Destination | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const seasonCategoryMap: Record<SeasonType, '봄' | '여름' | '가을' | '겨울'> = {
    spring: '봄',
    summer: '여름',
    autumn: '가을',
    winter: '겨울',
  };

  // Filtering destinations based on viewMode, month/season and criteria
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // 1. Season DB View Mode vs Monthly View Mode
      if (viewMode === 'season_db') {
        if (activeSeason !== 'all') {
          const targetCategory = seasonCategoryMap[activeSeason];
          if (dest.seasonCategory !== targetCategory) {
            return false;
          }
        }
      } else {
        // Monthly mode: suitability in selectedMonth
        const monthStatus = dest.suitabilityByMonth[selectedMonth];
        const isSearchActive = searchQuery.trim().length > 0;
        if (!isSearchActive && monthStatus === 'caution') {
          return false;
        }
      }

      // Continent
      if (selectedContinent !== 'all' && dest.continent !== selectedContinent) {
        return false;
      }

      // Flight
      if (selectedFlight !== 'all' && dest.flightCategory !== selectedFlight) {
        return false;
      }

      // Budget
      if (selectedBudget !== 'all' && dest.budgetLevel !== selectedBudget) {
        return false;
      }

      // Tag
      if (selectedTag && !dest.tags.some((t) => t.includes(selectedTag))) {
        return false;
      }

      // Search Query across all 6 core attributes
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesName = dest.name.toLowerCase().includes(query);
        const matchesNameEn = dest.nameEn.toLowerCase().includes(query);
        const matchesCountry = dest.country.toLowerCase().includes(query);
        const matchesTags = dest.tags.some((t) => t.toLowerCase().includes(query));
        const matchesSummary = dest.summary.toLowerCase().includes(query);
        const matchesPeriod = dest.recommendedPeriod?.toLowerCase().includes(query);
        const matchesReason = dest.seasonReason?.toLowerCase().includes(query);
        const matchesTip = dest.travelTip?.toLowerCase().includes(query);
        const matchesSightseeing = dest.recommendedActivities?.sightseeing?.some((s) => s.toLowerCase().includes(query));
        const matchesFood = dest.recommendedActivities?.food?.some((f) => f.toLowerCase().includes(query));

        if (
          !matchesName &&
          !matchesNameEn &&
          !matchesCountry &&
          !matchesTags &&
          !matchesSummary &&
          !matchesPeriod &&
          !matchesReason &&
          !matchesTip &&
          !matchesSightseeing &&
          !matchesFood
        ) {
          return false;
        }
      }

      return true;
    });
  }, [viewMode, selectedMonth, activeSeason, selectedContinent, selectedFlight, selectedBudget, selectedTag, searchQuery]);

  // Split into 'Best' vs 'Good'
  const { bestList, goodList } = useMemo(() => {
    const best: Destination[] = [];
    const good: Destination[] = [];

    filteredDestinations.forEach((dest) => {
      if (viewMode === 'season_db') {
        // In season database mode, all matching destinations are presented together
        best.push(dest);
      } else {
        if (dest.suitabilityByMonth[selectedMonth] === 'best') {
          best.push(dest);
        } else {
          good.push(dest);
        }
      }
    });

    const sorter = (a: Destination, b: Destination) => {
      if (sortBy === 'flight') {
        const aVal = a.flightCategory === 'short' ? 1 : a.flightCategory === 'medium' ? 2 : 3;
        const bVal = b.flightCategory === 'short' ? 1 : b.flightCategory === 'medium' ? 2 : 3;
        return aVal - bVal;
      }
      if (sortBy === 'budget') {
        const aVal = a.costLevel === '저가' ? 1 : a.costLevel === '중간' ? 2 : 3;
        const bVal = b.costLevel === '저가' ? 1 : b.costLevel === '중간' ? 2 : 3;
        return aVal - bVal;
      }
      return 0; // Default curated order
    };

    return {
      bestList: best.sort(sorter),
      goodList: good.sort(sorter),
    };
  }, [filteredDestinations, viewMode, selectedMonth, sortBy]);

  const resetFilters = () => {
    setSelectedContinent('all');
    setSelectedFlight('all');
    setSelectedBudget('all');
    setSelectedTag(null);
    setSearchQuery('');
  };

  const handleAskAiAboutDest = (destName: string) => {
    setSelectedDetailDest(null);
    setAiPrompt(`${selectedMonth}월에 ${destName} 여행 계획 및 3박 4일 추천 일정과 날씨 조언 알려줘`);
    setIsAiOpen(true);
  };

  const openAiWithMonth = () => {
    setAiPrompt(`${selectedMonth}월에 떠나기 가장 좋은 해외여행지와 준비 팁을 추천해줘`);
    setIsAiOpen(true);
  };

  const currentTheme = monthlyThemes[selectedMonth] || monthlyThemes[9];

  // Dynamically determine the active season for the background theme
  const currentSeason: SeasonType = useMemo(() => {
    if (activeSeason !== 'all') {
      return activeSeason;
    }
    return currentTheme.season;
  }, [activeSeason, currentTheme.season]);

  const activeSeasonTheme = SEASON_THEMES[currentSeason];

  return (
    <div
      className={`min-h-screen ${activeSeasonTheme.bgClass} text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors duration-700 ease-in-out relative overflow-x-hidden`}
    >
      {/* Dynamic Seasonal Ambient Backdrops */}
      <div
        className={`fixed -top-32 -left-32 w-96 h-96 rounded-full ${activeSeasonTheme.orb1} blur-3xl pointer-events-none transition-all duration-700 z-0`}
      />
      <div
        className={`fixed top-1/3 -right-32 w-96 h-96 rounded-full ${activeSeasonTheme.orb2} blur-3xl pointer-events-none transition-all duration-700 z-0`}
      />
      <div
        className={`fixed -bottom-32 left-1/4 w-96 h-96 rounded-full ${activeSeasonTheme.orb3} blur-3xl pointer-events-none transition-all duration-700 z-0`}
      />
      <div
        className={`fixed inset-0 bg-gradient-to-b ${activeSeasonTheme.gradientOverlay} pointer-events-none transition-all duration-700 z-0`}
      />

      {/* Main Content container layered above ambient backdrops */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Navigation */}
        <Header
          currentMonth={selectedMonth}
          wishlistCount={wishlistIds.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onOpenAiConsultant={() => {
            setAiPrompt('');
            setIsAiOpen(true);
          }}
          onOpenMatcher={() => setIsMatcherOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          seasonTheme={{
            name: activeSeasonTheme.name,
            emoji: activeSeasonTheme.emoji,
            headerAccent: activeSeasonTheme.headerAccent,
            badge: activeSeasonTheme.accentBadge,
          }}
        />

        {/* 12-Month Interactive Ribbon */}
        <MonthSelector
          selectedMonth={selectedMonth}
          onSelectMonth={(m) => setSelectedMonth(m)}
          activeSeason={activeSeason}
          onSelectSeason={(s) => setActiveSeason(s)}
          currentSeason={currentSeason}
        />

        {/* Seasonal Context Hero Banner */}
        <SeasonBanner
          selectedMonth={selectedMonth}
          onOpenAiConsultant={openAiWithMonth}
          onOpenCalendar={() => setIsCalendarOpen(true)}
        />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <FilterBar
          selectedContinent={selectedContinent}
          onSelectContinent={setSelectedContinent}
          selectedFlight={selectedFlight}
          onSelectFlight={setSelectedFlight}
          selectedBudget={selectedBudget}
          onSelectBudget={setSelectedBudget}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          totalCount={destinations.length}
          filteredCount={filteredDestinations.length}
          onReset={resetFilters}
        />

        {/* View Mode Switcher: Monthly vs Seasonal Database */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              id="view-mode-monthly-btn"
              onClick={() => {
                setViewMode('monthly');
                setActiveSeason('all');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'monthly'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedMonth}월 맞춤 최적지</span>
            </button>

            <button
              id="view-mode-season-db-btn"
              onClick={() => setViewMode('season_db')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'season_db'
                  ? 'bg-teal-600 text-white shadow-xs shadow-teal-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>사계절(봄·여름·가을·겨울) 데이터베이스</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">정렬:</span>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-700 cursor-pointer"
            >
              <option value="recommend">🌟 전문가 추천순</option>
              <option value="flight">⏱️ 비행시간 짧은순</option>
              <option value="budget">💰 예상경비 (저가→고가)</option>
            </select>
          </div>
        </div>

        {/* If in Season DB Mode: Season Category Fast Buttons */}
        {viewMode === 'season_db' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 rounded-2xl border border-teal-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-extrabold text-teal-950 flex items-center gap-2">
                  <span>🗺️ 사계절 추천 해외 여행지 데이터베이스</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-600 text-white font-bold">
                    6대 핵심 정보 수록
                  </span>
                </h3>
                <p className="text-xs text-teal-800/80 mt-0.5">
                  1.여행지명 · 2.추천시기 · 3.좋은이유 · 4.추천활동(관광/액티비티/음식) · 5.예상경비 · 6.여행팁
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  id="season-db-all-btn"
                  onClick={() => setActiveSeason('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSeason === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  사계절 전체 ({destinations.length})
                </button>
                <button
                  id="season-db-spring-btn"
                  onClick={() => setActiveSeason('spring')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSeason === 'spring'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  🌸 봄 (3~5월)
                </button>
                <button
                  id="season-db-summer-btn"
                  onClick={() => setActiveSeason('summer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSeason === 'summer'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  ☀️ 여름 (6~8월)
                </button>
                <button
                  id="season-db-autumn-btn"
                  onClick={() => setActiveSeason('autumn')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSeason === 'autumn'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-orange-800 hover:bg-orange-50 border border-orange-200'
                  }`}
                >
                  🍁 가을 (9~11월)
                </button>
                <button
                  id="season-db-winter-btn"
                  onClick={() => setActiveSeason('winter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeSeason === 'winter'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
                  }`}
                >
                  ❄️ 겨울 (12~2월)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Heading */}
        <div className="flex items-center justify-between gap-3 mb-6 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>
                {viewMode === 'season_db'
                  ? activeSeason === 'spring'
                    ? '🌸 봄 추천 해외여행지'
                    : activeSeason === 'summer'
                    ? '☀️ 여름 추천 해외여행지'
                    : activeSeason === 'autumn'
                    ? '🍁 가을 추천 해외여행지'
                    : activeSeason === 'winter'
                    ? '❄️ 겨울 추천 해외여행지'
                    : '🌐 사계절 전체 해외여행지 데이터베이스'
                  : `${selectedMonth}월 추천 해외여행지`}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                총 {filteredDestinations.length}곳
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {viewMode === 'season_db'
                ? '시기별 날씨, 축제, 최적 액티비티 및 예상 경비가 검증된 추천지 목록입니다.'
                : '화창한 건기, 온화한 날씨, 축제 시즌을 반영한 최적의 리스트입니다.'}
            </p>
          </div>
        </div>

        {/* If no results match search/filter */}
        {filteredDestinations.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 my-8">
            <Compass className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">
              선택하신 조건에 맞는 여행지가 없습니다.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              필터 조건을 완화하거나 필터 초기화 버튼을 눌러 다른 시기의 여행지를 찾아보세요.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              필터 전체 초기화
            </button>
          </div>
        )}

        {/* Section 1 & 2 Cards Render */}
        {viewMode === 'season_db' ? (
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bestList.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  currentSelectedMonth={selectedMonth}
                  isWishlisted={wishlistIds.includes(dest.id)}
                  onToggleWishlist={toggleWishlist}
                  onSelect={(d) => setSelectedDetailDest(d)}
                />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Section 1: BEST TIERS (최적기 여행지) */}
            {bestList.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-xs">
                    ★
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {selectedMonth}월이 일 년 중 가장 좋은 <span className="text-emerald-700">황금 최적기 (Best Season)</span>
                  </h3>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    · 비가 적고 기온이 쾌적하며 주요 축제가 열립니다.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {bestList.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      currentSelectedMonth={selectedMonth}
                      isWishlisted={wishlistIds.includes(dest.id)}
                      onToggleWishlist={toggleWishlist}
                      onSelect={(d) => setSelectedDetailDest(d)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: GOOD TIERS (여행하기 무난하고 쾌적한 여행지) */}
            {goodList.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4 pt-4 border-t border-slate-200">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xs">
                    ●
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {selectedMonth}월에 여행하기 좋은 <span className="text-amber-700">추천 여행지 (Good Season)</span>
                  </h3>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    · 무난한 기후와 합리적인 비용으로 여행하기 좋습니다.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {goodList.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      currentSelectedMonth={selectedMonth}
                      isWishlisted={wishlistIds.includes(dest.id)}
                      onToggleWishlist={toggleWishlist}
                      onSelect={(d) => setSelectedDetailDest(d)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Seasonal Travel Tips & Knowledge Guide */}
        <section className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              시기별 해외여행 계획 가이드 & 꿀팁 Q&A
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>건기(Dry Season)를 노려야 하는 이유</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                동남아와 휴양지는 건기 시즌에 파도가 잔잔하고 바다 시야가 20m 이상 확보되어 스노클링과 해변 물놀이에 최적입니다. 우기에는 스콜성 호우와 녹조가 발생할 수 있습니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-teal-600" />
                <span>연휴 & 항공권 얼리버드 공략법</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                5월 황금연휴, 7~8월 여름휴가, 추석 연휴는 최소 3~5개월 전 항공권을 확보해야 비용을 30~50% 이상 절감할 수 있으며 숙소 선택 폭이 넓어집니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>남반구 vs 북반구 계절 반전</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                한국이 한겨울인 12~2월에 호주 시드니는 화창한 한여름 해변을 만끽할 수 있고, 한국이 무더운 7~8월에 몽골이나 삿포로는 시원한 피서지로 완벽합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              ST
            </div>
            <div>
              <div className="font-bold text-white text-sm">SeasonTrip</div>
              <div>시기별 해외여행지 추천 큐레이션 플랫폼</div>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1 text-slate-500">
            <p>전 세계 기후 통계, 월별 건기·우기 데이터, 대한민국 공휴일 연계 기반</p>
            <p>© {new Date().getFullYear()} SeasonTrip. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      {selectedDetailDest && (
        <DestinationDetailModal
          destination={selectedDetailDest}
          currentSelectedMonth={selectedMonth}
          isWishlisted={wishlistIds.includes(selectedDetailDest.id)}
          onToggleWishlist={toggleWishlist}
          onClose={() => setSelectedDetailDest(null)}
          onAskAiAboutThis={handleAskAiAboutDest}
        />
      )}

      {isCalendarOpen && (
        <CalendarMatrixModal
          destinations={destinations}
          onClose={() => setIsCalendarOpen(false)}
          onSelectDestination={(d) => {
            setIsCalendarOpen(false);
            setSelectedDetailDest(d);
          }}
        />
      )}

      {isMatcherOpen && (
        <TravelMatcherModal
          destinations={destinations}
          onClose={() => setIsMatcherOpen(false)}
          onSelectDestination={(d) => {
            setIsMatcherOpen(false);
            setSelectedDetailDest(d);
          }}
        />
      )}

      {isAiOpen && (
        <AiConsultantModal
          initialPrompt={aiPrompt}
          onClose={() => setIsAiOpen(false)}
          onSelectDestinationByName={(name) => {
            const match = destinations.find(
              (d) => d.name.includes(name) || name.includes(d.name)
            );
            if (match) {
              setIsAiOpen(false);
              setSelectedDetailDest(match);
            }
          }}
        />
      )}

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistIds={wishlistIds}
          destinations={destinations}
          onRemoveWishlist={toggleWishlist}
          onClearAll={clearWishlist}
          onSelectDestination={(d) => {
            setIsWishlistOpen(false);
            setSelectedDetailDest(d);
          }}
        />

        {/* Floating Seasonal Background Switcher Pill */}
        <div className="fixed bottom-5 right-5 z-30 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 flex items-center gap-2 transition-all hover:shadow-2xl">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
            <span className="text-sm">🎨</span>
            <span className="hidden sm:inline">배경 테마:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              id="bg-theme-spring-btn"
              onClick={() => {
                setActiveSeason('spring');
                setSelectedMonth(4);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentSeason === 'spring'
                  ? 'bg-pink-500 text-white shadow-xs shadow-pink-500/20 scale-105'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200/60'
              }`}
              title="봄 배경화면 (4월 기준)"
            >
              🌸 봄
            </button>
            <button
              id="bg-theme-summer-btn"
              onClick={() => {
                setActiveSeason('summer');
                setSelectedMonth(7);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentSeason === 'summer'
                  ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/20 scale-105'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/50'
              }`}
              title="여름 배경화면 (7월 기준)"
            >
              ☀️ 여름
            </button>
            <button
              id="bg-theme-autumn-btn"
              onClick={() => {
                setActiveSeason('autumn');
                setSelectedMonth(10);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentSeason === 'autumn'
                  ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20 scale-105'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50'
              }`}
              title="가을 배경화면 (10월 기준)"
            >
              🍁 가을
            </button>
            <button
              id="bg-theme-winter-btn"
              onClick={() => {
                setActiveSeason('winter');
                setSelectedMonth(1);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentSeason === 'winter'
                  ? 'bg-indigo-500 text-white shadow-xs shadow-indigo-500/20 scale-105'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/50'
              }`}
              title="겨울 배경화면 (1월 기준)"
            >
              ❄️ 겨울
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
