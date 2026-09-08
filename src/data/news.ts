// src/data/news.ts
// 元サイト（conec-tando.com）の「お知らせ」を新しい順にすべて収録した唯一のデータソース。
// お知らせ一覧ページ・トップページのNEWS欄はここから生成する。

export type NewsItem = {
  /** ISO 8601 (yyyy-mm-dd) */
  date: string;
  badge: 'コーポレート' | 'note更新' | 'ケーススタディ' | 'コラム';
  title: string;
  /** リンク先。存在しない場合はnull（本文・リンク先とも確認できなかった項目） */
  href: string | null;
  external: boolean;
};

export const newsItems: NewsItem[] = [
  {
    date: '2026-03-13',
    badge: 'コーポレート',
    title: '東京のビジネスイベント情報メディア「BizinTokyo」を開設しました',
    href: '/news/bizintokyo',
    external: false,
  },
  {
    date: '2025-11-07',
    badge: 'note更新',
    title: '“Rice Capital Fukuyama × Globis Takamiya | 「Rice Capital福山×グロービス高宮 | 米国起業、Yコン採択、M&Aを経て感じたスタートアップ創業のリアル」を公開しました',
    href: 'https://note.com/firstfollowers/n/ndfa752c7b6bb',
    external: true,
  },
  {
    date: '2025-10-29',
    badge: 'note更新',
    title: '「エンジニアから執行役員になって変わった役割。LayerXが語る、AI時代の経営プレイブック」を公開しました',
    href: 'https://note.com/firstfollowers/n/n461becdd12b9',
    external: true,
  },
  {
    date: '2025-10-24',
    badge: 'note更新',
    title: '「スタートアップの成長にあわせて、役割はどんどん変えていく。ログラス × Luupの、CTO兼共同創業者のキャリア論」を公開しました',
    href: 'https://note.com/firstfollowers/n/n03e8dd67f5b6',
    external: true,
  },
  {
    date: '2025-10-21',
    badge: 'note更新',
    title: '「東京都の起業支援をフル活用！今日からできる5ステップ」を公開しました',
    href: 'https://note.com/firstfollowers/n/ne557ec584591',
    external: true,
  },
  {
    date: '2025-10-01',
    badge: 'note更新',
    title: '「迷ったらこれ！スタートアップの基礎を固める11冊」を公開しました',
    href: 'https://note.com/firstfollowers/n/n4a66a42a94af',
    external: true,
  },
  {
    date: '2025-09-26',
    badge: 'note更新',
    title: '「スタートアップ情報収集に最適！メディア15選」を公開しました',
    href: 'https://note.com/firstfollowers/n/n20adf9ac2bcd',
    external: true,
  },
  {
    date: '2025-09-03',
    badge: 'note更新',
    title: '「創業前後期のチームに特化したU25起業家支援プログラム『TORYUMON ZERO supported by First Followers』とは」を公開しました',
    href: 'https://note.com/firstfollowers/n/n092036053d2a',
    external: true,
  },
  {
    date: '2025-07-25',
    badge: 'note更新',
    title: '「肩書きは後から付けても、変えてもいい スタートアップCxOへの転職論」を公開しました',
    href: 'https://note.com/firstfollowers/n/n4803d0420531',
    external: true,
  },
  {
    date: '2025-07-22',
    badge: 'note更新',
    title: '「スタートアップ転職で失敗を減らす『6つの接点』」を公開しました',
    href: 'https://note.com/firstfollowers/n/na28e5845cb64',
    external: true,
  },
  {
    date: '2025-07-17',
    badge: 'note更新',
    title: '「（イベントレポート）【スタートアップで使えるマネジメントの技術】少数精鋭のチームを成長させる採用の型」を公開しました',
    href: 'https://note.com/firstfollowers/n/n92c833c0c0a7',
    external: true,
  },
  {
    date: '2025-07-07',
    badge: 'ケーススタディ',
    title: '「Gate to India & Africa 2025」を実施しました',
    href: '/case/detail/gatetoindiaafrica2025',
    external: false,
  },
  {
    date: '2025-07-04',
    badge: 'ケーススタディ',
    title: '「【インド・アフリカ】起業家・投資家交流会 ～京都で感じるグローバルサウスの勢い～」を実施しました',
    href: '/case/detail/indoafrica2025',
    external: false,
  },
  {
    date: '2025-05-08',
    badge: 'ケーススタディ',
    title: '「New York Silicon Alley Meetup #12」を実施しました',
    href: '/case/detail/newyorksiliconalley12',
    external: false,
  },
  {
    date: '2025-01-24',
    badge: 'コーポレート',
    title: '「SusHi Tech Tokyo 2025」のアンバサダー就任',
    href: '/news/sushitech-tokyo-2025-ambassador',
    external: false,
  },
  {
    date: '2024-09-12',
    badge: 'コーポレート',
    title: 'Conectando サイトオープンのお知らせ',
    href: '/news/site-open',
    external: false,
  },
  {
    date: '2024-08-18',
    badge: 'ケーススタディ',
    title: '「Solana Super Tokyo - Main Conference」を実施しました',
    href: '/case/detail/solanasupertokyo',
    external: false,
  },
  {
    date: '2024-07-09',
    badge: 'ケーススタディ',
    title: '「Gate to India & Africa 2024」を実施しました',
    href: '/case/detail/gatetoindiaafrica',
    external: false,
  },
  {
    date: '2024-05-14',
    badge: 'ケーススタディ',
    title: '「Startup Diversity Day」を実施しました',
    href: '/case/detail/startupdiversityday',
    external: false,
  },
  {
    date: '2024-05-09',
    badge: 'ケーススタディ',
    title: '「New York Silicon Alley Meetup #11」を実施しました',
    href: '/case/detail/newyorksiliconalley',
    external: false,
  },
];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** '2026年3月13日' 形式（お知らせ一覧ページ用） */
export function formatNewsDateJP(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}年${m}月${d}日`;
}

/** '2026.03.13' 形式（トップページNEWS欄用） */
export function formatNewsDateDot(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}.${pad2(m)}.${pad2(d)}`;
}
