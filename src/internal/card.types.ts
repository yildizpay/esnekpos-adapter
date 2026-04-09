/**
 * Raw EsnekPos API types for card-related endpoints.
 *
 * Internal use only — never export from src/index.ts.
 */

import type { RawBaseResponse } from './shared.types.js';

/**
 * @endpoint POST /api/services/EYVBinService
 * @req CardNumber*(first 6–8 digits) — no MERCHANT/MERCHANT_KEY required
 * @res Bank_Name Bank_Brand Card_Type Card_Family Card_Kind
 * @note Response keys use mixed case (Bank_Name, Card_Type), not SCREAMING_SNAKE_CASE.
 */
// --- /api/services/EYVBinService ---
// Note: This endpoint does NOT require MERCHANT/MERCHANT_KEY authentication.

export interface RawBinQueryResponse {
  Bank_Name: string;
  Bank_Brand: string;
  Card_Type: string;
  Card_Family: string;
  Card_Kind: string;
}

/**
 * @endpoint POST /api/services/GetInstallments
 * @req CC_NO*(first 6–8 digits) AMOUNT* CURRENCY_CODE*
 * @res extends RawBaseResponse + INSTALLMENTS:[{FAMILY INSTALLMENT RATE AMOUNT_PER_INSTALLMENT AMOUNT_TOTAL AMOUNT_BE_SEND_TO_DEALER}]
 */
// --- /api/services/GetInstallments ---

export interface RawInstallmentOption {
  FAMILY: string;
  INSTALLMENT: number;
  RATE: number;
  AMOUNT_PER_INSTALLMENT: number;
  AMOUNT_TOTAL: number;
  AMOUNT_BE_SEND_TO_DEALER: number;
}

export interface RawGetInstallmentsResponse extends RawBaseResponse {
  INSTALLMENTS: RawInstallmentOption[];
}
