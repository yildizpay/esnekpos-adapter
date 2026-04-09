import type { RawCommonPaymentResponse, RawPay3DResponse } from '../internal/payment.types.js';

/**
 * Result of a 3D payment initiation (`client.payment.pay3D`).
 *
 * A successful result means EsnekPos **accepted** the initiation request and
 * returned a 3D redirect URL. The actual payment is not yet complete —
 * the user must be redirected to `redirectUrl` to finish 3D verification.
 *
 * Always verify the final status via `client.query.processQuery` after receiving
 * the callback. Do not rely solely on the callback payload.
 *
 * @example
 * ```typescript
 * const result = await client.payment.pay3D(params);
 *
 * if (result.isAccepted) {
 *   return redirect(result.redirectUrl);
 * }
 * ```
 */
export class Pay3DInitResult {
  /**
   * @internal Instantiated by the payment service. Do not construct directly.
   */
  constructor(private readonly raw: RawPay3DResponse) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE === '0';
  }

  /**
   * The 3D Secure redirect URL. Redirect the user here to complete verification.
   * Only meaningful when `isAccepted` is `true`.
   */
  get redirectUrl(): string {
    return this.raw.URL_3DS;
  }

  /** EsnekPos-assigned reference number for this transaction. */
  get refNo(): string {
    return this.raw.REFNO;
  }

  /** The `orderRefNumber` echoed back from EsnekPos. */
  get orderRefNumber(): string {
    return this.raw.ORDER_REF_NUMBER;
  }

  /** Masked card number as returned by EsnekPos (e.g. `415956******1991`). */
  get maskedCardNumber(): string | null {
    return this.raw.CUSTOMER_CC_NUMBER;
  }

  /** The card owner name as returned by EsnekPos. */
  get cardOwnerName(): string | null {
    return this.raw.CUSTOMER_CC_NAME;
  }

  /** `true` if 3D verification was skipped by the bank (`IS_NOT_3D_PAYMENT`). */
  get isNon3DPayment(): boolean {
    return this.raw.IS_NOT_3D_PAYMENT;
  }

  /** Transaction date string as returned by EsnekPos. */
  get date(): string {
    return this.raw.DATE;
  }

  /**
   * Returns a plain object representation safe for logging.
   * Raw EsnekPos API fields are never included.
   */
  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      redirectUrl: this.redirectUrl,
      refNo: this.refNo,
      orderRefNumber: this.orderRefNumber,
      maskedCardNumber: this.maskedCardNumber,
      cardOwnerName: this.cardOwnerName,
      isNon3DPayment: this.isNon3DPayment,
      date: this.date,
    };
  }
}

/**
 * Result of a hosted payment page initiation (`client.payment.commonPage`).
 *
 * A successful result means EsnekPos accepted the request and returned a URL
 * to their hosted payment page. Redirect the user there to enter card details.
 *
 * @example
 * ```typescript
 * const result = await client.payment.commonPage(params);
 *
 * if (result.isAccepted) {
 *   return redirect(result.redirectUrl);
 * }
 * ```
 */
export class CommonPaymentResult {
  /**
   * @internal Instantiated by the payment service. Do not construct directly.
   */
  constructor(private readonly raw: RawCommonPaymentResponse) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE === '0';
  }

  /**
   * URL to the EsnekPos hosted payment page. Redirect the user here.
   * Only meaningful when `isAccepted` is `true`.
   */
  get redirectUrl(): string {
    return this.raw.URL_3DS;
  }

  /** EsnekPos-assigned reference number. */
  get refNo(): string {
    return this.raw.REFNO;
  }

  /** The `orderRefNumber` echoed back from EsnekPos. */
  get orderRefNumber(): string {
    return this.raw.ORDER_REF_NUMBER;
  }

  /** Transaction date string as returned by EsnekPos. */
  get date(): string {
    return this.raw.DATE;
  }

  /**
   * Returns a plain object representation safe for logging.
   * Raw EsnekPos API fields are never included.
   */
  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      redirectUrl: this.redirectUrl,
      refNo: this.refNo,
      orderRefNumber: this.orderRefNumber,
      date: this.date,
    };
  }
}
