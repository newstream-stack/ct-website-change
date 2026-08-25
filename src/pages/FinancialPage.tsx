import { useState } from 'react';

interface ReportSection {
  year: string;
  label: string;
  type: 'budget' | 'final';
  images: string[];
}

const B = 'https://ct.org.tw/upload/static_cooperation_cms';
const p = (name: string, pages: number[]) =>
  pages.map((n) => `${B}/${name}_%E9%A0%81%E9%9D%A2_${n}.jpg`);

const REPORTS: ReportSection[] = [
  {
    year: '民國 115 年',
    label: '預算及工作計劃書',
    type: 'budget',
    images: p('doc02919420260409111050', [1, 2]),
  },
  {
    year: '民國 114 年',
    label: '預算及工作計劃書',
    type: 'budget',
    images: p('doc02356520251107104327', [1, 2]),
  },
  {
    year: '民國 113 年',
    label: '結算財務報表',
    type: 'final',
    images: p('doc02356420251107104241', [1, 2, 3, 4, 5]),
  },
  {
    year: '民國 113 年',
    label: '預算財務報表',
    type: 'budget',
    images: p('doc02356720251107112229', [1, 2, 3, 4, 5]),
  },
  {
    year: '民國 112 年',
    label: '結算財務報表',
    type: 'final',
    images: p('202306160847-1', [1, 2, 3, 4, 5]),
  },
  {
    year: '民國 112 年',
    label: '預算財務報表',
    type: 'budget',
    images: p('2024%E9%A0%90%E7%AE%97%E8%B2%A1%E5%A0%B1', [1, 2]),
  },
  {
    year: '民國 111 年',
    label: '結算財務報表',
    type: 'final',
    images: p('202207051142', [1, 2, 3, 4, 5]),
  },
  {
    year: '民國 111 年',
    label: '預算財務報表',
    type: 'budget',
    images: p('2023%E5%B9%B4%E8%AB%96%E5%A3%87%E9%A0%90%E7%AE%97', [2]),
  },
  {
    year: '民國 110 年',
    label: '結算財務報表',
    type: 'final',
    images: p('202202251037', [1, 2, 3]),
  },
  {
    year: '民國 110 年',
    label: '預算財務報表',
    type: 'budget',
    images: p('202202180951', [1, 2]),
  },
  {
    year: '民國 109 年',
    label: '預算財務報表',
    type: 'budget',
    images: p('202109021550', [1, 2, 3, 4]),
  },
];

function ReportBlock({ report }: { report: ReportSection }) {
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="border border-theme-text/10">
      {/* Header row */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-theme-text/3 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <span className={`font-display text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 ${report.type === 'final' ? 'bg-brand-red/15 text-brand-red' : 'bg-theme-text/8 text-theme-text/50'}`}>
            {report.type === 'final' ? '結算' : '預算'}
          </span>
          <div>
            <span className="font-display text-xs tracking-widest text-theme-text/40 mr-3">{report.year}</span>
            <span className="font-serif text-sm md:text-base font-bold tracking-wider">{report.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-theme-text/30 text-xs">{report.images.length} 頁</span>
          <i className={`fas fa-chevron-down text-theme-text/30 text-xs transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Image grid */}
      {open && (
        <div className="px-5 pb-5 border-t border-theme-text/8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-5">
            {report.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setLightbox(src)}
                className="group relative aspect-[3/4] overflow-hidden bg-theme-text/5 border border-theme-text/8 hover:border-brand-red/50 transition-colors"
              >
                <img
                  src={src}
                  alt={`${report.year} ${report.label} 第 ${i + 1} 頁`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <i className="fas fa-expand text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="absolute bottom-1.5 right-2 font-display text-[10px] text-white/70 bg-black/40 px-1">
                  P{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <i className="fas fa-times text-xl" />
          </button>
          <img
            src={lightbox}
            alt=""
            decoding="async"
            className="max-w-full max-h-[90dvh] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default function FinancialPage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-5 md:px-10">

        {/* Hero */}
        <div className="mb-14 md:mb-20">
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-widest leading-tight mb-5">
            財務報表
          </h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            財團法人基督教論壇基金會依法公開歷年預算及結算財務報表，以示財務透明。
          </p>
        </div>

        {/* Report list */}
        <div className="flex flex-col gap-2">
          {REPORTS.map((r) => (
            <ReportBlock key={`${r.year}-${r.label}`} report={r} />
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-theme-text/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-theme-text/30">
          <span>財團法人基督教論壇基金會｜統一編號 00965377</span>
          <span className="font-display tracking-widest uppercase">Christian Tribune Foundation</span>
        </div>
      </div>
    </div>
  );
}
