import { ToneOption } from '../constants/app';

export type AnalysisResult = {
  interestScore: number;
  trend: 'Yükseliş' | 'Düşüş' | 'Stabil';
  detection: string;
  recommendation: {
    timing: string;
    nextStep: string;
  };
};

export type MessageSuggestion = {
  tone: ToneOption;
  tone: 'Dengeli' | 'Daha Mesafeli' | 'Daha Net';
  message: string;
};
