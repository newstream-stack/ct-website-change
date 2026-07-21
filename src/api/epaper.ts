import type { EpaperIssue, EpaperIssueSummary } from '../types/epaper';
import { MOCK_EPAPER_ISSUES } from '../mocks/epaper';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isEpaperIssue, isEpaperIssueSummaries } from './validators';

// GET /api/epaper/issues
export async function getIssues(options?: ApiRequestOptions): Promise<EpaperIssueSummary[]> {
  if (!USE_MOCK_API) {
    return assertApiData(await apiGet<unknown>('/api/epaper/issues', options), isEpaperIssueSummaries, '全版閱讀期數');
  }
  return MOCK_EPAPER_ISSUES.map(({ issueNumber, dateLabel }) => ({ issueNumber, dateLabel }));
}

// GET /api/epaper/issues/{issueNumber}
export async function getIssue(issueNumber: number, options?: ApiRequestOptions): Promise<EpaperIssue> {
  if (!USE_MOCK_API) {
    return assertApiData(await apiGet<unknown>(`/api/epaper/issues/${issueNumber}`, options), isEpaperIssue, '全版閱讀');
  }
  const issue = MOCK_EPAPER_ISSUES.find((i) => i.issueNumber === issueNumber);
  if (!issue) throw new Error('找不到這一期');
  return issue;
}
