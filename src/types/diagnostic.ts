export type DiagnosticAnswer = {
  id: string;
  label: string;
  value: string;
  active: boolean;
  displayOrder: number;
  recommendedServiceSlug?: string;
  recommendationWeight: number;
};

export type DiagnosticStep = {
  id: string;
  key: string;
  question: string;
  description?: string | null;
  active: boolean;
  displayOrder: number;
  answers: DiagnosticAnswer[];
};

export type DiagnosticSubmissionResult = {
  id: string;
  recommendedServiceSlug?: string;
};

export type DiagnosticDecisionCount = {
  value: string;
  count: number;
};

export type DiagnosticAnalytics = {
  totalSubmissions: number;
  answersByStep: Record<string, DiagnosticDecisionCount[]>;
};
