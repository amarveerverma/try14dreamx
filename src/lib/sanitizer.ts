/**
 * DreamX Telemetry & Error Sanitizer
 * Implements PRD §18.3 & V-18: Personal and sensitive data scrubbing before logging/monitoring.
 */

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'api_key',
  'apikey',
  'authorization',
  'cookie',
  'bank_account_number',
  'upi_id',
  'ifsc',
  'resume_text',
  'aadhaar',
  'pan',
];

const PHONE_REGEX = /(\+91[\-\s]?)?[6-9]\d{9}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Scrubs string values of email addresses and Indian mobile numbers.
 */
export function scrubString(input: string): string {
  return input
    .replace(PHONE_REGEX, '[REDACTED_PHONE]')
    .replace(EMAIL_REGEX, '[REDACTED_EMAIL]');
}

/**
 * Recursively scrubs objects and dictionaries of sensitive keys and PII.
 */
export function scrubSensitiveData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return scrubString(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => scrubSensitiveData(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sk) => lowerKey.includes(sk))) {
        cleaned[key] = '[REDACTED_SECRET]';
      } else {
        cleaned[key] = scrubSensitiveData(value);
      }
    }
    return cleaned as T;
  }

  return data;
}
