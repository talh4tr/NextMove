export class TimeoutError extends Error {
  constructor(message = 'İstek zaman aşımına uğradı.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class RateLimitError extends Error {
  retryAfterMs?: number;

  constructor(message = 'Çok fazla istek. 30 saniye sonra tekrar dene.', retryAfterMs?: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

export class NetworkOfflineError extends Error {
  constructor(message = 'Bağlantı yok. İnterneti kontrol et.') {
    super(message);
    this.name = 'NetworkOfflineError';
  }
}

export class BadResponseError extends Error {
  constructor(message = 'Sunucu yanıtı anlaşılmadı.') {
    super(message);
    this.name = 'BadResponseError';
  }
}
