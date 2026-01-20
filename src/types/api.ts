export type GenerateReplyRequest = {
  incomingMessage: string;
  goal?: string;
  style: string;
  locale: 'tr-TR';
  appVersion?: string;
};

export type GenerateReplyResponse = {
  bestReply: string;
  alternatives: string[];
  explanation?: string;
  followUp?: string;
};
