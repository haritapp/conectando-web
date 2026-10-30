// src/lib/venues-i18n.ts
// 会場リストの日英対応。画面の文言・ラベル・英語データの重ね合わせをここに集める。
// 数字・URL・座標など言語に関係ないデータは src/data/venues/{slug}.json（日本語）が正本。
// 英語で書き換える文字だけを src/data/venues-en/{slug}.json に持ち、表示のときに重ねる。
import type { Venue, Layout, VenueType, OpsKey, Shop } from './venues';
import { rentable } from './venues';

export type Lang = 'ja' | 'en';

// ---- 英語データの読み込み ----
interface ShopEn { name: string; hours?: string | null; note?: string | null }
type ShopGroup = 'convenience' | 'copyshop' | 'hundredYen' | 'donki';
export interface VenueEn {
  slug: string;
  name: string;
  address: string;
  accessSummary?: string | null;
  hours?: string | null;
  notice?: string | null;
  rooms: { name: string; note?: string | null }[];
  ops: Partial<Record<OpsKey, string>>;
  documents: { title: string }[];
  nearby?: Partial<Record<ShopGroup, ShopEn[]>>;
  photoCredit?: string | null;
}
const enModules = import.meta.glob<{ default: VenueEn }>('../data/venues-en/*.json', { eager: true });
const enBySlug = new Map(Object.values(enModules).map((m) => [m.default.slug, m.default]));

const SHOP_GROUPS: ShopGroup[] = ['convenience', 'copyshop', 'hundredYen', 'donki'];
const SHOP_NOTE_VISIBLE = /横断|遠い|会場内|敷地内|同じ住所/;

/** 日本語データに英語を重ねた表示用の会場データを返す。数と並びが合わなければビルドを止める */
export function localizeVenue(v: Venue, lang: Lang): Venue {
  if (lang === 'ja') return v;
  const o = enBySlug.get(v.slug);
  if (!o) throw new Error(`[venues-en] 英語データがありません: ${v.slug}`);
  const fail = (what: string) => { throw new Error(`[venues-en] ${v.slug}: ${what} の数・キーが日本語データと合いません`); };

  if (o.rooms.length !== v.rooms.length) fail('rooms');
  const docs = v.documents ?? [];
  if (o.documents.length !== docs.length) fail('documents');
  const opsKeys = Object.keys(v.ops ?? {}).sort().join(',');
  if (Object.keys(o.ops ?? {}).sort().join(',') !== opsKeys) fail('ops');

  const nearby: Venue['nearby'] = {};
  for (const g of SHOP_GROUPS) {
    const src = v.nearby?.[g];
    if (!src) continue;
    const en = o.nearby?.[g];
    if (!en || en.length !== src.length) fail(`nearby.${g}`);
    nearby[g] = src.map((s, i): Shop => ({
      ...s,
      name: en![i].name,
      hours: en![i].hours ?? null,
      note: en![i].note ?? null,
      // 英語の文言では判定できないので、元の日本語の note で決めた結果を持たせる
      showNote: SHOP_NOTE_VISIBLE.test(s.note ?? ''),
    }));
  }

  const ops: Venue['ops'] = {};
  for (const k of Object.keys(v.ops) as OpsKey[]) ops[k] = { ...v.ops[k]!, text: o.ops[k]! };

  const notice =
    o.notice == null ? null
    : typeof v.notice === 'object' && v.notice ? { ...v.notice, text: o.notice }
    : o.notice;

  return {
    ...v,
    nameEn: o.name,
    address: o.address,
    accessSummary: o.accessSummary ?? null,
    hours: o.hours ?? null,
    notice,
    rooms: v.rooms.map((r, i) => ({ ...r, name: o.rooms[i].name, note: o.rooms[i].note ?? null, rentable: rentable(r) })),
    ops,
    documents: docs.map((d, i) => ({ ...d, title: o.documents[i].title })),
    nearby,
    photo: v.photo ? { ...v.photo, credit: o.photoCredit ?? v.photo.credit } : v.photo,
  };
}

// ---- ラベル ----
export const TYPE_LABEL_I: Record<Lang, Record<VenueType, string>> = {
  ja: { conference: '会議・貸ホール', hotel: 'ホテル', exhibition: '展示場・アリーナ', hall: 'ホール・劇場', public: '公共施設' },
  en: { conference: 'Conference center / rental hall', hotel: 'Hotel', exhibition: 'Exhibition hall / arena', hall: 'Hall / theater', public: 'Public facility' },
};

export const LAYOUT_LABEL_I: Record<Lang, Record<Layout, string>> = {
  ja: { theater: 'シアター', school: 'スクール', ushape: 'ロの字', standing: '立食', banquet: '正餐' },
  en: { theater: 'Theater', school: 'Classroom', ushape: 'Hollow square', standing: 'Standing', banquet: 'Banquet' },
};

export const OPS_LABEL_I: Record<Lang, Record<OpsKey, string>> = {
  ja: {
    catering: 'ケータリング・飲食の持ち込み',
    restaurants: '会場内・同じ建物の飲食店',
    prevDaySetup: '前日設営',
    waitingRooms: '控室・楽屋',
    loadingHours: '搬入・搬出',
    parking: '駐車場',
    vehicleRules: '搬入車両のルール',
  },
  en: {
    catering: 'Catering and outside food/drink',
    restaurants: 'Restaurants in the venue or building',
    prevDaySetup: 'Day-before setup',
    waitingRooms: 'Waiting rooms and dressing rooms',
    loadingHours: 'Load-in and load-out',
    parking: 'Parking',
    vehicleRules: 'Delivery vehicle rules',
  },
};

/** エリアは conec-tando のエリア別コラム（13本）と同じ区切り。キーは日本語コラムの slug */
export const AREA_LABEL_I: Record<Lang, Record<string, string>> = {
  ja: {
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
  },
  en: {
    'marunouchi-nihonbashi-venues': 'Tokyo Station / Marunouchi / Otemachi / Nihonbashi',
    'yurakucho-ginza-venues': 'Yurakucho / Hibiya / Ginza',
    'toranomon-roppongi-venues': 'Toranomon / Roppongi / Akasaka',
    'shimbashi-hamamatsucho-venues': 'Shimbashi / Shiodome / Hamamatsucho',
    'shinagawa-venues': 'Shinagawa / Takanawa / Tennozu',
    'shibuya-ebisu-venues': 'Shibuya / Ebisu',
    'shinjuku-venues': 'Shinjuku',
    'ikebukuro-venues': 'Ikebukuro / Mejiro',
    'kanda-suidobashi-venues': 'Kanda / Akihabara / Iidabashi / Suidobashi',
    'ueno-asakusa-venues': 'Ueno / Asakusa',
    'odaiba-ariake-venues': 'Odaiba / Ariake',
    'yokohama-venues': 'Yokohama',
    'chiba-venues': 'Chiba (Makuhari / Maihama)',
  },
};

/** 日本語エリア別コラムの slug → 英語コラムの slug（各コラムの altSlug と同じ） */
const AREA_COLUMN_EN: Record<string, string> = {
  'marunouchi-nihonbashi-venues': 'event-venues-in-tokyo-station-marunouchi-nihonbashi',
  'yurakucho-ginza-venues': 'event-venues-in-yurakucho-hibiya-ginza-tokyo',
  'toranomon-roppongi-venues': 'event-venues-in-toranomon-roppongi-akasaka-tokyo',
  'shimbashi-hamamatsucho-venues': 'event-venues-in-shimbashi-shiodome-hamamatsucho-tokyo',
  'shinagawa-venues': 'event-venues-in-shinagawa-takanawa-tennozu-tokyo',
  'shibuya-ebisu-venues': 'event-venues-in-shibuya-ebisu-tokyo',
  'shinjuku-venues': 'event-venues-in-shinjuku-tokyo',
  'ikebukuro-venues': 'event-venues-in-ikebukuro-mejiro-tokyo',
  'kanda-suidobashi-venues': 'event-venues-in-kanda-akihabara-iidabashi-suidobashi-tokyo',
  'ueno-asakusa-venues': 'event-venues-in-ueno-asakusa-tokyo',
  'odaiba-ariake-venues': 'event-venues-in-odaiba-ariake-tokyo',
  'yokohama-venues': 'event-venues-in-yokohama',
  'chiba-venues': 'event-venues-in-chiba-makuhari-maihama',
};
export const areaColumnPathI = (area: string, lang: Lang) =>
  lang === 'en' ? `/en/column/${AREA_COLUMN_EN[area]}/` : `/column/${area}/`;

export const venuesRoot = (lang: Lang) => (lang === 'en' ? '/en/venues/' : '/venues/');
export const venuePathI = (slug: string, lang: Lang) => `${venuesRoot(lang)}${slug}/`;

// ---- 数字・日付 ----
export function formatNumberI(n: number | string | null | undefined, lang: Lang): string {
  if (typeof n === 'number') return n.toLocaleString(lang === 'en' ? 'en-US' : 'ja-JP');
  if (typeof n === 'string' && n.trim()) return n.replace('-', lang === 'en' ? '–' : '〜');
  return '—';
}

const EN_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDateI(iso: string, lang: Lang): string {
  return iso.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, d) =>
    lang === 'en' ? `${EN_MONTH[Number(m) - 1]} ${Number(d)}, ${y}` : `${y}年${Number(m)}月${Number(d)}日`);
}

/** 最初の1文だけ取り出す（日本語は「。」、英語は「. 」まで） */
export function firstSentence(text: string, lang: Lang): string {
  if (lang === 'ja') return text.split('。')[0];
  const m = text.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : text;
}

// ---- 画面の文言 ----
export const UI = {
  ja: {
    home: 'ホーム', homeHref: '/', crumbAria: 'パンくず', listName: '会場リスト', listHref: '/venues/',
    // 詳細ページ
    photoAlt: (n: string) => `${n}の外観`,
    notice: 'お知らせ', noticeSource: '公式のお知らせ', noticeOpen: ' （', noticeClose: '）',
    maxCap: '最大収容', people: (n: string) => `${n}人`, capSmall: (room: string, layout: string) => `（${room}・${layout}）`,
    largestRoom: '一番広い部屋', address: '住所', station: '最寄り駅', openHours: '開館時間',
    official: '公式サイト', organizerGuide: '主催者向け案内',
    tocAria: 'このページの内容', tocRooms: '部屋と収容人数', tocDocs: '図面・料金表など公式資料', tocOps: '運営のルール', tocShops: '近くの店',
    roomCol: '部屋', areaCol: '面積（㎡）', ceilingCol: '天井高（m）',
    roomsSource: '出典：', roomsSourceTail: '（人数は会場が示す最大値。レイアウトや設備で変わります）',
    docsH2: '公式の資料（図面・料金表・規約など）', pdf: 'PDF',
    opsH2: '運営のルール（公式サイト・公式資料より）', source: '出典：', pdfMark: '（PDF）',
    checked: (d: string) => `（確認日：${d}）`,
    shopsH2: '当日困ったときに行ける近くの店',
    shopGroups: {
      copyshop: { title: '印刷店（大量・大判）', hint: 'ポスター・パネル・大量の資料はこちら。' },
      convenience: { title: 'コンビニ（マルチコピー機）', hint: '少部数の印刷、飲み物、テープ・電池など。' },
      hundredYen: { title: '100円ショップ', hint: '養生テープ、ハサミ、名札ケース、延長コード、ビニール袋など。' },
      donki: { title: 'ドン・キホーテ', hint: '夜中や当日朝の買い出しに。' },
    },
    walk: (n: number) => `徒歩${n}分`,
    shopsPending: '近くの店の情報は準備中です。',
    deliveryH3: '飲み物が足りなくなったら（当日配達）',
    deliveryIntro: (provider: string, text: string) => `この会場は${provider}の当日配達エリアです。${text}`,
    deliverySrc: '出典：',
    shopsFooter: (walkNote: string, d: string) => `${walkNote} 店名・営業時間は各社の公式店舗ページで確認しています（${d}時点）。`,
    relatedH2: 'あわせて読みたい',
    relatedArea: (a: string) => `${a}のイベント会場（エリア別まとめ）`,
    mitsumoriHref: '/column/mitsumori/', mitsumoriTitle: '見積もり、金額だけ見ていませんか？比べる時に確認したいこと',
    bizintokyo: (n: string) => `参加者向け：${n}への行き方・近くのホテル（BizinTokyo）`,
    bizintokyoBase: 'https://www.bizintokyo.com/venues/',
    back: '← 会場リストに戻る',
    detailTitle: (n: string) => `${n}｜イベント運営者向け会場情報（搬入・控室・近くの店）`,
    detailDesc: (n: string) => `${n}でイベントを運営する人向けに、部屋ごとの収容人数・広さ、搬入・前日設営・控室・駐車場の公式ルール、近くの印刷店・コンビニ・100円ショップ・ドン・キホーテをまとめました。`,
    // 一覧ページ
    listTitle: 'イベント会場リスト（運営者向け）｜東京・横浜 | Conectando',
    listDesc: '東京・横浜のイベント会場を、収容人数・広さ・エリアに加えて、搬入・前日設営・控室・駐車場の公式ルールと、近くの印刷店・100円ショップ・ドン・キホーテで探せる運営者向けリスト。',
    heroTitle: '会場リスト',
    leadHtml: 'イベントを運営する人のための会場リストです。人数・広さ・エリアで探せます。各会場のページには、図面・料金表などの公式資料、<strong>搬入・前日設営・控室・駐車場の公式ルール</strong>、当日困ったときに行ける<strong>近くの印刷店・コンビニ・100円ショップ・ドン・キホーテ</strong>をまとめています。',
    fName: '会場名', fNamePh: '例：フォーラム、ベルサール', fType: '種類', fArea: 'エリア', all: 'すべて',
    fPeople: '人数（以上）', fLayoutAria: 'レイアウト', fPeoplePh: '例：300', unitPeople: '人',
    fM2: '一番広い部屋（以上）', fM2Ph: '例：500', unitM2: '㎡', clear: '条件をクリア',
    countSuffix: ' 会場', capLayout: (layout: string) => `（${layout}）`, specMax: '最大', specRoom: '一番広い部屋', specRooms: '部屋数',
    empty: '条件に合う会場がありません。条件をゆるめてください。',
    noteHtml: '人数・広さは各会場の公式サイトの数字です。運営ルールは公式サイト・公式PDFに書かれているものだけを載せています。会場は順次追加しています。参加者向けのアクセス・ホテル情報は <a href="https://www.bizintokyo.com/" target="_blank" rel="noopener">BizinTokyo</a> にあります。',
  },
  en: {
    home: 'Home', homeHref: '/en/', crumbAria: 'Breadcrumb', listName: 'Venue list', listHref: '/en/venues/',
    photoAlt: (n: string) => `Exterior of ${n}`,
    notice: 'Notice', noticeSource: 'official notice', noticeOpen: ' (', noticeClose: ')',
    maxCap: 'Max capacity', people: (n: string) => `${n} people`, capSmall: (room: string, layout: string) => ` (${room}, ${layout})`,
    largestRoom: 'Largest room', address: 'Address', station: 'Nearest stations', openHours: 'Opening hours',
    official: 'Official website', organizerGuide: 'Guide for organizers',
    tocAria: 'On this page', tocRooms: 'Rooms and capacity', tocDocs: 'Official documents (floor plans, price lists)', tocOps: 'Operating rules', tocShops: 'Nearby shops',
    roomCol: 'Room', areaCol: 'Area (㎡)', ceilingCol: 'Ceiling (m)',
    roomsSource: 'Source: ', roomsSourceTail: ' (Capacities are the maximums the venue states; they change with layout and equipment.)',
    docsH2: 'Official documents (floor plans, price lists, terms)', pdf: 'PDF',
    opsH2: 'Operating rules (from the official website and documents)', source: 'Source: ', pdfMark: ' (PDF)',
    checked: (d: string) => ` (Checked: ${d})`,
    shopsH2: 'Nearby shops for when something goes wrong on the day',
    shopGroups: {
      copyshop: { title: 'Print shops (large volume, large format)', hint: 'For posters, panels and large print runs.' },
      convenience: { title: 'Convenience stores (multi-copy machines)', hint: 'Small print runs, drinks, tape, batteries and similar.' },
      hundredYen: { title: '100-yen shops', hint: 'Masking tape, scissors, badge holders, extension cords, plastic bags and similar.' },
      donki: { title: 'Don Quijote', hint: 'For late-night or day-of-event shopping.' },
    },
    walk: (n: number) => `${n} min walk`,
    shopsPending: 'Nearby shop information is being prepared.',
    deliveryH3: 'If you run out of drinks (same-day delivery)',
    deliveryIntro: (provider: string, text: string) => `This venue is in ${provider}'s same-day delivery area. ${text}`,
    deliverySrc: 'Source: ',
    shopsFooter: (walkNote: string, d: string) => `${walkNote} Shop names and opening hours were checked on each company's official store page (as of ${d}).`,
    relatedH2: 'Related reading',
    relatedArea: (a: string) => `Event venues in ${a} (area guide)`,
    mitsumoriHref: '/en/column/how-to-compare-event-quotes-in-tokyo/', mitsumoriTitle: 'How to Compare Event Quotes in Tokyo: Look Beyond the Price',
    bizintokyo: (n: string) => `For attendees: getting to ${n} and nearby hotels (BizinTokyo)`,
    bizintokyoBase: 'https://www.bizintokyo.com/en/venues/',
    back: '← Back to the venue list',
    detailTitle: (n: string) => `${n} | Venue information for event organizers (load-in, waiting rooms, nearby shops)`,
    detailDesc: (n: string) => `Information for organizers running an event at ${n}: capacity and size of each room, the venue's official rules on load-in, day-before setup, waiting rooms and parking, and nearby print shops, convenience stores, 100-yen shops and Don Quijote.`,
    listTitle: 'Event Venue List for Organizers | Tokyo & Yokohama | Conectando',
    listDesc: 'A venue list for event organizers in Tokyo and Yokohama: search by capacity, room size and area, with each venue’s official rules on load-in, day-before setup, waiting rooms and parking, plus nearby print shops, 100-yen shops and Don Quijote.',
    heroTitle: 'Venue List',
    leadHtml: 'A venue list for people who run events. Search by capacity, size and area. Each venue page gathers the official documents (floor plans, price lists), <strong>the venue’s official rules on load-in, day-before setup, waiting rooms and parking</strong>, and <strong>nearby print shops, convenience stores, 100-yen shops and Don Quijote</strong> you can reach when something goes wrong on the day.',
    fName: 'Venue name', fNamePh: 'e.g. Forum, Bellesalle', fType: 'Type', fArea: 'Area', all: 'All',
    fPeople: 'Capacity (at least)', fLayoutAria: 'Layout', fPeoplePh: 'e.g. 300', unitPeople: 'people',
    fM2: 'Largest room (at least)', fM2Ph: 'e.g. 500', unitM2: '㎡', clear: 'Clear filters',
    countSuffix: ' venues', capLayout: (layout: string) => ` (${layout})`, specMax: 'Max', specRoom: 'Largest room', specRooms: 'Rooms',
    empty: 'No venues match. Try loosening the filters.',
    noteHtml: 'Capacities and sizes are the figures on each venue’s official website. Operating rules are limited to what the official website and official PDFs state. Venues are added over time. For access and hotel information for attendees, see <a href="https://www.bizintokyo.com/en/" target="_blank" rel="noopener">BizinTokyo</a>.',
  },
} as const;
