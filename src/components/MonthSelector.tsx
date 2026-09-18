import React from 'react';
import { SeasonType } from '../types';
import { Sun, CloudSun, CloudRain, Snowflake, Flower2, Leaf } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: number;
  onSelectMonth: (month: number) => void;
  activeSeason: SeasonType | 'all';
  onSelectSeason: (season: SeasonType | 'all') => void;
  currentSeason?: SeasonType;
}

const MONTH_DATA = [
  { m: 1, name: '1월', season: 'winter' as SeasonType, tag: '설날/건기', emoji: '❄️', highlight: '동남아 건기 & 설경' },
  { m: 2, name: '2월', season: 'winter' as SeasonType, tag: '봄방학', emoji: '🏔️', highlight: '오로라 & 괌/다낭' },
  { m: 3, name: '3월', season: 'spring' as SeasonType, tag: '봄꽃개화', emoji: '🌸', highlight: '대만 & 남유럽의 봄' },
  { m: 4, name: '4월', season: 'spring' as SeasonType, tag: '벚꽃절정', emoji: '🌷', highlight: '일본 벚꽃 & 유럽 튤립' },
  { m: 5, name: '5월', season: 'spring' as SeasonType, tag: '황금연휴', emoji: '🌿', highlight: '파리·런던 & 발리 건기' },
  { m: 6, name: '6월', season: 'summer' as SeasonType, tag: '초원/알프스', emoji: '🏕️', highlight: '몽골 은하수 & 스위스' },
  { m: 7, name: '7월', season: 'summer' as SeasonType, tag: '여름휴가', emoji: '🌊', highlight: '발리 건기 & 캐나다 로키' },
  { m: 8, name: '8월', season: 'summer' as SeasonType, tag: '피서절정', emoji: '🍉', highlight: '시원한 삿포로 & 알프스' },
  { m: 9, name: '9월', season: 'autumn' as SeasonType, tag: '추석연휴', emoji: '🍂', highlight: '선선한 남유럽 & 체코' },
  { m: 10, name: '10월', season: 'autumn' as SeasonType, tag: '단풍로드', emoji: '🍁', highlight: '캐나다 메이플 & 카파도키아' },
  { m: 11, name: '11월', season: 'autumn' as SeasonType, tag: '등불축제', emoji: '🏮', highlight: '치앙마이 & 푸꾸옥 건기' },
  { m: 12, name: '12월', season: 'winter' as SeasonType, tag: '연말/크리스마스', emoji: '🎄', highlight: '유럽 마켓 & 호주 여름' },
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onSelectMonth,
  activeSeason,
  onSelectSeason,
  currentSeason,
}) => {
  const seasonLabels: Record<SeasonType, { name: string; emoji: string; color: string }> = {
    spring: { name: '봄 테마', emoji: '🌸', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    summer: { name: '여름 테마', emoji: '☀️', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    autumn: { name: '가을 테마', emoji: '🍁', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    winter: { name: '겨울 테마', emoji: '❄️', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  };

  const activeTheme = currentSeason ? seasonLabels[currentSeason] : null;

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Season Quick Filters */}
        <div className="flex items-center justify-between gap-2 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
              계절별 바로가기:
            </span>
            <button
              id="season-filter-all"
              onClick={() => onSelectSeason('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSeason === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체 보기
            </button>
            <button
              id="season-filter-spring"
              onClick={() => {
                onSelectSeason('spring');
                onSelectMonth(4);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSeason === 'spring'
                  ? 'bg-pink-500 text-white shadow-xs shadow-pink-500/20'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              <Flower2 className="w-3.5 h-3.5" />
              봄 (3~5월)
            </button>
            <button
              id="season-filter-summer"
              onClick={() => {
                onSelectSeason('summer');
                onSelectMonth(7);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSeason === 'summer'
                  ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              여름 (6~8월)
            </button>
            <button
              id="season-filter-autumn"
              onClick={() => {
                onSelectSeason('autumn');
                onSelectMonth(10);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSeason === 'autumn'
                  ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              가을 (9~11월)
            </button>
            <button
              id="season-filter-winter"
              onClick={() => {
                onSelectSeason('winter');
                onSelectMonth(1);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSeason === 'winter'
                  ? 'bg-sky-600 text-white shadow-xs shadow-sky-600/20'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" />
              겨울 (12~2월)
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTheme && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${activeTheme.color} shadow-xs`}
                title="계절별 배경화면 테마가 자동 적용 중입니다"
              >
                <span>🎨 배경:</span>
                <span>{activeTheme.emoji} {activeTheme.name}</span>
              </span>
            )}
            <span className="text-xs text-slate-400 hidden xl:inline">
              (월별 클릭 시 배경색 자동 전환)
            </span>
          </div>
        </div>

        {/* 12-Month Interactive Ribbon */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2">
          {MONTH_DATA.map((item) => {
            const isSelected = selectedMonth === item.m;
            const isSpring = item.season === 'spring';

            return (
              <button
                key={item.m}
                id={`month-selector-btn-${item.m}`}
                onClick={() => {
                  onSelectMonth(item.m);
                  onSelectSeason(item.season);
                }}
                className={`group relative flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? isSpring
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/25 scale-[1.03] z-10'
                      : 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-700/20 scale-[1.03] z-10'
                    : isSpring
                    ? 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-pink-300 text-slate-700'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200/80 hover:border-teal-300 text-slate-700'
                }`}
              >
                {/* Top Emoji & Month Name */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs">{item.emoji}</span>
                  <span
                    className={`text-sm font-bold tracking-tight ${
                      isSelected
                        ? 'text-white'
                        : isSpring
                        ? 'text-slate-800 group-hover:text-pink-600'
                        : 'text-slate-800 group-hover:text-teal-600'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Tag Pill */}
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate max-w-full leading-tight ${
                    isSelected
                      ? 'bg-white/20 text-white font-semibold'
                      : isSpring
                      ? 'bg-slate-200/60 text-slate-600 group-hover:bg-pink-50 group-hover:text-pink-700'
                      : 'bg-slate-200/60 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700'
                  }`}
                >
                  {item.tag}
                </span>

                {/* Indicator dot */}
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
