import type {
  RawBinQueryResponse,
  RawGetInstallmentsResponse,
  RawInstallmentOption,
} from '../internal/card.types.js';

/**
 * Result of `client.card.binQuery`.
 *
 * Contains bank and card type information for the given BIN.
 * Use this before payment initiation to show installment options or
 * validate the card type.
 *
 * @example
 * ```typescript
 * const result = await client.card.binQuery({ cardNumber: '415956' });
 * console.log(result.bankName);   // 'IS BANK'
 * console.log(result.cardFamily); // 'Maximum'
 * console.log(result.cardKind);   // 'BİREYSEL KART'
 * ```
 */
export class BinQueryResult {
  /**
   * @internal Instantiated by the card service. Do not construct directly.
   */
  constructor(private readonly raw: RawBinQueryResponse) {}

  /** Bank name (e.g. `'IS BANK'`). */
  get bankName(): string {
    return this.raw.Bank_Name;
  }

  /** Card brand (e.g. `'MASTERCARD'`, `'VISA'`). */
  get bankBrand(): string {
    return this.raw.Bank_Brand;
  }

  /** Card type (e.g. `'CREDIT'`, `'DEBIT'`). */
  get cardType(): string {
    return this.raw.Card_Type;
  }

  /** Card family/product name (e.g. `'Maximum'`, `'Bonus'`). */
  get cardFamily(): string {
    return this.raw.Card_Family;
  }

  /**
   * Card kind in Turkish (e.g. `'BİREYSEL KART'`, `'TİCARİ KART'`).
   * Possible values: `'DEBİT KART'`, `'BİREYSEL KART'`, `'TİCARİ KART'`.
   */
  get cardKind(): string {
    return this.raw.Card_Kind;
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return {
      bankName: this.bankName,
      bankBrand: this.bankBrand,
      cardType: this.cardType,
      cardFamily: this.cardFamily,
      cardKind: this.cardKind,
    };
  }
}

/**
 * A single installment option for a card family.
 */
export interface InstallmentOption {
  /** Card family/product name (e.g. `'bonus'`, `'axess'`). */
  family: string;
  /** Number of installments. `1` = single payment. */
  installment: number;
  /** Commission rate for this installment count. */
  rate: number;
  /** Amount per installment (0 if `amount` was not provided in params). */
  amountPerInstallment: number;
  /** Total amount including commission (0 if `amount` was not provided). */
  amountTotal: number;
  /** Net amount the merchant receives after commission deduction. */
  amountToDealer: number;
}

/**
 * Result of `client.card.getInstallments`.
 *
 * Returns all installment options available for the merchant, optionally
 * filtered by card family (BIN) and calculated for a specific amount.
 *
 * @example
 * ```typescript
 * const result = await client.card.getInstallments({ amount: '1250.00', bin: '51015200' });
 * for (const option of result.installments) {
 *   console.log(`${option.installment}x: ${option.amountPerInstallment} TRY/month`);
 * }
 * ```
 */
export class GetInstallmentsResult {
  /**
   * @internal Instantiated by the card service. Do not construct directly.
   */
  constructor(private readonly raw: RawGetInstallmentsResponse) {}

  /** All available installment options, normalized. */
  get installments(): InstallmentOption[] {
    return this.raw.INSTALLMENTS.map((opt: RawInstallmentOption) => ({
      family: opt.FAMILY,
      installment: opt.INSTALLMENT,
      rate: opt.RATE,
      amountPerInstallment: opt.AMOUNT_PER_INSTALLMENT,
      amountTotal: opt.AMOUNT_TOTAL,
      amountToDealer: opt.AMOUNT_BE_SEND_TO_DEALER,
    }));
  }

  /** Returns a plain object representation safe for logging. */
  toJSON(): object {
    return {
      count: this.installments.length,
      installments: this.installments,
    };
  }
}
