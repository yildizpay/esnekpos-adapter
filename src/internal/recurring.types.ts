/**
 * Raw EsnekPos API types for recurring payment endpoints.
 *
 * Internal use only — never export from src/index.ts.
 */

import type { RawBaseResponse } from './shared.types.js';

/**
 * @endpoint POST /api/pay/RecurringPayment
 * @req ORDER_REF_NUMBER* TOTAL_AMOUNT* CURRENCY_CODE* RECURRING_PAYMENT_COUNT* RECURRING_PAYMENT_PERIOD*(Monthly|Weekly|Daily) RECURRING_PAYMENT_START_DATE* CUSTOMER_GSM* CUSTOMER_EMAIL* CUSTOMER_NAME* CUSTOMER_ADDRESS* DEALER_REF_NO* CARD:{CC_HOLDER_NAME* CC_NO* EXPIRY_DATE* CVVC*}
 * @res extends RawBaseResponse
 */
// --- /api/pay/RecurringPayment ---

export interface RawRecurringPaymentResponse extends RawBaseResponse {}

/**
 * @endpoint POST /api/services/RecurringPaymentCancel
 * @req ORDER_REF_NUMBER* — omit CARD_ID to cancel plan; include CARD_ID to remove card
 * @res RETURN_CODE RETURN_MESSAGE
 * @note Same response shape for both cancel-plan and remove-card operations.
 */
// --- /api/services/RecurringPaymentCancel ---
// Used for both recurring cancellation and card removal.
// Differentiated by presence of CARD_ID in the request.

export interface RawRecurringCancelResponse {
  RETURN_CODE: string;
  RETURN_MESSAGE: string;
}

/**
 * @endpoint POST /api/services/RecurringPaymentCardAdd
 * @req ORDER_REF_NUMBER* CARD:{CC_HOLDER_NAME* CC_NO* EXPIRY_DATE* CVVC*}
 * @res RETURN_CODE RETURN_MESSAGE
 */
// --- /api/services/RecurringPaymentCardAdd ---

export interface RawRecurringCardAddResponse {
  RETURN_CODE: string;
  RETURN_MESSAGE: string;
}

/**
 * @endpoint POST /api/services/RecurringPaymentQuery
 * @req DEALER_REF_NO*
 * @res extends RawBaseResponse + ID DATE RECURRING_COUNT TRY_COUNT_LIMIT AMOUNT CURRENCY SUCCESS_COUNT DEALER_REF_NO COSTUMER_GSM COSTUMER_EMAIL COSTUMER_NAME COSTUMER_ADRESS(sic) RECURRING_PAYMENT_TRANSACTIONS:[{RECURRING_NO PAYMENT_DATE REF_NO STATUS TRIES_COUNT SUCCESS_DATE? PAYMENT_ID? IS_ACTIVE RECURRING_PAYMENT_TRIES:[{PAYMENT_ID STATUS DESCRIPTION TRY_DATE}]}]
 * @note COSTUMER_* fields are misspelled in the API (missing 'S'). SUCCESS_COUNT may be SUCCES_COUNT in some API versions.
 */
// --- /api/services/RecurringPaymentQuery ---

export interface RawRecurringPaymentTry {
  PAYMENT_ID: string;
  STATUS: string;
  DESCRIPTION: string;
  TRY_DATE: string;
}

export interface RawRecurringPaymentTransaction {
  RECURRING_NO: number;
  PAYMENT_DATE: string;
  REF_NO: string;
  STATUS: string;
  TRIES_COUNT: string;
  SUCCESS_DATE: string | null;
  PAYMENT_ID: string | null;
  IS_ACTIVE: string;
  RECURRING_PAYMENT_TRIES: RawRecurringPaymentTry[];
}

export interface RawRecurringPaymentQueryResponse extends RawBaseResponse {
  ID: number;
  DATE: string;
  RECURRING_COUNT: string;
  TRY_COUNT_LIMIT: number;
  AMOUNT: string;
  CURRENCY: string;
  /** Note: API uses SUCCES_COUNT (typo in EsnekPos API). */
  SUCCESS_COUNT: string;
  DEALER_REF_NO: string;
  COSTUMER_GSM: string;
  COSTUMER_EMAIL: string;
  COSTUMER_NAME: string;
  COSTUMER_ADRESS: string;
  RECURRING_PAYMENT_TRANSACTIONS: RawRecurringPaymentTransaction[];
}

/**
 * @endpoint POST /api/services/GetRecurringPaymentList
 * @req START_DATE* END_DATE*
 * @res extends RawBaseResponse + RECURRING_PAYMENTS:[{ID DATE RECURRING_COUNT TRY_COUNT_LIMIT AMOUNT CURRENCY SUCCESS_COUNT DEALER_REF_NO COSTUMER_GSM COSTUMER_EMAIL COSTUMER_NAME COSTUMER_ADRESS(sic) RECURRING_PAYMENT_TRANSACTIONS:[...]}]
 */
// --- /api/services/GetRecurringPaymentList ---

export interface RawRecurringPaymentListItem {
  ID: number;
  DATE: string;
  RECURRING_COUNT: string;
  TRY_COUNT_LIMIT: number;
  AMOUNT: string;
  CURRENCY: string;
  SUCCESS_COUNT: string;
  DEALER_REF_NO: string;
  COSTUMER_GSM: string;
  COSTUMER_EMAIL: string;
  COSTUMER_NAME: string;
  COSTUMER_ADRESS: string;
  RECURRING_PAYMENT_TRANSACTIONS: RawRecurringPaymentTransaction[];
}

export interface RawGetRecurringPaymentListResponse extends RawBaseResponse {
  RECURRING_PAYMENTS: RawRecurringPaymentListItem[];
}
