import React, { useState } from 'react';
import { Destination, Continent } from '../types';
import { X, Calendar, Search, Filter, Info, ChevronRight } from 'lucide-react';

interface CalendarMatrixModalProps {
  destinations: Destination[];
  onClose: () => void;
  onSelectDestination: (dest: Destination) => void;
}

export const CalendarMatrixModal: React.FC<CalendarMatrixModalProps> = ({
  destinations,
  onClose,
  onSelectDestination,
}) => {
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = destinations.filter((dest) => {
    const matchesContinent = selectedContinent === 'all' || dest.continent === selectedContinent;
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  return (
    <div
      id="calendar-matrix-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        id="calendar-matrix-modal-content"
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                12개월 연간 해외여행지 최적기 매트릭스
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                1년 365일 언제 떠나도 실패 없는 전 세계 여행지 건기 & 최적기 한눈에 보기
              </p>
            </div>
          </div>

          <button
            id="matrix-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend & Filter Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Continent selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['all', '동남아', '동아시아', '유럽', '미주/하와이', '대양주'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedContinent(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  selectedContinent === c
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c === 'all' ? '전체 대륙' : c}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 inline-block" /> 최적기 (건기/황금기)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 inline-block" /> 보통 (여행 가능)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-sm bg-slate-200 inline-block" /> 주의 (우기/비수기)
            </span>
          </div>
        </div>

        {/* Table Content (Scrollable) */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-xs font-bold text-slate-700 bg-slate-100/80 sticky top-0 z-10">
                <th className="py-3 px-3 min-w-[180px]">여행지 (국가 / 대륙)</th>
                <th className="py-3 px-2 text-center text-slate-500 font-medium w-16">비행</th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <th key={m} className="py-3 px-1.5 text-center min-w-[44px]">
                    {m}월
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((dest) => (
                <tr
                  key={dest.id}
                  onClick={() => onSelectDestination(dest)}
                  className="hover:bg-teal-50/50 cursor-pointer transition-colors group"
                >
                  {/* Destination Info */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 group-hover:text-teal-700 flex items-center gap-1.5">
                      <span>{dest.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        dest.seasonCategory === '봄'
                          ? 'bg-pink-100 text-pink-800'
                          : dest.seasonCategory === '여름'
                          ? 'bg-amber-100 text-amber-800'
                          : dest.seasonCategory === '가을'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {dest.seasonCategory}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span>{dest.country}</span>
                      <span>·</span>
                      <span className="text-teal-800 font-medium">{dest.recommendedPeriod}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">경비: {dest.costLevel}</span>
                    </div>
                  </td>

                  {/* Flight */}
                  <td className="py-2.5 px-2 text-center text-[11px] text-slate-500 whitespace-nowrap">
                    {dest.flightHours.split(' ')[0]}
                  </td>

                  {/* 12 Months Cells */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                    const status = dest.suitabilityByMonth[m];
                    let cellBg = 'bg-slate-100 text-slate-400';
                    let text = '—';
                    if (status === 'best') {
                      cellBg = 'bg-emerald-500 text-white font-bold shadow-xs';
                      text = '★';
                    } else if (status === 'good') {
                      cellBg = 'bg-amber-300 text-amber-950 font-medium';
                      text = '●';
                    }

                    return (
                      <td key={m} className="py-2 px-1 text-center">
                        <div
                          className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center text-[11px] transition-transform hover:scale-125 ${cellBg}`}
                          title={`${dest.name} ${m}월: ${status === 'best' ? '최적기' : status === 'good' ? '여행 가능' : '비추천/우기'}`}
                        >
                          {text}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
          <span>* 목록에서 여행지를 클릭하면 상세 기후 가이드와 추천 코스를 확인할 수 있습니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg text-xs hover:bg-slate-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
