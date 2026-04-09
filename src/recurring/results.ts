import type {
  RawGetRecurringPaymentListResponse,
  RawRecurringCancelResponse,
  RawRecurringCardAddResponse,
  RawRecurringPaymentQueryResponse,
  RawRecurringPaymentResponse,
  RawRecurringPaymentTransaction,
} from '../internal/recurring.types.js';

// ---------------------------------------------------------------------------
// Output model types
// ---------------------------------------------------------------------------

/**
 * A single try (attempt) for a recurring payment instalment.
 */
export interface RecurringPaymentTry {
  paymentId: string;
  status: string;
  description: string;
  tryDate: string;
}

/**
 * One instalment in a recurring payment plan.
 */
export interface RecurringPaymentTransaction {
  recurringNo: number;
  paymentDate: string;
  /** EsnekPos reference number for this instalment. */
  refNo: string;
  status: string;
  triesCount: string;
  successDate: string | null;
  paymentId: string | null;
  isActive: string;
  tries: RecurringPaymentTry[];
}

/** @internal */
function normalizeTransaction(t: RawRecurringPaymentTransaction): RecurringPaymentTransaction {
  return {
    recurringNo: t.RECURRING_NO,
    paymentDate: t.PAYMENT_DATE,
    refNo: t.REF_NO,
    status: t.STATUS,
    triesCount: t.TRIES_COUNT,
    successDate: t.SUCCESS_DATE,
    paymentId: t.PAYMENT_ID,
    isActive: t.IS_ACTIVE,
    tries: t.RECURRING_PAYMENT_TRIES.map((tr) => ({
      paymentId: tr.PAYMENT_ID,
      status: tr.STATUS,
      description: tr.DESCRIPTION,
      tryDate: tr.TRY_DATE,
    })),
  };
}

/**
 * A single recurring plan returned in a list.
 */
export interface RecurringPlanListItem {
  id: number;
  date: string;
  recurringCount: string;
  tryCountLimit: number;
  amount: string;
  currency: string;
  successCount: string;
  dealerRefNo: string;
  customerPhone: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  transactions: RecurringPaymentTransaction[];
}

// ---------------------------------------------------------------------------
// Result classes
// ---------------------------------------------------------------------------

/**
 * Result of `client.recurring.createPlan`.
 */
export class CreateRecurringPlanResult {
  /** @internal */
  constructor(private readonly raw: RawRecurringPaymentResponse) {}

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

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
    };
  }
}

/**
 * Result of `client.recurring.cancelPlan`.
 */
export class CancelRecurringPlanResult {
  /** @internal */
  constructor(private readonly raw: RawRecurringCancelResponse) {}

  /** `true` when `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.RETURN_CODE === '0';
  }

  get returnCode(): string {
    return this.raw.RETURN_CODE;
  }

  get message(): string {
    return this.raw.RETURN_MESSAGE;
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
    };
  }
}

/**
 * Result of `client.recurring.removeCard`.
 */
export class RemoveRecurringCardResult {
  /** @internal */
  constructor(private readonly raw: RawRecurringCancelResponse) {}

  /** `true` when `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.RETURN_CODE === '0';
  }

  get returnCode(): string {
    return this.raw.RETURN_CODE;
  }

  get message(): string {
    return this.raw.RETURN_MESSAGE;
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
    };
  }
}

/**
 * Result of `client.recurring.addCard`.
 */
export class AddRecurringCardResult {
  /** @internal */
  constructor(private readonly raw: RawRecurringCardAddResponse) {}

  /** `true` when `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.RETURN_CODE === '0';
  }

  get returnCode(): string {
    return this.raw.RETURN_CODE;
  }

  get message(): string {
    return this.raw.RETURN_MESSAGE;
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      returnCode: this.returnCode,
      message: this.message,
    };
  }
}

/**
 * Result of `client.recurring.queryPlan`.
 */
export class QueryRecurringPlanResult {
  /** @internal */
  constructor(private readonly raw: RawRecurringPaymentQueryResponse) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE === '0';
  }

  get id(): number {
    return this.raw.ID;
  }

  get date(): string {
    return this.raw.DATE;
  }

  get recurringCount(): string {
    return this.raw.RECURRING_COUNT;
  }

  get tryCountLimit(): number {
    return this.raw.TRY_COUNT_LIMIT;
  }

  get amount(): string {
    return this.raw.AMOUNT;
  }

  get currency(): string {
    return this.raw.CURRENCY;
  }

  /**
   * Number of successful charges so far.
   * Note: The EsnekPos API uses `SUCCES_COUNT` (typo) — this getter normalises it.
   */
  get successCount(): string {
    return this.raw.SUCCESS_COUNT;
  }

  get dealerRefNo(): string {
    return this.raw.DEALER_REF_NO;
  }

  get customerPhone(): string {
    return this.raw.COSTUMER_GSM;
  }

  get customerEmail(): string {
    return this.raw.COSTUMER_EMAIL;
  }

  get customerName(): string {
    return this.raw.COSTUMER_NAME;
  }

  get customerAddress(): string {
    return this.raw.COSTUMER_ADRESS;
  }

  get transactions(): RecurringPaymentTransaction[] {
    return this.raw.RECURRING_PAYMENT_TRANSACTIONS.map(normalizeTransaction);
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      id: this.id,
      date: this.date,
      recurringCount: this.recurringCount,
      tryCountLimit: this.tryCountLimit,
      amount: this.amount,
      currency: this.currency,
      successCount: this.successCount,
      dealerRefNo: this.dealerRefNo,
      customerPhone: this.customerPhone,
      customerEmail: this.customerEmail,
      customerName: this.customerName,
      customerAddress: this.customerAddress,
      transactions: this.transactions,
    };
  }
}

/**
 * Result of `client.recurring.listPlans`.
 */
export class ListRecurringPlansResult {
  /** @internal */
  constructor(private readonly raw: RawGetRecurringPaymentListResponse) {}

  /** `true` when `STATUS === 'SUCCESS'` and `RETURN_CODE === '0'`. */
  get isAccepted(): boolean {
    return this.raw.STATUS === 'SUCCESS' && this.raw.RETURN_CODE === '0';
  }

  get plans(): RecurringPlanListItem[] {
    return this.raw.RECURRING_PAYMENTS.map((p) => ({
      id: p.ID,
      date: p.DATE,
      recurringCount: p.RECURRING_COUNT,
      tryCountLimit: p.TRY_COUNT_LIMIT,
      amount: p.AMOUNT,
      currency: p.CURRENCY,
      successCount: p.SUCCESS_COUNT,
      dealerRefNo: p.DEALER_REF_NO,
      customerPhone: p.COSTUMER_GSM,
      customerEmail: p.COSTUMER_EMAIL,
      customerName: p.COSTUMER_NAME,
      customerAddress: p.COSTUMER_ADRESS,
      transactions: p.RECURRING_PAYMENT_TRANSACTIONS.map(normalizeTransaction),
    }));
  }

  toJSON(): object {
    return {
      isAccepted: this.isAccepted,
      plans: this.plans,
    };
  }
}
