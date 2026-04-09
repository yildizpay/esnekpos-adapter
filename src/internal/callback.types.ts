/**
 * Raw EsnekPos callback FORM POST payload types.
 *
 * Internal use only — never export from src/index.ts.
 * EsnekPos posts callbacks as application/x-www-form-urlencoded.
 * All values are strings.
 */

/**
 * @endpoint FORM POST → BACK_URL (set at payment initiation)
 * @note EsnekPos posts as application/x-www-form-urlencoded after 3D or common-page payment completes.
 * @res DATE HASH ORDER_REF_NUMBER REFNO RETURN_CODE RETURN_MESSAGE STATUS AMOUNT? INSTALLMENT? COMMISSION? COMMISSION_RATE? CUSTOMER_NAME? CUSTOMER_MAIL? CUSTOMER_PHONE? CUSTOMER_ADDRESS? CUSTOMER_CC_NUMBER? CUSTOMER_CC_NAME? BANK_AUTH_CODE?(3D only) RETURN_MESSAGE_TR? ERROR_CODE?
 * @warning Callback alone is NOT proof of payment — always verify with ProcessQuery.
 */
export interface RawCallbackPayload {
  DATE: string;
  HASH: string;
  ORDER_REF_NUMBER: string;
  REFNO: string;
  RETURN_CODE: string;
  RETURN_MESSAGE: string;
  STATUS: string;
  RETURN_MESSAGE_TR?: string;
  ERROR_CODE?: string;
  CUSTOMER_NAME?: string;
  CUSTOMER_MAIL?: string;
  CUSTOMER_PHONE?: string;
  CUSTOMER_ADDRESS?: string;
  CUSTOMER_CC_NUMBER?: string;
  CUSTOMER_CC_NAME?: string;
  COMMISSION?: string;
  COMMISSION_RATE?: string;
  AMOUNT?: string;
  INSTALLMENT?: string;
  /** Only present in 3D payment callbacks. */
  BANK_AUTH_CODE?: string;
}
