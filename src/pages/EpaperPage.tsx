import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAsyncData } from '../hooks/useAsyncData';
import { getMe } from '../api/member';
import { getIssue, getIssues } from '../api/epaper';
import AsyncPageState from '../components/AsyncPageState';

interface EpaperPageProps {
  goToCategory: (cat: string, options?: { register?: boolean }) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

function GatePrompt({ title, description, ctaLabel, onCta }: { title: string; description: string; ctaLabel: string; onCta: () => void }) {
  return (
    <div className="min-h-[100dvh] pt-[190px] md:pt-32 pb-24 flex items-center justify-center bg-theme-bg text-theme-text px-6">
      <div className="text-center max-w-md">
        <span className="inline-block font-display text-brand-red tracking-[0.3em] uppercase text-xs font-bold mb-4">全版閱讀</span>
        <h1 className="font-serif text-3xl font-black mb-4">{title}</h1>
        <p className="text-sm text-theme-text/60 mb-8 leading-relaxed">{description}</p>
        <button type="button" onClick={onCta} className="bg-brand-red text-white px-8 py-3 text-sm font-bold tracking-widest hover:bg-theme-text transition-colors">
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

// Only mounted once isLoggedIn is confirmed, so getMe() never fires for anonymous visitors.
function EpaperMemberGate({ goToCategory }: EpaperPageProps) {
  const { data: member, error: memberError, isLoading: memberLoading, reload: reloadMember } = useAsyncData(
    'epaper-member',
    (signal) => getMe({ signal }),
    null,
  );

  if (memberLoading) return <AsyncPageState />;
  if (memberError) return <AsyncPageState error={memberError} onRetry={reloadMember} />;

  const isSubscribed = member?.subscription.status === 'active';
  if (!isSubscribed) {
    return (
      <GatePrompt
        title="訂閱後即可閱讀全版"
        description="全版閱讀是付費訂戶專屬功能，訂閱基督教論壇報後即可瀏覽每期完整報紙版面。"
        ctaLabel="前往訂報"
        onCta={() => goToCategory('訂報')}
      />
    );
  }

  return <EpaperReader />;
}

// Only mounted once login + active subscription are confirmed, so issue data never loads for non-subscribers.
function EpaperReader() {
  const { data: issues, error: issuesError, isLoading: issuesLoading, reload: reloadIssues } = useAsyncData(
    'epaper-issues',
    (signal) => getIssues({ signal }),
    [],
  );

  const [selectedIssueNumber, setSelectedIssueNumber] = useState<number | null>(null);
  const [isIssuePickerOpen, setIsIssuePickerOpen] = useState(false);
  const [issueQuery, setIssueQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  useEffect(() => {
    if (selectedIssueNumber === null && issues.length > 0) {
      setSelectedIssueNumber(issues[0].issueNumber);
    }
  }, [issues, selectedIssueNumber]);

  const { data: issue, error: issueError, isLoading: issueLoading, reload: reloadIssue } = useAsyncData(
    `epaper-issue:${selectedIssueNumber}`,
    (signal) => selectedIssueNumber === null ? Promise.resolve(null) : getIssue(selectedIssueNumber, { signal }),
    null,
  );

  const changeIssue = (issueNumber: number) => {
    setSelectedIssueNumber(issueNumber);
    setPageIndex(0);
    setZoom(MIN_ZOOM);
    setIsIssuePickerOpen(false);
    setIssueQuery('');
  };

  const filteredIssues = issueQuery.trim()
    ? issues.filter((i) => String(i.issueNumber).includes(issueQuery.trim()))
    : issues;

  const submitIssueQuery = () => {
    const trimmed = issueQuery.trim();
    if (!trimmed) return;
    const exact = issues.find((i) => i.issueNumber === Number(trimmed));
    if (exact) { changeIssue(exact.issueNumber); return; }
    if (filteredIssues.length === 1) changeIssue(filteredIssues[0].issueNumber);
  };

  if (issuesLoading) return <AsyncPageState />;
  if (issuesError) return <AsyncPageState error={issuesError} onRetry={reloadIssues} />;
  if (issues.length === 0) {
    return <AsyncPageState error={new Error('目前沒有可閱讀的期數')} onRetry={reloadIssues} />;
  }
  if (issueError) return <AsyncPageState error={issueError} onRetry={reloadIssue} />;
  if (issueLoading || !issue) return <AsyncPageState />;

  const page = issue.pages[pageIndex];
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < issue.pages.length - 1;
  const canZoomOut = zoom > MIN_ZOOM;
  const canZoomIn = zoom < MAX_ZOOM;

  return (
    <div className="min-h-[100dvh] pt-[190px] md:pt-32 pb-20 bg-theme-text text-theme-bg">
      <div className="sticky top-[190px] md:top-32 z-30 bg-brand-red text-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-3 text-xs md:text-sm font-display tracking-widest">
          <div className="relative">
            <button
              type="button"
              onClick={() => { setIsIssuePickerOpen((v) => !v); setIssueQuery(''); }}
              className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              第 {issue.issueNumber} 期
              <i className={`fas fa-chevron-down text-[10px] transition-transform ${isIssuePickerOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isIssuePickerOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-theme-bg text-theme-text border border-theme-text/10 shadow-xl rounded-sm overflow-hidden z-20 normal-case tracking-normal">
                <div className="p-2 border-b border-theme-text/10">
                  <input
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    value={issueQuery}
                    onChange={(e) => setIssueQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') submitIssueQuery(); }}
                    placeholder="輸入期數"
                    className="w-full px-3 py-2 text-sm font-sans font-normal border border-theme-text/15 rounded-sm bg-theme-bg text-theme-text outline-none focus:border-brand-red transition-colors"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {filteredIssues.length > 0 ? filteredIssues.map((i) => (
                    <button
                      key={i.issueNumber}
                      type="button"
                      onClick={() => changeIssue(i.issueNumber)}
                      className={`w-full text-left px-4 py-3 text-xs md:text-sm font-bold border-b border-theme-text/5 last:border-b-0 hover:bg-brand-red/10 transition-colors cursor-pointer ${
                        i.issueNumber === issue.issueNumber ? 'bg-brand-red/10 text-brand-red' : ''
                      }`}
                    >
                      第 {i.issueNumber} 期
                    </button>
                  )) : (
                    <p className="px-4 py-3 text-xs text-theme-text/40 font-normal">找不到這個期數</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button type="button" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))} disabled={!canZoomOut} className="disabled:opacity-30 hover:opacity-80 transition-opacity cursor-pointer disabled:cursor-not-allowed" aria-label="縮小">
              <i className="fas fa-magnifying-glass-minus"></i>
            </button>
            <span className="font-bold w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))} disabled={!canZoomIn} className="disabled:opacity-30 hover:opacity-80 transition-opacity cursor-pointer disabled:cursor-not-allowed" aria-label="放大">
              <i className="fas fa-magnifying-glass-plus"></i>
            </button>

            <div className="w-px h-4 bg-white/30"></div>

            <button type="button" onClick={() => setPageIndex((i) => Math.max(0, i - 1))} disabled={!canPrev} className="disabled:opacity-30 hover:opacity-80 transition-opacity cursor-pointer disabled:cursor-not-allowed" aria-label="上一頁">
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="font-bold">{page.pageNumber} / {issue.pages.length}</span>
            <button type="button" onClick={() => setPageIndex((i) => Math.min(issue.pages.length - 1, i + 1))} disabled={!canNext} className="disabled:opacity-30 hover:opacity-80 transition-opacity cursor-pointer disabled:cursor-not-allowed" aria-label="下一頁">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_65%)]"></div>

        <div className="relative max-w-[1000px] mx-auto px-4 md:px-6 mt-10 md:mt-14 overflow-auto">
          <div className="flex justify-center" style={{ paddingBottom: zoom > 1 ? `${(zoom - 1) * 60}%` : 0 }}>
            <div className="group relative w-full transition-transform duration-300 origin-top-left" style={{ transform: `scale(${zoom})` }}>
              {/* Stacked page edges for a "physical paper" feel */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black/50 rounded-sm"></div>
              <div className="absolute inset-0 translate-x-1 translate-y-1 bg-black/30 rounded-sm"></div>

              <div
                key={page.pageNumber}
                className="relative bg-white rounded-sm overflow-hidden aspect-[1000/1675] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 animate-fade-in-up"
              >
                <img src={page.imageUrl} alt={`第 ${page.pageNumber} 頁`} className="w-full h-full object-contain" />
              </div>

              {/* Hover navigation arrows */}
              {canPrev && (
                <button
                  type="button"
                  onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                  aria-label="上一頁"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-theme-text shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-red hover:text-white cursor-pointer"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}
              {canNext && (
                <button
                  type="button"
                  onClick={() => setPageIndex((i) => Math.min(issue.pages.length - 1, i + 1))}
                  aria-label="下一頁"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 rounded-full bg-white text-theme-text shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-brand-red hover:text-white cursor-pointer"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>

          {/* Page dots */}
          <div className="flex justify-center items-center gap-2.5 mt-10 md:mt-14 pb-2">
            {issue.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => setPageIndex(idx)}
                aria-label={`第 ${p.pageNumber} 頁`}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  idx === pageIndex ? 'w-6 h-2 bg-brand-red' : 'w-2 h-2 bg-theme-bg/25 hover:bg-theme-bg/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EpaperPage({ goToCategory }: EpaperPageProps) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <GatePrompt
        title="請先登入會員"
        description="全版閱讀（電子報翻頁瀏覽）僅開放給登入會員使用，請先登入或註冊帳號。"
        ctaLabel="前往登入"
        onCta={() => goToCategory('會員中心')}
      />
    );
  }

  return <EpaperMemberGate goToCategory={goToCategory} />;
}
