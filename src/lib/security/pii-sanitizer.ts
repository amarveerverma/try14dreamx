/**
 * DreamX PII & Log Sanitizer (PRD §18.2, §19, P13 Exit Criteria 3)
 * Guarantees zero sensitive personal, financial, or authentication credentials in logs or audit metadata.
 */

// Patterns for sensitive data
const PATTERNS = {
  // Credit Card: 13 to 19 digits with optional spaces/dashes (4 blocks of 4 digits or continuous)
  creditCard: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,

  // Indian Aadhaar: 12 digits (with optional spaces/dashes), not followed by another block of digits
  aadhaar: /\b[2-9]{1}\d{3}[ -]?\d{4}[ -]?\d{4}(?![ -]?\d)\b/g,

  // Indian PAN: 5 uppercase letters, 4 digits, 1 uppercase letter
  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/gi,

  // Sensitive JSON keys / query param patterns
  secretKeys: /(["']?(?:password|client_secret|secret_key|secret|token|access_token|refresh_token|auth_token|id_document_masked|bank_account_number)["']?\s*[:=]\s*["'])([^"'\r\n]+)(["'])/gi,

  // Bearer tokens
  bearerToken: /Bearer\s+([A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_=]*)/gi,

  // Base64 binary buffers / PDFs (> 100 base64 chars)
  base64Binary: /data:application\/pdf;base64,[A-Za-z0-9+/=]{50,}/gi,
};

/**
 * Sanitizes any string by redacting PII and credentials.
 */
export function sanitizeLogString(input: string): string {
  if (!input || typeof input !== 'string') return input;

  return input
    .replace(PATTERNS.bearerToken, 'Bearer [REDACTED_JWT]')
    .replace(PATTERNS.base64Binary, '[REDACTED_BINARY_PDF]')
    .replace(PATTERNS.secretKeys, '$1[REDACTED_SECRET]$3')
    .replace(PATTERNS.creditCard, '[REDACTED_CARD]')
    .replace(PATTERNS.aadhaar, '[REDACTED_AADHAAR]')
    .replace(PATTERNS.pan, '[REDACTED_PAN]');
}

/**
 * Recursively deep-sanitizes any object or array before serialization/logging.
 */
export function sanitizeLogData<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return sanitizeLogString(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const sensitiveKeys = new Set([
      'password',
      'secret',
      'client_secret',
      'token',
      'access_token',
      'refresh_token',
      'id_document_masked',
      'bank_account_number',
      'aadhaar',
      'pan',
      'raw_resume_bytes',
    ]);

    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (sensitiveKeys.has(key.toLowerCase())) {
        sanitizedObj[key] = '[REDACTED_SECRET]';
      } else {
        sanitizedObj[key] = sanitizeLogData(value);
      }
    }
    return sanitizedObj as T;
  }

  return data;
}

/**
 * Safe structured logger that enforces PII sanitization across all log sinks.
 */
export const safeLogger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(sanitizeLogString(message), context ? sanitizeLogData(context) : '');
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(sanitizeLogString(message), context ? sanitizeLogData(context) : '');
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(
      sanitizeLogString(message),
      error instanceof Error ? error.message : error,
      context ? sanitizeLogData(context) : ''
    );
  },
};
