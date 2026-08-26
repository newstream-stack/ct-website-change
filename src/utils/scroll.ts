/**
 * 切換頁面時回到最上方。
 *
 * `index.html` 的 <html> 帶著 `scroll-smooth`，所以 `window.scrollTo(0, 0)` 會變成動畫；
 * 新頁面掛載後高度改變會把動畫打斷，最後停在頁面中段（實測手機停在 362px、桌機 698px）。
 * 導覽一律用這個 helper 強制瞬間跳頂，頁內錨點才留給 smooth。
 */
export function scrollToTop(): void {
  const jump = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  jump();
  // 新頁面掛載後高度會變，瀏覽器的 scroll anchoring 會把位置推回去十幾 px，
  // 所以下一個 frame 再補一次。
  requestAnimationFrame(jump);
}
