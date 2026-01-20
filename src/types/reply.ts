import { StyleOption } from '../constants/app';

export type GenerateReplyResult = {
  bestReply: string;
  alternatives: string[];
  explanation: string;
  followUp?: string | null;
};

export type ReplyResult = {
  id: string;
  message: string;
  goal?: string;
  style: StyleOption;
  generatedAt: number;
  result: GenerateReplyResult;
};
