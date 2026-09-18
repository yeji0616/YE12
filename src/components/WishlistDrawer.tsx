import React from 'react';
import { Destination } from '../types';
import { X, Heart, Trash2, ArrowRight, Sun, Clock } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  destinations: Destination[];
  onRemoveWishlist: (id: string) => void;
  onClearAll: () => void;
  onSelectDestination: (dest: Destination) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  destinations,
  onRemoveWishlist,
  onClearAll,
  onSelectDestination,
}) => {
  if (!isOpen) return null;

  const wishlistedDests = destinations.filter((d) => wishlistIds.includes(d.id));

  return (
    <div
      id="wishlist-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        id="wishlist-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">찜한 여행지</h3>
              <p className="text-xs text-slate-500">총 {wishlistedDests.length}곳 저장됨</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistedDests.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1"
                title="전체 비우기"
              >
                비우기
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {wishlistedDests.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-200 stroke-1" />
              <p className="text-sm font-medium text-slate-600">
                아직 찜한 여행지가 없습니다.
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                여행지 카드의 하트(♥) 아이콘을 눌러 마음에 드는 곳을 모아보고 비교해 보세요.
              </p>
            </div>
          ) : (
            wishlistedDests.map((dest) => (
              <div
                key={dest.id}
                className="group p-3 rounded-2xl border border-slate-200 hover:border-teal-400 bg-white hover:shadow-md transition-all flex items-center gap-3"
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onSelectDestination(dest);
                    onClose();
                  }}
                />

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectDestination(dest);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700">
                      {dest.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {dest.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="text-emerald-600 font-semibold">
                      {dest.bestMonths.map((m) => `${m}월`).join(', ')} 추천
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{dest.averageTemp}</span>
                    <span>·</span>
                    <span>{dest.flightHours}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => onRemoveWishlist(dest.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="찜 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectDestination(dest);
                      onClose();
                    }}
                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
                    title="상세보기"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Tip */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          찜한 여행지는 브라우저에 자동 저장되어 언제든 다시 확인하실 수 있습니다.
        </div>
      </div>
    </div>
  );
};
