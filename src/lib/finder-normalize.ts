/**
 * 会場名検索の文字そろえ（姉妹サイト bizintokyo の src/data/finder-normalize.ts と同じ考え方。2026-11-19 に取り込み）。
 * 元の説明：会場検索（VenueFinder）の文字そろえ。ビルド側（venue-finder.ts）と画面側（VenueFinder.astro の script）で
 * 同じ関数を使う（2か所に書くとずれて、検索に当たらなくなるため）。
 * このファイルは astro:content などを読み込まない（画面側にも入るため）。
 */

/** 旧字体・異体字 → 新字体（会場名に出てくる一般的なもの。例：東京會舘 → 東京会館） */
const VARIANTS: Record<string, string> = {
  會: "会", 舘: "館", 國: "国", 學: "学", 區: "区", 驛: "駅", 濱: "浜", 廣: "広",
  澤: "沢", 齋: "斎", 齊: "斉", 髙: "高", 﨑: "崎", 邊: "辺", 邉: "辺", 圓: "円",
  體: "体", 藝: "芸", 總: "総", 實: "実", 臺: "台", 禮: "礼", 傳: "伝", 縣: "県",
};
const VARIANT_RE = new RegExp(`[${Object.keys(VARIANTS).join("")}]`, "g");

/** 検索用の正規化：全角半角をそろえ、小文字にし、カタカナをひらがなにし、旧字体を新字体にし、空白や記号を除く */
export function normalize(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(VARIANT_RE, (c) => VARIANTS[c])
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\s・･、,.'’&＆()（）!！\-‐－]/g, "");
}

/**
 * ゆるい正規化（「もしかして」を探すときだけ使う。ふつうの検索には使わない）：
 * 濁点・半濁点の有無、長音「ー」、小さい「っゃゅょ」のゆれを無視する。
 * 例：「ビックサイト」と「ビッグサイト」が同じ「ひつくさいと」になる。
 */
export function fuzzy(s: string): string {
  return normalize(s)
    .normalize("NFD")
    .replace(/[゙゚]/g, "")
    .normalize("NFC")
    .replace(/ー/g, "")
    .replace(/[ぁぃぅぇぉっゃゅょゎ]/g, (c) => "あいうえおつやゆよわ"["ぁぃぅぇぉっゃゅょゎ".indexOf(c)]);
}
