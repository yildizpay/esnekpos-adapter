import type { DateRange } from '../shared/common.js';

/** Parameters for `client.reporting.listReceipts`. */
export interface ListReceiptsParams extends DateRange {}

/** Parameters for `client.reporting.listExtracts`. */
export interface ListExtractsParams extends DateRange {}

/**
 * Parameters for `client.reporting.getDealerBalance`.
 */
export interface GetDealerBalanceParams {
  /**
   * Currency to query the balance for.
   * EsnekPos only supports TRY, USD, and EUR for this endpoint (GBP is not accepted).
   */
  currency: 'TRY' | 'USD' | 'EUR';
  /**
   * Sub-merchant external ID for marketplace balance queries.
   * Pass `null` or omit to query the primary merchant balance.
   */
  subMerchantExternalId?: string | null;
}
