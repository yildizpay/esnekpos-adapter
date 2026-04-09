import type {
  RawPaymentRequestPayment,
  RawSendPaymentRequestQueryResponse,
  RawSendPaymentRequestResponse,
} from '../internal/payment-request.types.js';

// ---------------------------------------------------------------------------
// Output model types
// ---------------------------------------------------------------------------

/**
 * A single payment attempt associated with a payment request.
 */
export interface PaymentRequestPaymentItem {
  refNo: string;
  paymentStatus: string;
  date: string;
  paymentDate: string;
  amount: string;
  orderRefNo: string;
  installment: string;
  commission: number;
  commissionRate: string;
  /** Transaction ID if the payment succeeded; `null` otherwise. */
  successTransactionId: number | null;
}

/** @internal */
function normalizePayment(p: RawPaymentRequestPayment): PaymentRequestPaymentItem {
  return {
    refNo: p.REFNO,
    paymentStatus: p.PAYMENT_STATUS,
    date: p.DATE,
    paymentDate: p.PAYMENT_DATE,
    amount: p.AMOUNT,
    orderRefNo: p.ORDER_REF_NO,
    installment: p.INSTALLMENT,
    commission: p.COMMISSION,
    commissionRate: p.COMMISSION_RATE,
    successTransactionId: p.SUCCESS_TRANSACTION_ID,
  };
}

// ---------------------------------------------------------------------------
// Result classes
// ---------------------------------------------------------------------------

/**
 * Result of `client.paymentRequest.send`.
 */
export class SendPaymentRequestResult {
  /** @internal */
  constructor(private readonly raw: RawSendPaymentRequestResponse) {}

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

  /** The generated payment page URL. Only present on success. */
  get url(): string {
    return this.raw.URL;
  }

  /**
   * Unique ID for this payment request.
   * Pass this to `client.paymentRequest.queryStatus` to check payment status.
   */
  get requestId(): string {
    return this.raw.SendPaymentRequestId;
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
      url: this.url,
      requestId: this.requestId,
    };
  }
}

/**
 * Result of `client.paymentRequest.queryStatus`.
 */
export class QueryPaymentRequestStatusResult {
  /** @internal */
  constructor(private readonly raw: RawSendPaymentRequestQueryResponse) {}

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

  /** All payment attempts associated with this payment request. */
  get payments(): PaymentRequestPaymentItem[] {
    return this.raw.PAYMENTS.map(normalizePayment);
  }

  /** Returns the first successful payment, if any. */
  get successfulPayment(): PaymentRequestPaymentItem | undefined {
    return this.payments.find((p) => p.successTransactionId !== null);
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
      payments: this.payments,
    };
  }
}
