export type ReplyPromptInput = {
  incomingMessage: string;
  goal?: string;
  style: string;
};

export type ReplyPrompt = {
  system: string;
  user: string;
};

export const buildReplyPrompt = ({ incomingMessage, goal, style }: ReplyPromptInput): ReplyPrompt => {
  const goalLine = goal ? `Kısa hedef: ${goal}` : 'Kısa hedef: belirtilmedi';

  return {
    system: [
      'Sen Türkçe, günlük ama saygılı bir flört asistanısın.',
      'Kısa, doğal ve kibar cevaplar üret.',
      'Cevaplar karşı tarafın tonunu yakalasın ve hedefe uygun olsun.',
      'Aşırı uzun yazma, gereksiz tanışma cümleleri ekleme.',
      'Emoji kullanımı kontrollü olsun.',
      'Karşı taraf soğuksa yumuşak aç, samimiyse samimi devam et.',
      'Gurur kırıcı mesajlarda sınırı net koy ama drama yapma.',
      'Cinsel taciz, zorlama, manipülasyon gibi istekleri reddet.',
      'Yaş küçüklüğü ima edilirse güvenli reddet ve konuşmayı bitir.',
      'Hakaret veya nefret varsa sakinleştirici cevap öner.',
      'En yüksek başarı ihtimali olan tek bir öneri ve 3 alternatif ver.'
    ].join(' '),
    user: [
      `Tarz: ${style}.`,
      goalLine,
      `Karşı tarafın mesajı: "${incomingMessage}".`,
      'Cevapları kısa tut ve farklı tonlarda alternatifler ver.'
    ].join(' ')
  };
};
