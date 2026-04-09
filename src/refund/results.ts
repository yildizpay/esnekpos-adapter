import type { RawOrderReturnResponse } from '../internal/refund.types.js';

/**
 * Result of `client.refund.refund`.
 *
 * A successful result means the refund request was **registered**. When `syncWithPos`
 * is `false` (default), the bank may process the refund asynchronously.
 * Use `client.query.processQuery` to verify the final refund status.
 *
 * @example
 * ```typescript
 * const result = await client.refund.refund({ orderRefNumber: 'ORDER-001', amount: 150 });
 *
 * if (result.isAccepted) {
 *   console.log(result.message); // '29,99 ₺ iade talebiniz başarıyla kaydedilmiştir.'
 * }
 * ```
 */
export class RefundResult {
  /**
   * @internal Instantiated by the refund service. Do not construct directly.
   */
  constructor(private readonly raw: RawOrderReturnResponse) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE === '0';
  }

  /**
   * Human-readable confirmation message from EsnekPos.
   * @example '29,99 ₺ iade talebiniz başarıyla kaydedilmiştir.'
   */
  get message(): string {
    return this.raw.RETURN_MESSAGE;
  }

  /** The `orderRefNumber` echoed back from EsnekPos. May be null in some cases. */
  get orderRefNumber(): string | null {
    return this.raw.ORDER_REF_NUMBER;
  }

  /** EsnekPos reference number for the refund transaction. */
  get refNo(): string | null {
    return this.raw.REFNO;
  }

  /**
   * Internal transaction ID assigned to this refund.
   * Only present when `syncWithPos` was `true` and the bank confirmed immediately.
   */
  get transactionId(): number | null {
    return this.raw.TRANSACTION_ID;
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      message: this.message,
      orderRefNumber: this.orderRefNumber,
      refNo: this.refNo,
      transactionId: this.transactionId,
    };
  }
}
