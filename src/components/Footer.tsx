const NAV_LINKS = [
  '關於我們', '新聞連絡', '我要投稿', '廣告刊登', '申請合作',
  '客戶服務', '招募夥伴', '版權隱私權聲明', '財務報表', '祝福卡申辦/捐款',
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/60 text-sm">
      {/* 導覽列 */}
      <div className="border-b border-white/10 px-6 py-5">
        <nav className="max-w-6xl mx-auto flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {/* 社群 + 法人資訊 */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 左：社群 icon */}
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <i className="fab fa-instagram text-base"></i>
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <i className="fab fa-facebook-f text-base"></i>
            </a>
            <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <i className="fab fa-youtube text-base"></i>
            </a>
          </div>

          {/* 中：Line 貼圖 */}
          <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
            論壇Line貼圖
          </a>

          {/* 右：法人資訊 */}
          <div className="text-right text-xs leading-relaxed text-white/40">
            <p>財團法人基督教論壇基金會</p>
            <p>統一編號：00965377</p>
          </div>
        </div>
      </div>

      {/* 版權 */}
      <div className="px-6 py-4 text-center text-xs text-white/30">
        © 2026 基督教論壇報 All Rights Reserved. 版權所有 盜用必究
      </div>
    </footer>
  );
}
