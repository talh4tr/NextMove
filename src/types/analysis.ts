import { ToneOption } from '../constants/app';

export type AnalysisResult = {
  interestScore: number;
  trend: 'Yükseliş' | 'Düşüş' | 'Stabil';
  detection: string;
  reasons: string[];
  flags: {
    green: string[];
    red: string[];
  };
  recommendation: {
    timing: string;
    nextStep: string;
    alternatives: string[];
  };
};

export type MessageSuggestion = {
  tone: ToneOption;
  message: string;
};
