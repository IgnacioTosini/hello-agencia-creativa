import type { InquirySource, InquiryStatus } from "./inquiry-enums";

export type InquiryFormData = {
  name: string;
  email: string;
  whatsapp: string;
  brandName: string;
  serviceSlug: string;
  budget: string;
  message: string;
  source: InquirySource;
  recommendedServiceSlug?: string;
  diagnosticNeed?: string;
  diagnosticSituation?: string;
  diagnosticBusiness?: string;
  diagnosticAnswers?: Record<string, string>;
  diagnosticSubmissionId?: string;
};

export type InquiryServiceSummary = {
  id: string;
  name: string;
  slug: string;
};

export type InquiryViewModel = {
  id: string;
  name: string;
  email: string;
  whatsapp?: string | null;
  brandName?: string | null;
  message?: string | null;
  budget?: string | null;
  status: InquiryStatus;
  source: InquirySource;
  diagnosticNeed?: string | null;
  diagnosticSituation?: string | null;
  diagnosticBusiness?: string | null;
  diagnosticAnswers?: Record<string, string> | null;
  diagnosticSubmissionId?: string | null;
  service?: InquiryServiceSummary | null;
  recommendedService?: InquiryServiceSummary | null;
  createdAt: string;
  updatedAt: string;
};
