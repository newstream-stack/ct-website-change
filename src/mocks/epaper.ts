import type { EpaperIssue } from '../types/epaper';

// Mock-only placeholder art. Real (paid) epaper page images must never ship as
// static assets under public/ — they must come from an authenticated backend
// endpoint that checks login + subscription status server-side, since the
// member/subscription gate in EpaperPage is a UI-only convenience and cannot
// stop someone who guesses or shares the image URL directly.
const PLACEHOLDER_PAGE_IMAGES = [
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1470549638415-0a0755be0619?auto=format&fit=crop&q=80&w=1400',
];

const ISSUE_NUMBERS = [4868, 4867, 4866, 4865, 4864, 4863, 4862, 4861, 4860, 4859, 4858, 4857];

export const MOCK_EPAPER_ISSUES: EpaperIssue[] = ISSUE_NUMBERS.map((issueNumber, i) => ({
  issueNumber,
  dateLabel: `第 ${issueNumber} 期`,
  pages: PLACEHOLDER_PAGE_IMAGES.map((imageUrl, p) => ({ pageNumber: p + 1, imageUrl: `${imageUrl}&sig=${i}` })),
}));
