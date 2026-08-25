/**
 * 文章日期顯示格式化。
 *
 * `NewsItem.date` 目前有兩種形態（見 data/news.json）：
 *   - 'APR 12'      三字母英文月份 + 日，沒有年份
 *   - '2026-03-18'  ISO 日期
 * 兩者都轉成中文的「M 月 D 日」，ISO 會另外帶出自己的年份。
 * 認不得的字串原樣回傳，避免資料換格式時整頁爆掉。
 */

const MONTH_ABBR: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

/** 資料只給月日時採用的年份。 */
export const DEFAULT_ARTICLE_YEAR = 2026;

interface FormatOptions {
  /** 是否在前面加上「YYYY 年」。預設 false，只輸出「M 月 D 日」。 */
  withYear?: boolean;
}

export function formatArticleDate(date: string, { withYear = false }: FormatOptions = {}): string {
  const raw = date.trim();

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(raw);
  if (iso) {
    const [, year, month, day] = iso;
    const md = `${Number(month)} 月 ${Number(day)} 日`;
    return withYear ? `${year} 年 ${md}` : md;
  }

  const abbr = /^([A-Za-z]{3})\s+(\d{1,2})$/.exec(raw);
  if (abbr) {
    const month = MONTH_ABBR[abbr[1].toUpperCase()];
    if (month) {
      const md = `${month} 月 ${Number(abbr[2])} 日`;
      return withYear ? `${DEFAULT_ARTICLE_YEAR} 年 ${md}` : md;
    }
  }

  return raw;
}
