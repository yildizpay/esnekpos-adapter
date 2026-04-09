import type { BinQueryParams, GetInstallmentsParams } from './params.js';
import type { BinQueryResult, GetInstallmentsResult } from './results.js';

/**
 * Card service contract.
 *
 * Implemented by `EsnekPosClient` and `EsnekPosMockClient`.
 * Accessible via `client.card`.
 */
export interface ICardService {
  /**
   * Queries BIN (Bank Identification Number) information for a card.
   *
   * Returns bank name, card brand, type, family, and kind for the given
   * card number prefix. Use this before payment to show card info to the
   * customer or to load relevant installment options.
   *
   * > **Note:** This endpoint does not require merchant authentication.
   *
   * @param params - The first 6–8 digits of the card number.
   * @returns A {@link BinQueryResult} with bank and card metadata.
   *
   * @example
   * ```typescript
   * const result = await client.card.binQuery({ cardNumber: '415956' });
   * console.log(result.bankName); // 'IS BANK'
   * ```
   */
  binQuery(params: BinQueryParams): Promise<BinQueryResult>;

  /**
   * Retrieves available installment options and commission rates.
   *
   * Optionally filtered by card BIN and calculated for a specific amount.
   * Use this to render installment selection UI before payment initiation.
   *
   * @param params - Optional amount, BIN, and commission target.
   * @returns A {@link GetInstallmentsResult} with all installment options.
   *
   * @example
   * ```typescript
   * const result = await client.card.getInstallments({ amount: '1250.00', bin: '51015200' });
   * ```
   */
  getInstallments(params?: GetInstallmentsParams): Promise<GetInstallmentsResult>;
}
