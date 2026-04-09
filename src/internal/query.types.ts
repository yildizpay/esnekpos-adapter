/**
 * Raw EsnekPos API types for query endpoints.
 *
 * Internal use only — never export from src/index.ts.
 */

import type { RawBaseResponse, RawProduct, RawTransaction } from './shared.types.js';

/**
 * @endpoint POST /api/services/ProcessQuery
 * @req ORDER_REF_NUMBER*
 * @res extends RawBaseResponse + ORDER_REF_NO(≠ORDER_REF_NUMBER) REFNO? AMOUNT INSTALLMENT COMMISSION? SUCCESS_TRANSACTION_ID? DATE PAYMENT_DATE PHYSICAL_POS_ID? PHYSICAL_POS_TITLE? PAYMENT_WAY? TRANSACTIONS[]
 * @note STATUS=ORDER_CANCEL when payment was cancelled (RETURN_CODE=300)
 */
// --- /api/services/ProcessQuery ---

export interface RawProcessQueryResponse extends RawBaseResponse {
  DATE: string;
  PAYMENT_DATE: string;
  /** Null when the payment has not yet reached a successful state. */
  REFNO: string | null;
  AMOUNT: string;
  /** Note: field name is ORDER_REF_NO (not ORDER_REF_NUMBER) in this endpoint. */
  ORDER_REF_NO: string;
  INSTALLMENT: string;
  COMMISSION: string | null;
  SUCCESS_TRANSACTION_ID: number | null;
  TRANSACTIONS: RawTransaction[];
  PHYSICAL_POS_ID: number | null;
  PHYSICAL_POS_TITLE: string | null;
  PAYMENT_WAY: string | null;
}

/**
 * @endpoint POST /api/services/ProcessQueryDetail
 * @req ORDER_REF_NUMBER*
 * @res extends RawBaseResponse + paymentList:{ID MERCHANT DEALERID DEALER_NAME DEALER_CODE? INSERT_DATETIME CARD_TYPE CARD_CATEGORY CARD_NUMBER(masked) CARD_NAME CARD_BANK_NAME CARD_FAMILY? CURRENCY VIRTUALPOS_NAME STATUS_NAME STATUS_ID? INSTALLMENT? AMOUNT COMMISSION_AMOUNT? COMMISSION_RATE? DEALER_PAYMENT_REF_CODE CUSTOMER_NAME CUSTOMER_GSM USER_NAME? CANCEL_REQUEST? PAYMENT_WAY PHYSICAL_POS_ID PHYSICAL_POS_TITLE TRANSACTIONS[] PRODUCTS[]}
 */
// --- /api/services/ProcessQueryDetail ---

export interface RawProcessQueryDetailPayment {
  ID: number;
  MERCHANT: string;
  DEALERID: number;
  DEALER_NAME: string;
  DEALER_CODE: number | null;
  INSERT_DATETIME: string;
  CARD_TYPE: string;
  CARD_CATEGORY: string;
  /** Masked card number (e.g. 453144******2283). */
  CARD_NUMBER: string;
  CARD_NAME: string;
  CARD_BANK_NAME: string;
  CARD_FAMILY: string | null;
  CURRENCY: string;
  VIRTUALPOS_NAME: string;
  STATUS_NAME: string;
  INSTALLMENT: number | null;
  AMOUNT: number;
  COMMISSION_AMOUNT: number | null;
  /** Merchant-assigned reference code (ORDER_REF_NUMBER equivalent). */
  DEALER_PAYMENT_REF_CODE: string;
  COMMISSION_RATE: number | null;
  CUSTOMER_NAME: string;
  CUSTOMER_GSM: string;
  USER_NAME: string | null;
  CANCEL_REQUEST: boolean | null;
  STATUS_ID: number | null;
  JSONDATE: string | null;
  NEED_FILES: boolean;
  CONFIRM_FILES: boolean;
  INSERT_BY: string | null;
  CHECK_INSERT_DATETIME: string | null;
  JSONPAYMENT: string | null;
  CC_HASH: string;
  PAYMENT_BANK_CODE: string | null;
  DEALER_RESPONSE_URL: string;
  PHYSICAL_POS_ID: number;
  PHYSICAL_POS_TITLE: string;
  PAYMENT_WAY: string;
  TRANSACTIONS: RawTransaction[];
  PRODUCTS: RawProduct[];
}

export interface RawProcessQueryDetailResponse extends RawBaseResponse {
  paymentList: RawProcessQueryDetailPayment;
}

/**
 * @endpoint POST /api/services/GetPaymentList
 * @req START_DATE* END_DATE*
 * @res extends RawBaseResponse + paymentList:[{ID MERCHANT DEALERID DEALER_CODE INSERT_DATETIME CARD_TYPE CARD_NUMBER(masked) CARD_NAME CARD_BANK_NAME CARD_FAMILY? CURRENCY VIRTUALPOS_NAME STATUS_NAME STATUS_ID INSTALLMENT AMOUNT COMMISSION_AMOUNT COMMISSION_RATE DEALER_PAYMENT_REF_CODE CUSTOMER_NAME CUSTOMER_GSM USER_NAME? CANCEL_REQUEST DEALER_NAME? PAYMENT_WAY PHYSICAL_POS_ID PHYSICAL_POS_TITLE TRANSACTIONS[]}]
 */
// --- /api/services/GetPaymentList ---

export interface RawPaymentListItem {
  ID: number;
  MERCHANT: string;
  DEALERID: number;
  DEALER_CODE: number;
  INSERT_DATETIME: string;
  CARD_TYPE: string;
  CARD_NUMBER: string;
  CARD_NAME: string;
  CARD_BANK_NAME: string;
  CARD_FAMILY: string | null;
  CURRENCY: string;
  VIRTUALPOS_NAME: string;
  STATUS_NAME: string;
  STATUS_ID: number;
  INSTALLMENT: number;
  AMOUNT: number;
  COMMISSION_AMOUNT: number;
  DEALER_PAYMENT_REF_CODE: string;
  COMMISSION_RATE: number;
  CUSTOMER_NAME: string;
  CUSTOMER_GSM: string;
  USER_NAME: string | null;
  CANCEL_REQUEST: boolean;
  DEALER_NAME: string | null;
  JSONDATE: string | null;
  JSONPAYMENT: string | null;
  CC_HASH: string | null;
  PAYMENT_BANK_CODE: string;
  TRANSACTIONS: RawTransaction[];
  PHYSICAL_POS_ID: number;
  PHYSICAL_POS_TITLE: string;
  PAYMENT_WAY: string;
}

export interface RawGetPaymentListResponse extends RawBaseResponse {
  paymentList: RawPaymentListItem[];
}
