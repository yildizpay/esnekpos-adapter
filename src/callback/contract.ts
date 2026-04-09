import type { CallbackPayload } from './params.js';
import type { PaymentCallbackResult } from './results.js';

/**
 * Callback service contract.
 *
 * Implemented by `EsnekPosClient` and `EsnekPosMockClient`.
 * Accessible via `client.callback`.
 */
export interface ICallbackService {
  /**
   * Parses the EsnekPos FORM POST callback payload into a typed result object.
   *
   * Always call `verify` before `parse` to ensure the payload has not been tampered with.
   *
   * @param body - The raw FORM POST body (e.g. `req.body` in Express).
   * @returns A {@link PaymentCallbackResult} with typed payment outcome data.
   *
   * @example
   * ```typescript
   * const result = client.callback.parse(req.body);
   * if (result.isSuccess) {
   *   await orderService.confirm(result.orderRefNumber);
   * }
   * ```
   */
  parse(body: CallbackPayload): PaymentCallbackResult;

  /**
   * Verifies the integrity of the EsnekPos callback payload using HMAC hash.
   *
   * Must be called before trusting any data from the callback. A payload that
   * fails verification should be rejected — it may be forged or replayed.
   *
   * @param body - The raw FORM POST body (e.g. `req.body` in Express).
   * @param hash - The `HASH` field from the callback payload (`body.HASH`).
   * @returns `true` if the hash matches, `false` if the payload has been tampered with.
   *
   * @example
   * ```typescript
   * const isValid = client.callback.verify(req.body, req.body.HASH);
   * if (!isValid) return res.status(400).end();
   * ```
   */
  verify(body: CallbackPayload, hash: string): boolean;
}
