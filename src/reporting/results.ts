import type {
  RawDealerBalance,
  RawExtractItem,
  RawExtractTransaction,
  RawGetDealerBalanceResponse,
  RawGetExtractListResponse,
  RawGetReceiptListResponse,
  RawReceiptItem,
} from '../internal/reporting.types.js';

// ---------------------------------------------------------------------------
// Output model types
// ---------------------------------------------------------------------------

/** A single payment batch receipt (dekont). */
export interface ReceiptItem {
  /** Receipt number. */
  number: string;
  /** Receipt serial code. */
  serial: string;
  /** Merchant dealer name. */
  dealerName: string;
  /** Merchant identifier. */
  merchant: string;
  /** Receipt generation date. */
  date: string;
  /** Batch total amount. */
  amount: string;
  /** Currency of the receipt. */
  currency: string;
  /** URL to access the full receipt document. */
  url: string;
}

/** A single transaction line within an extract/transfer batch. */
export interface ExtractTransaction {
  /** Payment ID. */
  paymentId: number;
  /** Transaction ID. */
  transactionId: number;
  /** Transaction detail ID. */
  transactionDetailId: number;
  /** Merchant-assigned order reference number. */
  orderRefNumber: string;
  /** Transaction date. */
  date: string;
  /** Original payment amount. */
  paymentAmount: string;
  /** Net amount transferred to merchant. */
  amount: string;
  /** Human-readable status. */
  statusName: string;
  /** Machine-readable status ID. */
  statusId: number;
}

/** A single extract/transfer batch item. */
export interface ExtractItem {
  /** Extract ID. */
  extractId: number;
  /** Merchant internal ID. Null for sub-merchant rows. */
  merchantId: number | null;
  /** Sub-merchant external ID. Null for primary merchant rows. */
  subMerchantExternalId: string | null;
  /** Merchant display name. */
  merchantDisplayName: string;
  /** Number of sales in this batch. */
  salesCount: number;
  /** Total sales amount. */
  salesAmount: string;
  /** Number of returns in this batch. */
  returnCount: number;
  /** Total return amount. */
  returnAmount: string;
  /** Net transferred amount. */
  transferredAmount: string;
  /** Currency. */
  currency: string;
  /** Human-readable transfer status (e.g. `'Ödendi'`). */
  statusName: string;
  /** Transfer status ID. */
  statusId: number;
  /** Transfer date. */
  transferredDate: string;
  /** Transaction lines included in this extract. */
  transactions: ExtractTransaction[];
}

/** Detailed balance information for a merchant or sub-merchant. */
export interface DealerBalance {
  /** Sub-dealer internal ID. */
  dealerSubId: number;
  /** Dealer internal ID. */
  dealerId: number;
  /** Dealer type (e.g. `'UyeIsyeri'`). */
  dealerType: string;
  /** Merchant identifier. */
  merchant: string;
  /** Merchant display name. */
  dealerName: string;
  /** Current available balance. */
  balance: number;
  /** Currency. */
  currency: string;
  /** Deposit/collateral balance. */
  depositBalance: number;
  /** Chargeback reserve balance. */
  chargebackBalance: number;
  /** Total balance (balance + deposit + chargeback). */
  totalBalance: number;
}

// ---------------------------------------------------------------------------
// Result classes
// ---------------------------------------------------------------------------

/**
 * Result of `client.reporting.listReceipts`.
 *
 * Returns payment batch receipts (dekontlar) for the given date range.
 * Each receipt represents a settlement batch.
 *
 * @example
 * ```typescript
 * const result = await client.reporting.listReceipts({ startDate: '2024-01-01', endDate: '2024-01-31' });
 * for (const receipt of result.receipts) {
 *   console.log(`${receipt.date}: ${receipt.amount} ${receipt.currency} — ${receipt.url}`);
 * }
 * ```
 */
export class ListReceiptsResult {
  /** @internal */
  constructor(private readonly raw: RawGetReceiptListResponse) {}

  /** List of receipt records, normalized. */
  get receipts(): ReceiptItem[] {
    return this.raw.RECEIPTS.map((r: RawReceiptItem) => ({
      number: r.NUMBER,
      serial: r.SERIAL,
      dealerName: r.DEALER_NAME,
      merchant: r.MERCHANT,
      date: r.DATE,
      amount: r.AMOUNT,
      currency: r.CURRENCY,
      url: r.URL,
    }));
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return { count: this.receipts.length, receipts: this.receipts };
  }
}

/**
 * Result of `client.reporting.listExtracts`.
 *
 * Returns transfer/payout batches (dekont) for the given date range.
 * Each extract represents a grouped payout to the merchant or a sub-merchant.
 *
 * @example
 * ```typescript
 * const result = await client.reporting.listExtracts({ startDate: '2024-01-01', endDate: '2024-01-31' });
 * for (const extract of result.extracts) {
 *   console.log(`Extract ${extract.extractId}: ${extract.transferredAmount} ${extract.currency}`);
 * }
 * ```
 */
export class ListExtractsResult {
  /** @internal */
  constructor(private readonly raw: RawGetExtractListResponse) {}

  /** List of extract/transfer batch records, normalized. */
  get extracts(): ExtractItem[] {
    return this.raw.EXTRACTS.map((e: RawExtractItem) => ({
      extractId: e.EXTRACT_ID,
      merchantId: e.MERCHANT_ID,
      subMerchantExternalId: e.SUB_MERCHANT_EXTERNAL_ID,
      merchantDisplayName: e.MERCHANT_DISPLAY_NAME,
      salesCount: e.SALES_COUNT,
      salesAmount: e.SALES_AMOUNT,
      returnCount: e.RETURN_COUNT,
      returnAmount: e.RETURN_AMOUNT,
      transferredAmount: e.TRANSFERRED_AMOUNT,
      currency: e.CURRENCY,
      statusName: e.STATUS_NAME,
      statusId: e.STATUS_ID,
      transferredDate: e.TRANSFERRED_DATE,
      transactions: e.TRANSACTIONS.map((t: RawExtractTransaction) => ({
        paymentId: t.PAYMENT_ID,
        transactionId: t.TRANSACTION_ID,
        transactionDetailId: t.TRANSACTION_DETAIL_ID,
        orderRefNumber: t.ORDER_REF_NUMBER,
        date: t.DATE,
        paymentAmount: t.PAYMENT_AMOUNT,
        amount: t.AMOUNT,
        statusName: t.STATUS_NAME,
        statusId: t.STATUS_ID,
      })),
    }));
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return { count: this.extracts.length, extracts: this.extracts };
  }
}

/**
 * Result of `client.reporting.getDealerBalance`.
 *
 * @example
 * ```typescript
 * const result = await client.reporting.getDealerBalance({ currency: 'TRY' });
 * console.log(`Available: ${result.balance.balance} TRY`);
 * console.log(`Total: ${result.balance.totalBalance} TRY`);
 * ```
 */
export class GetDealerBalanceResult {
  /** @internal */
  constructor(private readonly raw: RawGetDealerBalanceResponse) {}

  private get rawBalance(): RawDealerBalance {
    return this.raw.DEALER_BALANCE;
  }

  /** Normalized dealer balance information. */
  get balance(): DealerBalance {
    return {
      dealerSubId: this.rawBalance.DEALER_SUB_ID,
      dealerId: this.rawBalance.DEALER_ID,
      dealerType: this.rawBalance.DEALER_TYPE,
      merchant: this.rawBalance.MERCHANT,
      dealerName: this.rawBalance.DEALER_NAME,
      balance: this.rawBalance.BALANCE,
      currency: this.rawBalance.CURRENCY,
      depositBalance: this.rawBalance.DEPOSIT_BALANCE,
      chargebackBalance: this.rawBalance.CHARGEBACK_BALANCE,
      totalBalance: this.rawBalance.TOTAL_BALANCE,
    };
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return { balance: this.balance };
  }
}
