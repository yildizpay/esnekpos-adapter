/**
 * Raw EsnekPos API types for marketplace (pazaryeri) endpoints.
 *
 * Internal use only — never export from src/index.ts.
 */

/**
 * @endpoint POST /api/services/SubMerchantSet
 * @req NAME* OWNER_NAME* OWNER_SURNAME* OWNER_IDENTITY_NUMBER* EMAIL* GSM* COMPANY_NAME* TAX_OFFICE* TAX_NUMBER* BANK_NAME* TYPE*(PERSONAL|PERSONAL_COMPANY|COMPANY) EXTERNAL_ID* BANK_ACCOUNTS:[{IBAN* CURRENCY*}]*
 * @res {Data? ResultCode ResultMessage Exception?}
 * @note Response uses PascalCase (ResultCode, ResultMessage) — different from all other endpoints.
 * @note SUCCESS when ResultMessage==='SUCCESS' && ResultCode.startsWith('0') (can be '0' or '00').
 */
// --- /api/services/SubMerchantSet ---

export interface RawSubMerchantSetResponse {
  /** Payload data returned by the API (usually null). */
  Data: string | null;
  /** Result code — `'0'` or `'00'` on success. */
  ResultCode: string;
  ResultMessage: string;
  /** Exception detail when the request fails. Usually null on success. */
  Exception: string | null;
}

/**
 * @endpoint POST /api/services/SubMerchantQuery
 * @req EXTERNAL_ID*
 * @res {STATUS RETURN_CODE RETURN_MESSAGE MERCHANT_DETAIL:{NAME OWNER_NAME OWNER_SURNAME OWNER_IDENTITY_NUMBER EMAIL GSM COMPANY_NAME TAX_OFFICE TAX_NUMBER BANK_NAME TYPE IS_ACTIVE? BANK_ACCOUNTS:[{IBAN CURRENCY}]}}
 * @note Response key is MERCHANT_DETAIL (not SUBMERCHANT_DETAIL as docs table says — actual JSON uses MERCHANT_DETAIL).
 */
// --- /api/services/SubMerchantQuery ---

export interface RawBankAccount {
  IBAN: string;
  CURRENCY: string;
}

export interface RawSubMerchantDetail {
  NAME: string;
  OWNER_NAME: string;
  OWNER_SURNAME: string;
  OWNER_IDENTITY_NUMBER: string;
  EMAIL: string;
  GSM: string;
  COMPANY_NAME: string;
  TAX_OFFICE: string;
  TAX_NUMBER: string;
  BANK_NAME: string;
  TYPE: string;
  IS_ACTIVE: boolean | null;
  BANK_ACCOUNTS: RawBankAccount[];
}

export interface RawSubMerchantQueryResponse {
  RETURN_CODE: string;
  RETURN_MESSAGE: string;
  STATUS: string;
  /**
   * Note: The EsnekPos API returns this field as `MERCHANT_DETAIL` in the
   * actual response despite documentation referring to it as `SUBMERCHANT_DETAIL`.
   */
  MERCHANT_DETAIL: RawSubMerchantDetail;
}

/**
 * @endpoint POST /api/services/AddSubMerchantAmount
 * @req ORDER_REF_NUMBER* EXTERNAL_ID* AMOUNT*(negative value to reduce)
 * @res {STATUS RETURN_CODE RETURN_MESSAGE ORDER_REF_NUMBER? REFNO?}
 * @note SUCCESS when STATUS==='SUCCESS' && RETURN_CODE.startsWith('0') (can be '0' or '00').
 */
// --- /api/services/AddSubMerchantAmount ---

export interface RawAddSubMerchantAmountResponse {
  RETURN_CODE: string;
  RETURN_MESSAGE: string;
  STATUS: string;
  ORDER_REF_NUMBER: string | number;
  REFNO: string | null;
}
