/**
 * Parameters for `client.refund.refund`.
 *
 * Supports both full and partial refunds. For partial refunds, pass an `amount`
 * less than the original payment amount.
 *
 * @example
 * ```typescript
 * // Full refund
 * await client.refund.refund({ orderRefNumber: 'ORDER-001', amount: 150 });
 *
 * // Partial refund
 * await client.refund.refund({ orderRefNumber: 'ORDER-001', amount: 50 });
 * ```
 */
export interface RefundParams {
  /**
   * The `orderRefNumber` used when the payment was initiated.
   */
  orderRefNumber: string;
  /**
   * The amount to refund or cancel.
   * For a full refund, pass the original payment amount.
   * For a partial refund, pass a smaller amount.
   */
  amount: number;
  /**
   * When `true`, EsnekPos attempts to process the refund synchronously with
   * the bank. If the bank does not confirm immediately, the request is queued
   * and handled by the EsnekPos operations team.
   *
   * When `false` (default), the request is always queued regardless of bank response.
   *
   * @default false
   */
  syncWithPos?: boolean;
}
