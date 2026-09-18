export type Continent = '동남아' | '동아시아' | '유럽' | '미주/하와이' | '대양주' | '기타';

export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

export type SeasonCategory = '봄' | '여름' | '가을' | '겨울';

export type FlightCategory = 'short' | 'medium' | 'long'; // short <= 4h, medium 4-8h, long > 8h

export type BudgetLevel = '알뜰' | '스탠다드' | '프리미엄';

export type CostLevel = '저가' | '중간' | '고가';

export type WeatherSuitability = 'best' | 'good' | 'caution'; // 최적기 | 무난 | 비추천(우기/혹서 등)

export interface RecommendedActivities {
  sightseeing: string[]; // 관광
  activities: string[]; // 액티비티
  food: string[]; // 음식
}

export interface Destination {
  id: string;
  name: string; // 1. 여행지 이름
  nameEn: string;
  country: string;
  continent: Continent;
  seasonCategory: SeasonCategory; // 봄 | 여름 | 가을 | 겨울
  recommendedPeriod: string; // 2. 추천 시기 (예: 봄-4월~5월)
  seasonReason: string; // 3. 해당 시기에 여행하기 좋은 이유 (날씨, 축제, 이벤트 등)
  recommendedActivities: RecommendedActivities; // 4. 추천 활동 (관광, 액티비티, 음식)
  costLevel: CostLevel; // 5. 예상 경비 (저가, 중간, 고가)
  travelTip: string; // 6. 간단한 여행 팁
  bestMonths: number[]; // e.g. [1, 2, 11, 12]
  suitabilityByMonth: Record<number, WeatherSuitability>; // 1~12 month rating
  idealSeason: SeasonType;
  summary: string;
  averageTemp: string; // e.g. "23℃ ~ 28℃"
  rainfallLevel: '낮음 (건기)' | '보통 (쾌적)' | '높음 (우기 주의)';
  whyVisitNow: string; // 왜 이 시기에 가야 하는가?
  avoidMonthsInfo: string; // 피해야 하는 시기 및 이유
  flightHours: string; // e.g. "4시간 30분"
  flightCategory: FlightCategory;
  timeDiff: string; // e.g. "한국보다 2시간 느림"
  budgetLevel: BudgetLevel;
  visa: string;
  currency: string;
  tags: string[];
  highlights: { title: string; desc: string }[];
  mustEat: string[];
  clothingAdvice: string;
  recommendedDuration: string; // e.g. "3박 5일"
  imageUrl: string;
}

export interface MonthlyThemeInfo {
  month: number;
  title: string;
  subtitle: string;
  season: SeasonType;
  seasonName: string;
  holidayName?: string;
  holidayTip?: string;
  weatherOverview: string;
  travelTrends: string[];
  recommendedKeywords: string[];
}

export interface TravelMatcherFilters {
  targetMonth: number | null; // 1~12 or null
  flightCategory: FlightCategory | 'all';
  travelStyle: string | 'all';
  continent: Continent | 'all';
  budgetLevel: BudgetLevel | 'all';
  searchQuery: string;
}

export interface AiTravelItem {
  destination: string;
  country: string;
  reason: string;
  weather: string;
  highlights: string[];
  packingTip: string;
  budgetLevel: string;
}

export interface AiConsultantResponse {
  success: boolean;
  source?: string;
  recommendations?: AiTravelItem[];
  advice?: string;
  message?: string;
  rawText?: string;
  error?: string;
}

export type AiTravelResponse = AiConsultantResponse;
