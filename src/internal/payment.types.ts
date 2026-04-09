/**
 * Raw EsnekPos API types for payment endpoints.
 *
 * Internal use only — never export from src/index.ts.
 */

import type { RawBaseResponse } from './shared.types.js';

/**
 * @endpoint POST /api/pay/EYV3DPay
 * @req ORDER_REF_NUMBER* CC_HOLDER_NAME* CC_NO* EXPIRY_DATE* CVVC* INSTALLMENT_NUMBER*(1=single) PRICES_CURRENCY* ORDER_AMOUNT* TRANSACTION_TYPE*(Auth|PreAuth) LOCALE*(tr|en) FIRST_NAME* LAST_NAME* MAIL* PHONE* CITY* STATE* ADDRESS* CLIENT_IP* PRODUCTS[]*
 * @res extends RawBaseResponse + ORDER_REF_NUMBER URL_3DS REFNO HASH DATE IS_NOT_3D_PAYMENT BANK_AUTH_CODE COMMISSION_RATE? CUSTOMER_NAME CUSTOMER_MAIL CUSTOMER_PHONE CUSTOMER_ADDRESS CUSTOMER_CC_NUMBER? CUSTOMER_CC_NAME? VIRTUAL_POS_VALUES? RETURN_MESSAGE_3D? RETURN_MESSAGE_TR? ERROR_CODE?
 */
// --- /api/pay/EYV3DPay ---

export interface RawPay3DResponse extends RawBaseResponse {
  ORDER_REF_NUMBER: string;
  RETURN_MESSAGE_TR: string | null;
  ERROR_CODE: string | null;
  DATE: string;
  /** 3D redirect URL. Empty string when IS_NOT_3D_PAYMENT is true. */
  URL_3DS: string;
  REFNO: string;
  HASH: string;
  COMMISSION_RATE: string | null;
  CUSTOMER_NAME: string;
  CUSTOMER_MAIL: string;
  CUSTOMER_PHONE: string;
  CUSTOMER_ADDRESS: string;
  /** Masked card number returned by EsnekPos. Null when not available. */
  CUSTOMER_CC_NUMBER: string | null;
  CUSTOMER_CC_NAME: string | null;
  /** When true, 3D verification was skipped by the bank. */
  IS_NOT_3D_PAYMENT: boolean;
  VIRTUAL_POS_VALUES: string | null;
  RETURN_MESSAGE_3D: string | null;
  BANK_AUTH_CODE: string;
}

/**
 * @endpoint POST /api/pay/CommonPaymentDealer
 * @req BACK_URL* PRICES_CURRENCY* ORDER_REF_NUMBER* ORDER_AMOUNT* LOCALE*(tr|en) PRODUCTS[]* — card is collected by EsnekPos hosted page, no card fields in request
 * @res extends RawBaseResponse + ORDER_REF_NUMBER URL_3DS REFNO HASH DATE IS_NOT_3D_PAYMENT CUSTOMER_NAME? CUSTOMER_MAIL? CUSTOMER_PHONE? CUSTOMER_ADDRESS? CUSTOMER_CC_NUMBER? CUSTOMER_CC_NAME? VIRTUAL_POS_VALUES? RETURN_MESSAGE_3D? RETURN_MESSAGE_TR? ERROR_CODE?
 */
// --- /api/pay/CommonPaymentDealer ---

export interface RawCommonPaymentResponse extends RawBaseResponse {
  ORDER_REF_NUMBER: string;
  RETURN_MESSAGE_TR: string | null;
  ERROR_CODE: string | null;
  DATE: string;
  /** Hosted payment page URL. */
  URL_3DS: string;
  REFNO: string;
  HASH: string;
  CUSTOMER_NAME: string | null;
  CUSTOMER_MAIL: string | null;
  CUSTOMER_PHONE: string | null;
  CUSTOMER_ADDRESS: string | null;
  CUSTOMER_CC_NUMBER: string | null;
  CUSTOMER_CC_NAME: string | null;
  IS_NOT_3D_PAYMENT: boolean;
  VIRTUAL_POS_VALUES: string | null;
  RETURN_MESSAGE_3D: string | null;
}
