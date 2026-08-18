const UNSPLASH_SRCSET_WIDTHS = [480, 768, 1080, 1600];

/**
 * Unsplash 圖片支援用 `w=` query param 動態縮放，替換掉原本寫死的寬度、
 * 產生多組候選寬度給瀏覽器依裝置實際需要挑選，避免手機也下載桌機用的 1600px 圖。
 * 非 Unsplash 網址（如 ct.org.tw CMS 圖片）沒有這個縮放 API，直接回傳 undefined。
 */
export function buildUnsplashSrcSet(url: string): string | undefined {
  if (!url.includes('images.unsplash.com')) return undefined;
  try {
    const base = new URL(url);
    return UNSPLASH_SRCSET_WIDTHS.map((w) => {
      base.searchParams.set('w', String(w));
      return `${base.toString()} ${w}w`;
    }).join(', ');
  } catch {
    return undefined;
  }
}
