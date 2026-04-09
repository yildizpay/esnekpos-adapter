import type { RawCallbackPayload } from '../internal/callback.types.js';

/**
 * Customer information extracted from the payment callback.
 */
export interface CallbackCustomerInfo {
  /** Customer's full name. */
  name: string | null;
  /** Customer's email address. */
  email: string | null;
  /** Customer's phone number. */
  phone: string | null;
  /** Customer's address. */
  address: string | null;
  /** Masked card number (e.g. `415956******1991`). */
  maskedCardNumber: string | null;
  /** Name on the card. */
  cardOwnerName: string | null;
}

/**
 * Result of parsing the EsnekPos payment callback via `client.callback.parse`.
 *
 * Represents the payment outcome delivered to the merchant's `backUrl` via FORM POST.
 *
 * > **Important:** Always verify the final payment status via `client.query.processQuery`.
 * > Do not rely solely on the callback — callbacks can be replayed or tampered with.
 * > Always call `client.callback.verify` before parsing.
 *
 * @example
 * ```typescript
 * app.post('/payment/callback', (req, res) => {
 *   const isValid = client.callback.verify(req.body, req.body.HASH);
 *   if (!isValid) return res.status(400).end();
 *
 *   const result = client.callback.parse(req.body);
 *   if (result.isSuccess) {
 *     await orderService.confirm(result.orderRefNumber, result.refNo);
 *   }
 * });
 * ```
 */
export class PaymentCallbackResult {
  /**
   * @internal Instantiated by the callback service. Do not construct directly.
   */
  constructor(private readonly raw: RawCallbackPayload) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE === '0'`. */
  get isSuccess(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE === '0';
  }

  /** `true` when the payment was cancelled before completion. */
  get isCancelled(): boolean {
    return this.raw.STATUS === 'ORDER_CANCEL';
  }

  /** `RETURN_CODE` from the callback payload. */
  get returnCode(): string {
    return this.raw.RETURN_CODE;
  }

  /** `RETURN_MESSAGE` from the callback payload. */
  get returnMessage(): string {
    return this.raw.RETURN_MESSAGE;
  }

  /** Turkish return message (`RETURN_MESSAGE_TR`), if present. */
  get returnMessageTr(): string | null {
    return this.raw.RETURN_MESSAGE_TR ?? null;
  }

  /** Bank error code (`ERROR_CODE`), if the payment failed. */
  get errorCode(): string | null {
    return this.raw.ERROR_CODE ?? null;
  }

  /** The `orderRefNumber` assigned by the merchant. */
  get orderRefNumber(): string {
    return this.raw.ORDER_REF_NUMBER;
  }

  /** EsnekPos reference number for this payment. */
  get refNo(): string {
    return this.raw.REFNO;
  }

  /** Transaction date string. */
  get date(): string {
    return this.raw.DATE;
  }

  /** Installment count. `0` if not present in payload. */
  get installment(): number {
    return this.raw.INSTALLMENT !== undefined ? Number(this.raw.INSTALLMENT) : 0;
  }

  /** Payment amount. */
  get amount(): string | null {
    return this.raw.AMOUNT ?? null;
  }

  /** Commission amount. */
  get commission(): string | null {
    return this.raw.COMMISSION ?? null;
  }

  /** Commission rate. */
  get commissionRate(): string | null {
    return this.raw.COMMISSION_RATE ?? null;
  }

  /** Bank authorization code. Only present in 3D payment callbacks. */
  get bankAuthCode(): string | null {
    return this.raw.BANK_AUTH_CODE ?? null;
  }

  /** Customer information extracted from the callback. */
  get customer(): CallbackCustomerInfo {
    return {
      name: this.raw.CUSTOMER_NAME ?? null,
      email: this.raw.CUSTOMER_MAIL ?? null,
      phone: this.raw.CUSTOMER_PHONE ?? null,
      address: this.raw.CUSTOMER_ADDRESS ?? null,
      maskedCardNumber: this.raw.CUSTOMER_CC_NUMBER ?? null,
      cardOwnerName: this.raw.CUSTOMER_CC_NAME ?? null,
    };
  }

  /**
   * Returns a plain object representation safe for logging.
   * Masked card number is used — raw card data is never included.
   */
  toJSON(): object {
    return {
      isSuccess: this.isSuccess,
      isCancelled: this.isCancelled,
      returnCode: this.returnCode,
      returnMessage: this.returnMessage,
      orderRefNumber: this.orderRefNumber,
      refNo: this.refNo,
      date: this.date,
      installment: this.installment,
      amount: this.amount,
      customer: this.customer,
    };
  }
}
