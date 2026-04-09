import type {
  RawAddSubMerchantAmountResponse,
  RawSubMerchantDetail,
  RawSubMerchantQueryResponse,
  RawSubMerchantSetResponse,
} from '../internal/marketplace.types.js';
import type { SubMerchantBankAccount } from './params.js';

// ---------------------------------------------------------------------------
// Output model types
// ---------------------------------------------------------------------------

/**
 * Sub-merchant detail as returned by EsnekPos.
 */
export interface MarketplaceSubMerchant {
  name: string;
  ownerName: string;
  ownerSurname: string;
  ownerIdentityNumber: string;
  email: string;
  gsm: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  bankName: string;
  type: string;
  isActive: boolean | null;
  bankAccounts: SubMerchantBankAccount[];
}

/** @internal */
function normalizeDetail(d: RawSubMerchantDetail): MarketplaceSubMerchant {
  return {
    name: d.NAME,
    ownerName: d.OWNER_NAME,
    ownerSurname: d.OWNER_SURNAME,
    ownerIdentityNumber: d.OWNER_IDENTITY_NUMBER,
    email: d.EMAIL,
    gsm: d.GSM,
    companyName: d.COMPANY_NAME,
    taxOffice: d.TAX_OFFICE,
    taxNumber: d.TAX_NUMBER,
    bankName: d.BANK_NAME,
    type: d.TYPE,
    isActive: d.IS_ACTIVE,
    bankAccounts: d.BANK_ACCOUNTS.map((b) => ({
      iban: b.IBAN,
      currency: b.CURRENCY,
    })),
  };
}

// ---------------------------------------------------------------------------
// Result classes
// ---------------------------------------------------------------------------

/**
 * Result of `client.marketplace.setSubMerchant`.
 */
export class SetSubMerchantResult {
  /** @internal */
  constructor(private readonly raw: RawSubMerchantSetResponse) {}

  /** `true` when `ResultMessage === 'SUCCESS'` and `ResultCode` starts with `'0'`. */
  get isAccepted(): boolean {
    return this.raw.ResultMessage === 'SUCCESS' && this.raw.ResultCode.startsWith('0');
  }

  get resultCode(): string {
    return this.raw.ResultCode;
  }

  get message(): string {
    return this.raw.ResultMessage;
  }

  /** Exception detail returned by EsnekPos, if any. */
  get exception(): string | null {
    return this.raw.Exception;
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      resultCode: this.resultCode,
      message: this.message,
      exception: this.exception,
    };
  }
}

/**
 * Result of `client.marketplace.querySubMerchant`.
 */
export class QuerySubMerchantResult {
  /** @internal */
  constructor(private readonly raw: RawSubMerchantQueryResponse) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE === '0';
  }

  get returnCode(): string {
    return this.raw.RETURN_CODE;
  }

  get message(): string {
    return this.raw.RETURN_MESSAGE;
  }

  get detail(): MarketplaceSubMerchant {
    return normalizeDetail(this.raw.MERCHANT_DETAIL);
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
      detail: this.detail,
    };
  }
}

/**
 * Result of `client.marketplace.reduceSubMerchantAmount`.
 */
export class ReduceSubMerchantAmountResult {
  /** @internal */
  constructor(private readonly raw: RawAddSubMerchantAmountResponse) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE` starts with `'0'`. */
  get isAccepted(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE.startsWith('0');
  }

  get returnCode(): string {
    return this.raw.RETURN_CODE;
  }

  get message(): string {
    return this.raw.RETURN_MESSAGE;
  }

  get orderRefNumber(): string {
    return String(this.raw.ORDER_REF_NUMBER);
  }

  get refNo(): string | null {
    return this.raw.REFNO;
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
      orderRefNumber: this.orderRefNumber,
      refNo: this.refNo,
    };
  }
}
