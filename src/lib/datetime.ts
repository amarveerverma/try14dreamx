/**
 * DreamX Standardized DateTime & SLA Engine
 * Target: India (CM-IN) • Timezone: Asia/Kolkata (IST)
 * Adheres to PRD §19.2: UTC storage, Asia/Kolkata presentation.
 */

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Format a UTC date string or Date into Indian Standard Time (IST)
 */
export function formatIST(
  dateInput: string | number | Date,
  format: 'full' | 'date' | 'time' | 'short' = 'full'
): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number'
    ? new Date(dateInput)
    : dateInput;

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    full: {
      timeZone: DEFAULT_TIMEZONE,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    date: {
      timeZone: DEFAULT_TIMEZONE,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    time: {
      timeZone: DEFAULT_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    short: {
      timeZone: DEFAULT_TIMEZONE,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
  };

  return new Intl.DateTimeFormat('en-IN', optionsMap[format]).format(date);
}

/**
 * Computes 48-hour SLA deadline from session completion time
 * Returns deadline Date and whether the SLA has breached.
 */
export function calculateSLADeadline(
  sessionEndTime: string | number | Date,
  slaHours = 48
): {
  deadline: Date;
  deadlineIST: string;
  isBreached: boolean;
  remainingHours: number;
  remainingMinutes: number;
} {
  const start = new Date(sessionEndTime);
  const deadline = new Date(start.getTime() + slaHours * 60 * 60 * 1000);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();

  const isBreached = diffMs <= 0;
  const remainingHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const remainingMinutes = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));

  return {
    deadline,
    deadlineIST: formatIST(deadline, 'full'),
    isBreached,
    remainingHours,
    remainingMinutes,
  };
}

/**
 * Computes temporary hold expiration (e.g. 15 minutes for booking slot)
 */
export function calculateHoldExpiration(
  holdStartTime: string | number | Date,
  holdDurationMinutes = 15
): {
  expiresAt: Date;
  isExpired: boolean;
  remainingSeconds: number;
} {
  const start = new Date(holdStartTime);
  const expiresAt = new Date(start.getTime() + holdDurationMinutes * 60 * 1000);
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();

  const isExpired = diffMs <= 0;
  const remainingSeconds = Math.max(0, Math.floor(diffMs / 1000));

  return {
    expiresAt,
    isExpired,
    remainingSeconds,
  };
}
