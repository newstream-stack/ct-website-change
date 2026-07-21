export interface EpaperPage {
  pageNumber: number;
  imageUrl: string;
}

export interface EpaperIssueSummary {
  issueNumber: number;
  dateLabel: string;
}

export interface EpaperIssue extends EpaperIssueSummary {
  pages: EpaperPage[];
}
