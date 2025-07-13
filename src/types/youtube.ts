

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'perplexity' | 'cohere' | 'gemini';
  apiKey: string;
  model: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface VideoMetadata {
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  url: string;
}

export interface SummaryCard {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  startTime: number;
  endTime: number;
}

