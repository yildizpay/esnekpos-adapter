/**
 * Raw EsnekPos API types for financial reporting endpoints.
 *
 * Internal use only — never export from src/index.ts.
 */

import type { RawBaseResponse } from './shared.types.js';

/**
 * @endpoint POST /api/services/GetReceiptList
 * @req START_DATE* END_DATE*
 * @res extends RawBaseResponse + RECEIPTS:[{NUMBER SERIAL DEALER_NAME MERCHANT DATE AMOUNT CURRENCY URL}]
 */
// --- /api/services/GetReceiptList ---

export interface RawReceiptItem {
  NUMBER: string;
  SERIAL: string;
  DEALER_NAME: string;
  MERCHANT: string;
  DATE: string;
  AMOUNT: string;
  CURRENCY: string;
  URL: string;
}

export interface RawGetReceiptListResponse extends RawBaseResponse {
  RECEIPTS: RawReceiptItem[];
}

/**
 * @endpoint POST /api/services/GetExtractList
 * @req START_DATE* END_DATE*
 * @res extends RawBaseResponse + EXTRACTS:[{EXTRACT_ID MERCHANT_ID? SUB_MERCHANT_EXTERNAL_ID? MERCHANT_DISPLAY_NAME SALES_COUNT SALES_AMOUNT RETURN_COUNT RETURN_AMOUNT TRANSFERRED_AMOUNT CURRENCY STATUS_NAME STATUS_ID TRANSFERRED_DATE TRANSACTIONS:[{PAYMENT_ID TRANSACTION_ID TRANSACTION_DETAIL_ID ORDER_REF_NUMBER DATE PAYMENT_AMOUNT AMOUNT STATUS_NAME STATUS_ID}]}]
 */
// --- /api/services/GetExtractList ---

export interface RawExtractTransaction {
  PAYMENT_ID: number;
  TRANSACTION_ID: number;
  TRANSACTION_DETAIL_ID: number;
  ORDER_REF_NUMBER: string;
  DATE: string;
  PAYMENT_AMOUNT: string;
  AMOUNT: string;
  STATUS_NAME: string;
  STATUS_ID: number;
}

export interface RawExtractItem {
  EXTRACT_ID: number;
  MERCHANT_ID: number | null;
  SUB_MERCHANT_EXTERNAL_ID: string | null;
  MERCHANT_DISPLAY_NAME: string;
  SALES_COUNT: number;
  SALES_AMOUNT: string;
  RETURN_COUNT: number;
  RETURN_AMOUNT: string;
  TRANSFERRED_AMOUNT: string;
  CURRENCY: string;
  STATUS_NAME: string;
  STATUS_ID: number;
  TRANSFERRED_DATE: string;
  TRANSACTIONS: RawExtractTransaction[];
}

export interface RawGetExtractListResponse extends RawBaseResponse {
  EXTRACTS: RawExtractItem[];
}

/**
 * @endpoint POST /api/services/GetDealerBalance
 * @req CURRENCY*(TRY|USD|EUR) DEALER_SUB_EXTERNAL_ID?(null for primary merchant)
 * @res extends RawBaseResponse + DEALER_BALANCE:{DEALER_SUB_ID DEALER_ID DEALER_TYPE MERCHANT DEALER_NAME BALANCE CURRENCY DEPOSIT_BALANCE CHARGEBACK_BALANCE TOTAL_BALANCE}
 */
// --- /api/services/GetDealerBalance ---

export interface RawDealerBalance {
  DEALER_SUB_ID: number;
  DEALER_ID: number;
  DEALER_TYPE: string;
  MERCHANT: string;
  DEALER_NAME: string;
  BALANCE: number;
  CURRENCY: string;
  DEPOSIT_BALANCE: number;
  CHARGEBACK_BALANCE: number;
  TOTAL_BALANCE: number;
}

export interface RawGetDealerBalanceResponse extends RawBaseResponse {
  DEALER_BALANCE: RawDealerBalance;
}
