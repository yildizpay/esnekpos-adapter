import type {
  RawGetPaymentListResponse,
  RawPaymentListItem,
  RawProcessQueryDetailPayment,
  RawProcessQueryDetailResponse,
  RawProcessQueryResponse,
} from '../internal/query.types.js';
import type { TransactionStatusId } from '../shared/common.js';

// ---------------------------------------------------------------------------
// Shared output model types (used inside result classes)
// ---------------------------------------------------------------------------

/**
 * Transfer detail for a payment or sub-merchant amount.
 */
export interface AmountTransferDetail {
  /** Transfer record identifier. */
  extractId: number;
  /** Amount transferred. */
  sentAmount: string;
  /** Date the transfer was made. */
  sentDate: string;
}

/**
 * Sub-merchant payment detail within a transaction.
 * Only populated for marketplace merchants.
 */
export interface SubMerchantDetail {
  /** Sub-merchant's identifier in the marketplace system. */
  externalId: string;
  /** Amount allocated to this sub-merchant. */
  amount: string;
  /** Date of the allocation. */
  date: string;
  /** Transfer detail for this sub-merchant's amount. */
  transferDetail: AmountTransferDetail | null;
}

/**
 * A single transaction movement within a payment lifecycle.
 * Payments may have multiple transactions (e.g. pending → 3D → success/cancel).
 */
export interface TransactionItem {
  /** Unique transaction identifier. */
  transactionId: number;
  /** Human-readable status (e.g. `'Ödeme - Başarılı'`). */
  statusName: string;
  /** Machine-readable status ID. */
  statusId: TransactionStatusId;
  /** Transaction amount. */
  amount: string;
  /** Transaction date. */
  date: string;
  /** Transfer detail for the merchant's portion. */
  merchantTransferDetail: AmountTransferDetail | null;
  /** Sub-merchant breakdowns. Non-null only for marketplace merchants. */
  subMerchantDetails: SubMerchantDetail[] | null;
}

/**
 * A product attached to a payment record, as returned by query endpoints.
 */
export interface PaymentProduct {
  /** Internal product record ID. */
  id: number | null;
  /** Payment ID this product belongs to. */
  paymentId: number | null;
  /** Merchant-assigned product ID. */
  productId: string;
  /** Product name. */
  name: string;
  /** Product category. */
  category: string;
  /** Product description. */
  description: string;
  /** Product amount. */
  amount: number | null;
}

/**
 * A single payment record in the list returned by `client.query.listPayments`.
 */
export interface PaymentListItem {
  /** Internal EsnekPos payment ID. */
  id: number;
  /** Merchant identifier. */
  merchant: string;
  /** Merchant dealer ID. */
  dealerId: number;
  /** Merchant dealer code. */
  dealerCode: number;
  /** Date the payment was recorded in EsnekPos. */
  insertDateTime: string;
  /** Card type (e.g. `'VISA'`). */
  cardType: string;
  /** Masked card number. */
  maskedCardNumber: string;
  /** Name on the card. */
  cardName: string;
  /** Card issuing bank. */
  cardBankName: string;
  /** Card family/product. */
  cardFamily: string | null;
  /** Payment currency. */
  currency: string;
  /** Virtual POS used for processing. */
  virtualPosName: string;
  /** Human-readable payment status. */
  statusName: string;
  /** Machine-readable status ID. */
  statusId: TransactionStatusId;
  /** Installment count. */
  installment: number;
  /** Payment amount. */
  amount: number;
  /** Commission amount. */
  commissionAmount: number;
  /** Commission rate. */
  commissionRate: number;
  /** Merchant-assigned reference code. */
  orderRefNumber: string;
  /** Customer full name. */
  customerName: string;
  /** Customer phone number. */
  customerPhone: string;
  /** Whether a cancellation has been requested. */
  cancelRequested: boolean;
  /** Transaction movements for this payment. */
  transactions: TransactionItem[];
}

// ---------------------------------------------------------------------------
// Result classes
// ---------------------------------------------------------------------------

/**
 * Result of `client.query.processQuery`.
 *
 * Provides the overall payment status and all transaction movements.
 * Always use this to verify payment status after receiving a callback —
 * the callback alone is not sufficient proof of payment.
 *
 * > **Note:** When a payment is cancelled, EsnekPos returns `STATUS === 'ORDER_CANCEL'`
 * > and `RETURN_CODE === '300'`. This is handled transparently via `isCancelled`.
 *
 * @example
 * ```typescript
 * const result = await client.query.processQuery({ orderRefNumber: 'ORDER-001' });
 *
 * if (result.isSuccessful) {
 *   // confirm order
 * } else if (result.isCancelled) {
 *   // mark as cancelled
 * } else if (result.isRefunded) {
 *   // mark as refunded
 * }
 * ```
 */
export class ProcessQueryResult {
  /**
   * @internal Instantiated by the query service. Do not construct directly.
   */
  constructor(private readonly raw: RawProcessQueryResponse) {}

  /**
   * `true` when the last transaction status is `PaymentSuccessful` (STATUS_ID 3).
   */
  get isSuccessful(): boolean {
    return this.lastTransaction?.statusId === 3;
  }

  /**
   * `true` when EsnekPos returns `STATUS === 'ORDER_CANCEL'`.
   * Indicates the payment was cancelled before completion.
   */
  get isCancelled(): boolean {
    return this.raw.STATUS === 'ORDER_CANCEL';
  }

  /**
   * `true` when the last transaction status is `RefundSuccessful` (STATUS_ID 7).
   */
  get isRefunded(): boolean {
    return this.lastTransaction?.statusId === 7;
  }

  /**
   * `true` when the payment is still in progress or awaiting 3D verification.
   */
  get isPending(): boolean {
    return !this.isSuccessful && !this.isCancelled && !this.isRefunded;
  }

  /** EsnekPos reference number. Null when the payment has not yet succeeded. */
  get refNo(): string | null {
    return this.raw.REFNO;
  }

  /**
   * Merchant-assigned order reference number echoed back by EsnekPos.
   * Note: This field is `ORDER_REF_NO` in the API response (not `ORDER_REF_NUMBER`).
   */
  get orderRefNo(): string {
    return this.raw.ORDER_REF_NO;
  }

  /** Payment amount as returned by EsnekPos. */
  get amount(): string {
    return this.raw.AMOUNT;
  }

  /** Installment count. */
  get installment(): string {
    return this.raw.INSTALLMENT;
  }

  /** Date the payment record was created. */
  get date(): string {
    return this.raw.DATE;
  }

  /** Date the payment was processed by the bank. */
  get paymentDate(): string {
    return this.raw.PAYMENT_DATE;
  }

  /**
   * Transaction ID of the successful charge, if any.
   * Null when no transaction has succeeded yet.
   */
  get successTransactionId(): number | null {
    return this.raw.SUCCESS_TRANSACTION_ID;
  }

  /** All transaction movements for this payment, normalized from raw. */
  get transactions(): TransactionItem[] {
    return this.raw.TRANSACTIONS.map((t) => ({
      transactionId: t.TRANSACTION_ID,
      statusName: t.STATUS_NAME,
      statusId: t.STATUS_ID as TransactionStatusId,
      amount: t.AMOUNT,
      date: t.DATE,
      merchantTransferDetail: t.MERCHANT_AMOUNT_TRANSFER_DETAIL
        ? {
            extractId: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.EXTRACT_ID,
            sentAmount: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_AMOUNT,
            sentDate: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_DATE,
          }
        : null,
      subMerchantDetails: t.SUB_MERCHANT_DETAILS
        ? t.SUB_MERCHANT_DETAILS.map((s) => ({
            externalId: s.EXTERNAL_ID,
            amount: s.AMOUNT,
            date: s.DATE,
            transferDetail: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL
              ? {
                  extractId: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.EXTRACT_ID,
                  sentAmount: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_AMOUNT,
                  sentDate: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_DATE,
                }
              : null,
          }))
        : null,
    }));
  }

  get lastTransaction(): TransactionItem | null {
    return this.transactions.at(-1) ?? null;
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return {
      isSuccessful: this.isSuccessful,
      isCancelled: this.isCancelled,
      isRefunded: this.isRefunded,
      isPending: this.isPending,
      orderRefNo: this.orderRefNo,
      refNo: this.refNo,
      amount: this.amount,
      installment: this.installment,
      date: this.date,
      paymentDate: this.paymentDate,
      successTransactionId: this.successTransactionId,
      lastTransaction: this.lastTransaction,
      transactionCount: this.transactions.length,
    };
  }
}

/**
 * Detailed payment record returned by `client.query.processQueryDetail`.
 *
 * Contains full card, customer, commission, and transaction information.
 * Use this when you need rich payment details beyond what `processQuery` provides.
 *
 * @example
 * ```typescript
 * const result = await client.query.processQueryDetail({ orderRefNumber: 'ORDER-001' });
 * console.log(result.maskedCardNumber); // '453144******2283'
 * console.log(result.commissionRate);   // 0.03
 * ```
 */
export class ProcessQueryDetailResult {
  /**
   * @internal Instantiated by the query service. Do not construct directly.
   */
  constructor(private readonly raw: RawProcessQueryDetailResponse) {}

  private get payment(): RawProcessQueryDetailPayment {
    return this.raw.paymentList;
  }

  /** Internal EsnekPos payment ID. */
  get id(): number {
    return this.payment.ID;
  }

  /** Merchant identifier. */
  get merchant(): string {
    return this.payment.MERCHANT;
  }

  /** Merchant's internal dealer name. */
  get dealerName(): string {
    return this.payment.DEALER_NAME;
  }

  /** Card type (e.g. `'VISA'`, `'MASTERCARD'`). */
  get cardType(): string {
    return this.payment.CARD_TYPE;
  }

  /** Card category (e.g. `'CREDIT'`, `'DEBIT'`). */
  get cardCategory(): string {
    return this.payment.CARD_CATEGORY;
  }

  /** Masked card number (e.g. `453144******2283`). */
  get maskedCardNumber(): string {
    return this.payment.CARD_NUMBER;
  }

  /** Bank that issued the card. */
  get cardBankName(): string {
    return this.payment.CARD_BANK_NAME;
  }

  /** Card family/product name (e.g. `'Paraf'`, `'Bonus'`). */
  get cardFamily(): string | null {
    return this.payment.CARD_FAMILY;
  }

  /** Payment currency. */
  get currency(): string {
    return this.payment.CURRENCY;
  }

  /** Virtual POS name used for processing. */
  get virtualPosName(): string {
    return this.payment.VIRTUALPOS_NAME;
  }

  /** Human-readable payment status (e.g. `'Ödeme - Başarılı'`). */
  get statusName(): string {
    return this.payment.STATUS_NAME;
  }

  /** Machine-readable status ID. */
  get statusId(): TransactionStatusId | null {
    return this.payment.STATUS_ID as TransactionStatusId | null;
  }

  /** Installment count. */
  get installment(): number | null {
    return this.payment.INSTALLMENT;
  }

  /** Payment amount. */
  get amount(): number {
    return this.payment.AMOUNT;
  }

  /** Commission amount deducted. */
  get commissionAmount(): number | null {
    return this.payment.COMMISSION_AMOUNT;
  }

  /** Commission rate applied. */
  get commissionRate(): number | null {
    return this.payment.COMMISSION_RATE;
  }

  /** Merchant-assigned reference code (the `orderRefNumber` you provided). */
  get orderRefNumber(): string {
    return this.payment.DEALER_PAYMENT_REF_CODE;
  }

  /** Customer full name. */
  get customerName(): string {
    return this.payment.CUSTOMER_NAME;
  }

  /** Customer phone number. */
  get customerPhone(): string {
    return this.payment.CUSTOMER_GSM;
  }

  /** Whether a cancellation has been requested. */
  get cancelRequested(): boolean | null {
    return this.payment.CANCEL_REQUEST;
  }

  /** Date the payment was recorded in EsnekPos. */
  get insertDateTime(): string {
    return this.payment.INSERT_DATETIME;
  }

  /** All transaction movements for this payment, normalized. */
  get transactions(): TransactionItem[] {
    return this.payment.TRANSACTIONS.map((t) => ({
      transactionId: t.TRANSACTION_ID,
      statusName: t.STATUS_NAME,
      statusId: t.STATUS_ID as TransactionStatusId,
      amount: t.AMOUNT,
      date: t.DATE,
      merchantTransferDetail: t.MERCHANT_AMOUNT_TRANSFER_DETAIL
        ? {
            extractId: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.EXTRACT_ID,
            sentAmount: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_AMOUNT,
            sentDate: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_DATE,
          }
        : null,
      subMerchantDetails: t.SUB_MERCHANT_DETAILS
        ? t.SUB_MERCHANT_DETAILS.map((s) => ({
            externalId: s.EXTERNAL_ID,
            amount: s.AMOUNT,
            date: s.DATE,
            transferDetail: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL
              ? {
                  extractId: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.EXTRACT_ID,
                  sentAmount: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_AMOUNT,
                  sentDate: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_DATE,
                }
              : null,
          }))
        : null,
    }));
  }

  /** Products attached to this payment, normalized. */
  get products(): PaymentProduct[] {
    return this.payment.PRODUCTS.map((p) => ({
      id: p.ID ?? null,
      paymentId: p.PAYMENT_ID ?? null,
      productId: p.PRODUCT_ID,
      name: p.PRODUCT_NAME,
      category: p.PRODUCT_CATEGORY,
      description: p.PRODUCT_DESCRIPTION,
      amount: p.PRODUCT_AMOUNT ?? null,
    }));
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return {
      id: this.id,
      merchant: this.merchant,
      orderRefNumber: this.orderRefNumber,
      statusName: this.statusName,
      statusId: this.statusId,
      amount: this.amount,
      installment: this.installment,
      maskedCardNumber: this.maskedCardNumber,
      cardType: this.cardType,
      cardBankName: this.cardBankName,
      currency: this.currency,
      customerName: this.customerName,
      insertDateTime: this.insertDateTime,
    };
  }
}

/**
 * Result of `client.query.listPayments`.
 *
 * @example
 * ```typescript
 * const result = await client.query.listPayments({ startDate: '2024-01-01', endDate: '2024-01-31' });
 * console.log(`Found ${result.payments.length} payments`);
 * ```
 */
export class ListPaymentsResult {
  /**
   * @internal Instantiated by the query service. Do not construct directly.
   */
  constructor(private readonly raw: RawGetPaymentListResponse) {}

  /** List of payment records matching the date range, normalized. */
  get payments(): PaymentListItem[] {
    return this.raw.paymentList.map((p: RawPaymentListItem) => ({
      id: p.ID,
      merchant: p.MERCHANT,
      dealerId: p.DEALERID,
      dealerCode: p.DEALER_CODE,
      insertDateTime: p.INSERT_DATETIME,
      cardType: p.CARD_TYPE,
      maskedCardNumber: p.CARD_NUMBER,
      cardName: p.CARD_NAME,
      cardBankName: p.CARD_BANK_NAME,
      cardFamily: p.CARD_FAMILY,
      currency: p.CURRENCY,
      virtualPosName: p.VIRTUALPOS_NAME,
      statusName: p.STATUS_NAME,
      statusId: p.STATUS_ID as TransactionStatusId,
      installment: p.INSTALLMENT,
      amount: p.AMOUNT,
      commissionAmount: p.COMMISSION_AMOUNT,
      commissionRate: p.COMMISSION_RATE,
      orderRefNumber: p.DEALER_PAYMENT_REF_CODE,
      customerName: p.CUSTOMER_NAME,
      customerPhone: p.CUSTOMER_GSM,
      cancelRequested: p.CANCEL_REQUEST,
      transactions: p.TRANSACTIONS.map((t) => ({
        transactionId: t.TRANSACTION_ID,
        statusName: t.STATUS_NAME,
        statusId: t.STATUS_ID as TransactionStatusId,
        amount: t.AMOUNT,
        date: t.DATE,
        merchantTransferDetail: t.MERCHANT_AMOUNT_TRANSFER_DETAIL
          ? {
              extractId: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.EXTRACT_ID,
              sentAmount: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_AMOUNT,
              sentDate: t.MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_DATE,
            }
          : null,
        subMerchantDetails: t.SUB_MERCHANT_DETAILS
          ? t.SUB_MERCHANT_DETAILS.map((s) => ({
              externalId: s.EXTERNAL_ID,
              amount: s.AMOUNT,
              date: s.DATE,
              transferDetail: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL
                ? {
                    extractId: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.EXTRACT_ID,
                    sentAmount: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_AMOUNT,
                    sentDate: s.SUB_MERCHANT_AMOUNT_TRANSFER_DETAIL.SENDED_DATE,
                  }
                : null,
            }))
          : null,
      })),
    }));
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return {
      count: this.payments.length,
      payments: this.payments,
    };
  }
}
