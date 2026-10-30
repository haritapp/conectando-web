// 会場リスト共通の説明文（公式サイトで確認した事実だけ。確認日を書く）
export const COMMON = {
  konbiniPrint: {
    text: 'セブン‑イレブン・ファミリーマート・ローソンは店内のマルチコピー機でPDFや写真を印刷できます（コピー機が無い店舗もあります）。急ぎの少部数はまずコンビニへ。',
    sources: [
      { title: 'セブン‑イレブン マルチコピー機', url: 'https://www.sej.co.jp/services/multicopy.html' },
      { title: 'ファミリーマート マルチコピー機', url: 'https://www.family.co.jp/services/print.html' },
      { title: 'ローソン マルチコピー機', url: 'https://www.lawson.co.jp/service/others/multicopy/' },
    ],
    checkedAt: '2026-10-30',
  },
  drinkDelivery: {
    provider: 'カクヤス',
    text: 'なんでも酒やカクヤスの「店舗からのお届け」は東京23区全域と横浜市西区全域が当日配達エリア（送料無料）。配達時間帯は10〜22時の1時間ごと（30分前締切、店舗により9時台も可）。お酒だけでなくお茶などのソフトドリンクも扱っています。',
    sources: [
      { title: 'カクヤス 店舗からのお届けエリア', url: 'https://www.kakuyasu.co.jp/area/index.html' },
      { title: 'カクヤス お届け日・時間', url: 'https://www.kakuyasu.co.jp/guide/guide_delivery_dateandtime/index.html' },
    ],
    checkedAt: '2026-10-30',
  },
  walkNote: '徒歩分は会場との直線距離を分速80mで割った目安です（実際の道のりはこれより長くなります）。',
  opsNote: '運営のルールは各会場の公式サイト・公式PDFに書かれている内容だけを載せています（確認日は各ページに記載）。載っていない項目は公式サイトに記載が見つからなかったものです。利用前に必ず会場に確認してください。',
};
