import React from 'react';
import { Continent, FlightCategory, BudgetLevel } from '../types';
import { Filter, RotateCcw, Clock, Wallet, Globe, Sparkles } from 'lucide-react';

interface FilterBarProps {
  selectedContinent: Continent | 'all';
  onSelectContinent: (c: Continent | 'all') => void;
  selectedFlight: FlightCategory | 'all';
  onSelectFlight: (f: FlightCategory | 'all') => void;
  selectedBudget: BudgetLevel | 'all';
  onSelectBudget: (b: BudgetLevel | 'all') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

const CONTINENTS: (Continent | 'all')[] = ['all', '동남아', '동아시아', '유럽', '미주/하와이', '대양주'];

const POPULAR_TAGS = ['휴양지', '가성비', '가족여행', '미식', '단풍명소', '벚꽃명소', '오로라헌팅', '대자연'];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedContinent,
  onSelectContinent,
  selectedFlight,
  onSelectFlight,
  selectedBudget,
  onSelectBudget,
  selectedTag,
  onSelectTag,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const isFiltered =
    selectedContinent !== 'all' ||
    selectedFlight !== 'all' ||
    selectedBudget !== 'all' ||
    selectedTag !== null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs mb-6">
      <div className="flex flex-col gap-3.5">
        {/* Top line: Header & Counts & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-bold text-slate-800">조건별 필터</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200/60">
              추천 여행지 {filteredCount}곳
            </span>
          </div>

          {isFiltered && (
            <button
              id="filter-reset-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              필터 초기화
            </button>
          )}
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Continent Filter */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>지역/대륙</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {CONTINENTS.map((c) => (
                <button
                  key={c}
                  id={`continent-filter-${c}`}
                  onClick={() => onSelectContinent(c)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    selectedContinent === c
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? '전체' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Flight Hours Filter */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>비행시간</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                id="flight-filter-all"
                onClick={() => onSelectFlight('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedFlight === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                전체
              </button>
              <button
                id="flight-filter-short"
                onClick={() => onSelectFlight('short')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedFlight === 'short'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                단거리 (&le;4시간)
              </button>
              <button
                id="flight-filter-medium"
                onClick={() => onSelectFlight('medium')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedFlight === 'medium'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                중거리 (4~8시간)
              </button>
              <button
                id="flight-filter-long"
                onClick={() => onSelectFlight('long')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedFlight === 'long'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                장거리 (8시간+)
              </button>
            </div>
          </div>

          {/* Budget Filter */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>예산 수준</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(['all', '알뜰', '스탠다드', '프리미엄'] as const).map((b) => (
                <button
                  key={b}
                  id={`budget-filter-${b}`}
                  onClick={() => onSelectBudget(b)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    selectedBudget === b
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b === 'all' ? '전체' : b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-medium">빠른 테마:</span>
          {POPULAR_TAGS.map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                id={`tag-filter-${tag}`}
                onClick={() => onSelectTag(isTagActive ? null : tag)}
                className={`text-xs px-2.5 py-0.5 rounded-full transition-all border ${
                  isTagActive
                    ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
