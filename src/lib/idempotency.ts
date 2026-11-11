/**
 * DreamX Idempotency & Retry Engine
 * Implements PRD §16 & V-16, V-19: Safe retries with guaranteed duplicate suppression.
 */

export interface IdempotentExecutionResult<T> {
  success: boolean;
  executed: boolean;
  result?: T;
  error?: string;
  idempotencyKey: string;
}

// In-memory registry for worker runs & local simulations
const executionRegistry = new Set<string>();

/**
 * Executes a task with idempotency key deduplication.
 * If the key has already succeeded, skips execution and returns cached/deduplicated status.
 */
export async function executeIdempotentTask<T>(
  key: string,
  task: () => Promise<T>,
  options: { maxRetries?: number; retryDelayMs?: number } = {}
): Promise<IdempotentExecutionResult<T>> {
  if (executionRegistry.has(key)) {
    return {
      success: true,
      executed: false,
      idempotencyKey: key,
    };
  }

  const maxRetries = options.maxRetries ?? 3;
  const retryDelayMs = options.retryDelayMs ?? 100;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await task();
      executionRegistry.add(key);
      return {
        success: true,
        executed: true,
        result,
        idempotencyKey: key,
      };
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
      }
    }
  }

  return {
    success: false,
    executed: false,
    error: lastError instanceof Error ? lastError.message : String(lastError),
    idempotencyKey: key,
  };
}

export function clearIdempotencyRegistry(): void {
  executionRegistry.clear();
}
