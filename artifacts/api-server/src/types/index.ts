export type Severity = "mild" | "moderate" | "severe";

export interface Disease {
  name: string;
  symptoms: string[];
  description: string;
  severity: Severity;
  recommendation: string;
  specialist: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PredictionResult {
  name: string;
  matchPercent: number;
  severity: Severity;
  recommendation: string;
  specialist: string;
  matchedSymptoms: string[];
  description: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
