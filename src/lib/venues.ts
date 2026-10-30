// src/lib/venues.ts
// 運営者向け会場リストのデータ読み込みと、一覧・詳細ページで共通に使う変換。
// データは src/data/venues/*.json（1会場1ファイル）。会場を増やすときはファイルを足すだけ。

export type Layout = 'theater' | 'school' | 'ushape' | 'standing' | 'banquet';
export type VenueType = 'conference' | 'hotel' | 'exhibition' | 'hall' | 'public';

export interface Room {
  name: string;
  areaM2?: number | null;
  /** 公式が幅で示す場合は "17-31" のような文字列 */
  ceilingM?: number | string | null;
  theater?: number | null;
  school?: number | null;
  ushape?: number | null;
  standing?: number | null;
  banquet?: number | null;
  note?: string | null;
}

export interface OpsItem { text: string; source: string }
export type OpsKey = 'catering' | 'restaurants' | 'prevDaySetup' | 'waitingRooms' | 'loadingHours' | 'parking' | 'vehicleRules';

export interface Shop {
  name: string;
  brand: string;
  distanceM: number;
  walkMin: number;
  hours?: string | null;
  address?: string | null;
  verified: boolean;
  source?: string | null;
  note?: string | null;
}

export interface Venue {
  slug: string;
  nameJa: string;
  nameEn?: string;
  type: VenueType;
  area: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  officialUrl: string;
  organizerUrl?: string | null;
  bizintokyoSlug?: string | null;
  accessSummary?: string | null;
  notice?: string | { text: string; source?: string } | null;
  hours?: string | null;
  rooms: Room[];
  roomsSource?: string | null;
  ops: Partial<Record<OpsKey, OpsItem>>;
  documents?: { title: string; url: string }[];
  nearby?: {
    convenience?: Shop[];
    copyshop?: Shop[];
    hundredYen?: Shop[];
    donki?: Shop[];
  };
  drinkDelivery?: { available: boolean; note?: string } | null;
  checkedAt: string;
}

// ---- ラベル ----
export const TYPE_LABEL: Record<VenueType, string> = {
  conference: '会議・貸ホール',
  hotel: 'ホテル',
  exhibition: '展示場・アリーナ',
  hall: 'ホール・劇場',
  public: '公共施設',
};

export const LAYOUT_LABEL: Record<Layout, string> = {
  theater: 'シアター',
  school: 'スクール',
  ushape: 'ロの字',
  standing: '立食',
  banquet: '正餐',
};

export const OPS_LABEL: Record<OpsKey, string> = {
  catering: 'ケータリング・飲食の持ち込み',
  restaurants: '会場内・同じ建物の飲食店',
  prevDaySetup: '前日設営',
  waitingRooms: '控室・楽屋',
  loadingHours: '搬入・搬出',
  parking: '駐車場',
  vehicleRules: '搬入車両のルール',
};
export const OPS_ORDER: OpsKey[] = ['prevDaySetup', 'loadingHours', 'vehicleRules', 'parking', 'waitingRooms', 'catering', 'restaurants'];

// エリアは conec-tando のエリア別コラム（13本）と同じ区切り。slug はコラムの slug。
export const AREA_LABEL: Record<string, string> = {
  'marunouchi-nihonbashi-venues': '東京駅・丸の内・大手町・日本橋',
  'yurakucho-ginza-venues': '有楽町・日比谷・銀座',
  'toranomon-roppongi-venues': '虎ノ門・六本木・赤坂',
  'shimbashi-hamamatsucho-venues': '新橋・汐留・浜松町・芝公園',
  'shinagawa-venues': '品川・高輪・田町・天王洲',
  'shibuya-ebisu-venues': '渋谷・恵比寿',
  'shinjuku-venues': '新宿',
  'ikebukuro-venues': '池袋・目白',
  'kanda-suidobashi-venues': '神田・秋葉原・飯田橋・水道橋',
  'ueno-asakusa-venues': '上野・浅草',
  'odaiba-ariake-venues': 'お台場・有明',
  'yokohama-venues': '横浜',
  'chiba-venues': '千葉（幕張・舞浜）',
};
export const areaColumnPath = (area: string) => `/column/${area}/`;

// ---- 読み込み ----
const modules = import.meta.glob<{ default: Venue }>('../data/venues/*.json', { eager: true });

export function getVenues(): Venue[] {
  return Object.values(modules)
    .map((m) => m.default)
    .sort((a, b) => (maxCapacity(b)?.people ?? 0) - (maxCapacity(a)?.people ?? 0));
}

export function getVenue(slug: string): Venue | undefined {
  return getVenues().find((v) => v.slug === slug);
}

// ---- 集計 ----
const LAYOUTS: Layout[] = ['theater', 'school', 'ushape', 'standing', 'banquet'];

/** 全部屋・全レイアウトの中で最大の人数 */
export function maxCapacity(v: Venue): { people: number; layout: Layout; room: string } | null {
  let best: { people: number; layout: Layout; room: string } | null = null;
  for (const r of v.rooms ?? []) {
    for (const l of LAYOUTS) {
      const n = r[l];
      if (typeof n === 'number' && (!best || n > best.people)) best = { people: n, layout: l, room: r.name };
    }
  }
  return best;
}

/** レイアウトごとの最大人数（一覧の絞り込み用） */
export function capacityByLayout(v: Venue): Partial<Record<Layout, number>> {
  const out: Partial<Record<Layout, number>> = {};
  for (const r of v.rooms ?? []) {
    for (const l of LAYOUTS) {
      const n = r[l];
      if (typeof n === 'number' && n > (out[l] ?? 0)) out[l] = n;
    }
  }
  return out;
}

/** 一番広い部屋の面積 */
export function maxArea(v: Venue): number | null {
  let best: number | null = null;
  for (const r of v.rooms ?? []) {
    if (typeof r.areaM2 === 'number' && (best === null || r.areaM2 > best)) best = r.areaM2;
  }
  return best;
}

export const verifiedShops = (list?: Shop[]) => (list ?? []).filter((s) => s.verified);

/** 一覧ページの絞り込みに使う、会場ごとのフラグ */
export function venueFlags(v: Venue) {
  const near = (list?: Shop[], within = 10) => verifiedShops(list).some((s) => s.walkMin <= within);
  return {
    prevDaySetup: Boolean(v.ops?.prevDaySetup),
    loadingHours: Boolean(v.ops?.loadingHours),
    waitingRooms: Boolean(v.ops?.waitingRooms),
    parking: Boolean(v.ops?.parking),
    catering: Boolean(v.ops?.catering),
    copyshop10: near(v.nearby?.copyshop, 10),
    hundredYen10: near(v.nearby?.hundredYen, 10),
    donki15: near(v.nearby?.donki, 15),
    convenience5: near(v.nearby?.convenience, 5),
    drinkDelivery: Boolean(v.drinkDelivery?.available),
  };
}
export type VenueFlags = ReturnType<typeof venueFlags>;

export const FLAG_LABEL: Record<keyof VenueFlags, string> = {
  prevDaySetup: '前日設営の案内あり',
  loadingHours: '搬入・搬出の案内あり',
  waitingRooms: '控室の案内あり',
  parking: '駐車場の案内あり',
  catering: '飲食・ケータリングの案内あり',
  copyshop10: '徒歩10分以内に印刷店（キンコーズ等）',
  hundredYen10: '徒歩10分以内に100円ショップ',
  donki15: '徒歩15分以内にドン・キホーテ',
  convenience5: '徒歩5分以内にコンビニ',
  drinkDelivery: '飲料・酒の当日配達エリア',
};

export function formatNumber(n: number | string | null | undefined): string {
  if (typeof n === 'number') return n.toLocaleString('ja-JP');
  if (typeof n === 'string' && n.trim()) return n.replace('-', '〜');
  return '—';
}
