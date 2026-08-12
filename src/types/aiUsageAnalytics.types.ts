export interface AiTokenSummaryType {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCalls: number;
  averageDurationMs: number;
  dailyAverage: number;
  topModel: string | null;
}

export interface AiTokenTimelineItemType {
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCalls: number;
}

export interface AiTokenModelUsageType {
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCalls: number;
}

export interface AiCredentialUsageType {
  id: number;
  provider: string;
  name: string;
  envName: string;
  priority: number;
  status:
    | "ativa"
    | "standby"
    | "cooldown"
    | "desativada"
    | "erro";

  totalCalls: number;
  totalTokens: number;
  lastUsedAt: string | null;
}

export interface AiTokenAnalyticsType {
  periodDays: number;
  summary: AiTokenSummaryType;
  timeline: AiTokenTimelineItemType[];
  byModel: AiTokenModelUsageType[];
  credentials: AiCredentialUsageType[];
}

export interface AiCostSummaryType {
  totalCostUsd: number;
  dailyAverageUsd: number;
  projected30DaysUsd: number;
  totalCalls: number;
  pricedCalls: number;
  unpricedCalls: number;
  topCostModel: string | null;
}

export interface AiCostTimelineItemType {
  date: string;
  totalCostUsd: number;
  totalCalls: number;
}

export interface AiCostModelUsageType {
  provider: string;
  model: string;
  totalCostUsd: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCalls: number;
}

export interface AiCostOperationUsageType {
  operation: string;
  totalCostUsd: number;
  totalCalls: number;
  totalTokens: number;
}

export interface AiCostAnalyticsType {
  periodDays: number;
  currency: "USD";
  summary: AiCostSummaryType;
  timeline: AiCostTimelineItemType[];
  byModel: AiCostModelUsageType[];
  byOperation: AiCostOperationUsageType[];
}

export interface AiAudioSummaryType {
  totalAttempts: number;
  successfulGenerations: number;
  failedGenerations: number;
  totalAudioSeconds: number;
  totalAudioMinutes: number;
  successRate: number;
  averageGenerationMs: number;
  topVoice: string | null;
  topModel: string | null;
}

export interface AiAudioTimelineItemType {
  date: string;
  totalAttempts: number;
  successfulGenerations: number;
  failedGenerations: number;
  totalAudioSeconds: number;
}

export interface AiAudioVoiceUsageType {
  voice: string;
  totalGenerations: number;
  totalAudioSeconds: number;
}

export interface AiAudioModelUsageType {
  provider: string;
  model: string;
  totalGenerations: number;
  totalAudioSeconds: number;
  averageGenerationMs: number;
}

export interface AiAudioAnalyticsType {
  periodDays: number;
  summary: AiAudioSummaryType;
  timeline: AiAudioTimelineItemType[];
  byVoice: AiAudioVoiceUsageType[];
  byModel: AiAudioModelUsageType[];
}

export interface AiCourseGenerationSummaryType {
  totalGenerations: number;

  inputTokens: number;
  outputTokens: number;
  totalTokens: number;

  totalCostUsd: number;

  averageGenerationMs: number;

  pricedGenerations: number;
  unpricedGenerations: number;

  averageTokensPerGeneration: number;
  averageCostPerGeneration: number;

  topModel: string | null;
}


export interface AiCourseGenerationTimelineItemType {
  date: string;

  totalGenerations: number;
  totalTokens: number;

  totalCostUsd: number;

  averageGenerationMs: number;
}


export interface AiCourseGenerationModelUsageType {
  provider: string;
  model: string;

  totalGenerations: number;

  inputTokens: number;
  outputTokens: number;
  totalTokens: number;

  totalCostUsd: number;

  averageGenerationMs: number;
}


export interface AiRecentCourseGenerationType {
  id: number;

  courseId: number | null;
  courseTitle: string;

  provider: string;
  model: string;

  inputTokens: number;
  outputTokens: number;
  totalTokens: number;

  durationMs: number;

  estimatedCostUsd: number | null;

  createdAt: string;
}


export interface AiCourseGenerationAnalyticsType {
  periodDays: number;

  currency: "USD";

  summary: AiCourseGenerationSummaryType;

  timeline:
    AiCourseGenerationTimelineItemType[];

  byModel:
    AiCourseGenerationModelUsageType[];

  recentGenerations:
    AiRecentCourseGenerationType[];
}