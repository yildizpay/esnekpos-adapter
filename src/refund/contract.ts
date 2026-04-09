import type { RefundParams } from './params.js';
import type { RefundResult } from './results.js';

/**
 * Refund service contract.
 *
 * Implemented by `EsnekPosClient` and `EsnekPosMockClient`.
 * Accessible via `client.refund`.
 */
export interface IRefundService {
  /**
   * Requests a refund or cancellation for a payment.
   *
   * Supports both full and partial refunds. By default (`syncWithPos: false`),
   * the request is queued and processed by the EsnekPos operations team.
   * Set `syncWithPos: true` to attempt immediate bank confirmation.
   *
   * Always verify the final refund status via `client.query.processQuery`.
   *
   * @param params - Refund parameters including order reference and amount.
   * @returns A {@link RefundResult} confirming whether the request was registered.
   *
   * @example
   * ```typescript
   * const result = await client.refund.refund({ orderRefNumber: 'ORDER-001', amount: 150 });
   * if (result.isAccepted) console.log(result.message);
   * ```
   */
  refund(params: RefundParams): Promise<RefundResult>;
}
