import type { HttpAdapterContract } from '@yildizpay/http-adapter';

/**
 * EsnekPos API environment.
 * - `'test'` — uses `https://posservicetest.esnekpos.com`
 * - `'production'` — uses `https://posservice.esnekpos.com`
 */
export type EsnekPosEnvironment = 'test' | 'production';

/**
 * Debug options for {@link EsnekPosClientConfig}.
 * All options under this key are intended for development only.
 */
export interface EsnekPosDebugOptions {
  /**
   * When `true`, sensitive data (card numbers, CVV, merchant key) may be
   * included in debug output.
   *
   * @deprecated **Never enable in production.** Violates PCI-DSS compliance.
   * @default false
   */
  logSensitiveData?: boolean;
}

/**
 * Configuration for `EsnekPosClient`.
 *
 * @example
 * ```typescript
 * const client = new EsnekPosClient({
 *   merchant: 'TEST1234',
 *   merchantKey: '4oK26hK8MOXrIV1bzTRVPA==',
 *   environment: 'test',
 * });
 * ```
 *
 * @example Inject a custom HTTP adapter (e.g. for testing):
 * ```typescript
 * const client = new EsnekPosClient({
 *   merchant: 'TEST1234',
 *   merchantKey: '4oK26hK8MOXrIV1bzTRVPA==',
 *   environment: 'test',
 *   httpAdapter: mockAdapter,
 * });
 * ```
 */
export interface EsnekPosClientConfig {
  /**
   * Merchant identifier assigned by EsnekPos.
   * Maps to `MERCHANT` in the API.
   */
  merchant: string;
  /**
   * Merchant secret key assigned by EsnekPos.
   * Maps to `MERCHANT_KEY` in the API.
   *
   * Never log or expose this value. It is excluded from all error context
   * and debug output by default.
   */
  merchantKey: string;
  /**
   * Target API environment.
   * @see {@link EsnekPosEnvironment}
   */
  environment: EsnekPosEnvironment;
  /**
   * Custom HTTP adapter for dependency injection.
   * Defaults to `@yildizpay/http-adapter`'s `HttpAdapter` when not provided.
   *
   * Inject a `MockHttpAdapter` in tests to prevent real HTTP calls.
   */
  httpAdapter?: HttpAdapterContract;
  /**
   * Development-only debug options.
   * All options under this key are unsafe for production.
   */
  debug?: EsnekPosDebugOptions;
}
