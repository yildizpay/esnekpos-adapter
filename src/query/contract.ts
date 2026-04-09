import type { ListPaymentsParams, ProcessQueryDetailParams, ProcessQueryParams } from './params.js';
import type {
  ListPaymentsResult,
  ProcessQueryDetailResult,
  ProcessQueryResult,
} from './results.js';

/**
 * Query service contract.
 *
 * Implemented by `EsnekPosClient` and `EsnekPosMockClient`.
 * Accessible via `client.query`.
 */
export interface IQueryService {
  /**
   * Queries the status of a payment by order reference number.
   *
   * Returns overall payment status with all transaction movements.
   * Always call this after receiving a callback to verify the payment — the
   * callback payload alone is not a reliable confirmation of payment.
   *
   * > **Note:** A cancelled payment returns `STATUS === 'ORDER_CANCEL'` from
   * > EsnekPos. This is handled transparently via `result.isCancelled`.
   *
   * @param params - The `orderRefNumber` used at payment initiation.
   * @returns A {@link ProcessQueryResult} with payment status and transactions.
   *
   * @example
   * ```typescript
   * const result = await client.query.processQuery({ orderRefNumber: 'ORDER-001' });
   * if (result.isSuccessful) confirmOrder();
   * ```
   */
  processQuery(params: ProcessQueryParams): Promise<ProcessQueryResult>;

  /**
   * Queries full details of a payment by order reference number.
   *
   * Returns rich payment data including card details, commission, customer info,
   * and all transaction movements. Use when you need more than `processQuery` provides.
   *
   * @param params - The `orderRefNumber` used at payment initiation.
   * @returns A {@link ProcessQueryDetailResult} with full payment record.
   *
   * @example
   * ```typescript
   * const result = await client.query.processQueryDetail({ orderRefNumber: 'ORDER-001' });
   * console.log(result.maskedCardNumber); // '453144******2283'
   * ```
   */
  processQueryDetail(params: ProcessQueryDetailParams): Promise<ProcessQueryDetailResult>;

  /**
   * Lists all payments within a date range.
   *
   * @param params - Start and end dates in `YYYY-MM-DD` format.
   * @returns A {@link ListPaymentsResult} containing the matching payment records.
   *
   * @example
   * ```typescript
   * const result = await client.query.listPayments({ startDate: '2024-01-01', endDate: '2024-01-31' });
   * console.log(`${result.payments.length} payments found`);
   * ```
   */
  listPayments(params: ListPaymentsParams): Promise<ListPaymentsResult>;
}
