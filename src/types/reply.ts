import { StyleOption } from '../constants/app';
import { GenerateReplyResponse } from './api';

export type ReplyResult = {
  id: string;
  message: string;
  goal?: string;
  style: StyleOption;
  generatedAt: number;
  result: GenerateReplyResponse;
};
