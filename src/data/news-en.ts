// src/data/news-en.ts
// 元サイト（conec-tando.com）英語版の「お知らせ」を新しい順にすべて収録した唯一のデータソース。
// 英語版お知らせ一覧ページ・英語版トップページのNEWS欄はここから生成する。

export type NewsItemEN = {
  /** ISO 8601 (yyyy-mm-dd) */
  date: string;
  badge: 'CORPORATE' | 'note UPDATE' | 'CASE STUDY';
  title: string;
  href: string | null;
  external: boolean;
};

export const newsItemsEN: NewsItemEN[] = [
  {
    date: '2025-11-07',
    badge: 'note UPDATE',
    title: '"Rice Capital Fukuyama × Globis Takamiya | The Realities of Startup Founding: Insights from U.S. Entrepreneurship, Y Combinator Selection, and M&A" has been released.',
    href: 'https://note.com/firstfollowers/n/ndfa752c7b6bb',
    external: true,
  },
  {
    date: '2025-10-29',
    badge: 'note UPDATE',
    title: '"Learning from LayerX Executives: The Playbook Required for Management Teams in the AI Era." has been released.',
    href: 'https://note.com/firstfollowers/n/n461becdd12b9',
    external: true,
  },
  {
    date: '2025-10-24',
    badge: 'note UPDATE',
    title: '"Behind the Scenes: Growing the Product and Business as Co-Founder/CTO" has been released.',
    href: 'https://note.com/firstfollowers/n/n03e8dd67f5b6',
    external: true,
  },
  {
    date: '2025-10-21',
    badge: 'note UPDATE',
    title: '"Maximizing Tokyo\'s Startup Support! 5 Steps You Can Start Today" has been released.',
    href: 'https://note.com/firstfollowers/n/ne557ec584591',
    external: true,
  },
  {
    date: '2025-10-01',
    badge: 'note UPDATE',
    title: '"When in doubt, go with these! 11 Essential Books to Build Your Startup Foundation" has been released.',
    href: 'https://note.com/firstfollowers/n/n4a66a42a94af',
    external: true,
  },
  {
    date: '2025-09-26',
    badge: 'note UPDATE',
    title: '"15 Media Outlets Perfect for Startup Research!" has been released.',
    href: 'https://note.com/firstfollowers/n/n20adf9ac2bcd',
    external: true,
  },
  {
    date: '2025-09-03',
    badge: 'note UPDATE',
    title: '"TORYUMON ZERO supported by First Followers: An Entrepreneur Support Program for Teams in the Early and Mid-Startup Phases" has been released.',
    href: 'https://note.com/firstfollowers/n/n092036053d2a',
    external: true,
  },
  {
    date: '2025-08-18',
    badge: 'CASE STUDY',
    title: 'We implemented "Solana Super Tokyo - Main Conference"',
    href: '/en/case/detail/solanasupertokyo',
    external: false,
  },
  {
    date: '2025-07-25',
    badge: 'note UPDATE',
    title: '"First Followers SEMINAR: Learning from CFOs and COOs—Core Management Skills and Career Strategies" has been released.',
    href: 'https://note.com/firstfollowers/n/n4803d0420531',
    external: true,
  },
  {
    date: '2025-07-22',
    badge: 'note UPDATE',
    title: '"6 Key Points to Minimize Mistakes When Switching to a Startup" has been released.',
    href: 'https://note.com/firstfollowers/n/na28e5845cb64',
    external: true,
  },
  {
    date: '2025-07-17',
    badge: 'note UPDATE',
    title: '"First Followers SEMINAR [Management Techniques for Startups] Recruitment Models for Growing Small, Elite Teams" has been released.',
    href: 'https://note.com/firstfollowers/n/n92c833c0c0a7',
    external: true,
  },
  {
    date: '2025-07-07',
    badge: 'CASE STUDY',
    title: 'We implemented "Gate to India & Africa 2025"',
    href: '/en/case/detail/gatetoindiaafrica2025',
    external: false,
  },
  {
    date: '2025-07-04',
    badge: 'CASE STUDY',
    title: 'We implemented "【India & Africa】Entrepreneur and Investor Networking Event: Experience the Momentum of the Global South in Kyoto"',
    href: '/en/case/detail/indoafrica2025',
    external: false,
  },
  {
    date: '2025-05-09',
    badge: 'CASE STUDY',
    title: 'We implemented "New York Silicon Alley Meetup #11"',
    href: '/en/case/detail/newyorksiliconalley',
    external: false,
  },
  {
    date: '2025-05-08',
    badge: 'CASE STUDY',
    title: 'We implemented "New York Silicon Alley Meetup #12"',
    href: '/en/case/detail/newyorksiliconalley12',
    external: false,
  },
  {
    date: '2025-01-24',
    badge: 'CORPORATE',
    title: 'Announcement of Ambassador Appointment for SusHi Tech Tokyo 2025',
    href: '/en/news/sushitech-tokyo-2025-ambassador',
    external: false,
  },
  {
    date: '2024-07-09',
    badge: 'CASE STUDY',
    title: 'We implemented "Gate to India & Africa 2024"',
    href: '/en/case/detail/gatetoindiaafrica',
    external: false,
  },
  {
    date: '2024-05-14',
    badge: 'CASE STUDY',
    title: 'We implemented "Startup Diversity Day"',
    href: '/en/case/detail/startupdiversityday',
    external: false,
  },
  {
    date: '2024-04-01',
    badge: 'CORPORATE',
    title: 'Welcome to Conectando\'s Official Website',
    href: '/en/news/site-open',
    external: false,
  },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** 'November 7, 2025' 形式（お知らせ一覧ページ用） */
export function formatNewsDateEN(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

/** '2025.11.07' 形式（トップページNEWS欄用） */
export function formatNewsDateDotEN(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}.${pad2(m)}.${pad2(d)}`;
}
