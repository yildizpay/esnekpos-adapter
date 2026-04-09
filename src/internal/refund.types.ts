/**
 * Raw EsnekPos API types for refund/cancellation endpoints.
 *
 * Internal use only — never export from src/index.ts.
 */

import type { RawBaseResponse } from './shared.types.js';

/**
 * @endpoint POST /api/services/OrderReturn
 * @req ORDER_REF_NUMBER* AMOUNT* SYNC_WITH_POS?(bool, default false — async when false)
 * @res extends RawBaseResponse + ORDER_REF_NUMBER? REFNO? TRANSACTION_ID?(only when SYNC_WITH_POS=true and bank confirms immediately)
 */
// --- /api/services/OrderReturn ---

export interface RawOrderReturnResponse extends RawBaseResponse {
  ORDER_REF_NUMBER: string | null;
  REFNO: string | null;
  /** Only present when SYNC_WITH_POS was true and the bank confirmed immediately. */
  TRANSACTION_ID: number | null;
}
