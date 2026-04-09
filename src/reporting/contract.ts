import type { GetDealerBalanceParams, ListExtractsParams, ListReceiptsParams } from './params.js';
import type { GetDealerBalanceResult, ListExtractsResult, ListReceiptsResult } from './results.js';

/**
 * Reporting service contract.
 *
 * Implemented by `EsnekPosClient` and `EsnekPosMockClient`.
 * Accessible via `client.reporting`.
 */
export interface IReportingService {
  /**
   * Lists payment batch receipts (dekontlar) for a date range.
   *
   * Each receipt represents a settlement batch. Use to reconcile payments
   * with accounting systems.
   *
   * @param params - Date range in `YYYY-MM-DD` format.
   * @returns A {@link ListReceiptsResult} with the matching receipts.
   *
   * @example
   * ```typescript
   * const result = await client.reporting.listReceipts({ startDate: '2024-01-01', endDate: '2024-01-31' });
   * ```
   */
  listReceipts(params: ListReceiptsParams): Promise<ListReceiptsResult>;

  /**
   * Lists transfer/payout batches (ekstreleri) for a date range.
   *
   * Each extract represents a grouped payout to the merchant or a sub-merchant.
   * Includes individual transaction lines within each batch.
   *
   * @param params - Date range in `YYYY-MM-DD` format.
   * @returns A {@link ListExtractsResult} with the matching transfer batches.
   *
   * @example
   * ```typescript
   * const result = await client.reporting.listExtracts({ startDate: '2024-01-01', endDate: '2024-01-31' });
   * ```
   */
  listExtracts(params: ListExtractsParams): Promise<ListExtractsResult>;

  /**
   * Queries the current balance for the merchant or a sub-merchant.
   *
   * Returns available balance, deposit balance, chargeback reserve, and
   * total balance for the specified currency.
   *
   * @param params - Currency and optional sub-merchant external ID.
   * @returns A {@link GetDealerBalanceResult} with balance details.
   *
   * @example
   * ```typescript
   * const result = await client.reporting.getDealerBalance({ currency: 'TRY' });
   * console.log(`Balance: ${result.balance.balance} TRY`);
   * ```
   */
  getDealerBalance(params: GetDealerBalanceParams): Promise<GetDealerBalanceResult>;
}
