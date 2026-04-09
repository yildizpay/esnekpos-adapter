/**
 * Shared raw sub-types used across multiple EsnekPos API responses.
 *
 * Internal use only — never export from src/index.ts.
 * All fields use SCREAMING_SNAKE_CASE to match the EsnekPos API exactly.
 */

export interface RawBaseResponse {
  RETURN_CODE: string;
  RETURN_MESSAGE: string;
  STATUS: string;
}

export interface RawAmountTransferDetail {
  EXTRACT_ID: number;
  SENDED_AMOUNT: string;
  SENDED_DATE: string;
}

export interface RawSubMerchantDetail {
  EXTERNAL_ID: string;
  AMOUNT: string;
  DATE: string;
  SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL: RawAmountTransferDetail | null;
}

export interface RawTransaction {
  TRANSACTION_ID: number;
  STATUS_NAME: string;
  STATUS_ID: number;
  AMOUNT: string;
  DATE: string;
  MERCHANT_AMOUNT_TRANSFER_DETAIL: RawAmountTransferDetail | null;
  SUB_MERCHANT_DETAILS: RawSubMerchantDetail[] | null;
}

export interface RawProduct {
  ID?: number;
  PAYMENT_ID?: number | null;
  PRODUCT_ID: string;
  PRODUCT_NAME: string;
  PRODUCT_CATEGORY: string;
  PRODUCT_DESCRIPTION: string;
  PRODUCT_AMOUNT?: number | null;
}
