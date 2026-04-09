import type {
  QuerySubMerchantParams,
  ReduceSubMerchantAmountParams,
  SetSubMerchantParams,
} from './params.js';
import type {
  QuerySubMerchantResult,
  ReduceSubMerchantAmountResult,
  SetSubMerchantResult,
} from './results.js';

/**
 * Service contract for marketplace (pazaryeri) sub-merchant operations.
 *
 * Implemented by `EsnekPosClient` and available as `client.marketplace`.
 *
 * @example
 * ```typescript
 * await client.marketplace.setSubMerchant({ externalId: 'seller-42', ... });
 * const info = await client.marketplace.querySubMerchant({ externalId: 'seller-42' });
 * console.log(info.detail.companyName);
 * ```
 */
export interface IMarketplaceService {
  /**
   * Registers a new sub-merchant or updates an existing one.
   *
   * Maps to `POST /api/services/SubMerchantSet`.
   */
  setSubMerchant(params: SetSubMerchantParams): Promise<SetSubMerchantResult>;

  /**
   * Retrieves the details of a registered sub-merchant.
   *
   * Maps to `POST /api/services/SubMerchantQuery`.
   */
  querySubMerchant(params: QuerySubMerchantParams): Promise<QuerySubMerchantResult>;

  /**
   * Reduces the receivable amount owed to a sub-merchant for a given order.
   *
   * Maps to `POST /api/services/AddSubMerchantAmount`.
   */
  reduceSubMerchantAmount(
    params: ReduceSubMerchantAmountParams,
  ): Promise<ReduceSubMerchantAmountResult>;
}
