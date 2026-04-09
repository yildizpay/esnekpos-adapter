/**
 * Supported payment currencies.
 * @see https://developer.esnekpos.com
 */
export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP';

/**
 * EsnekPos payment page locale options.
 * Used by {@link CommonPageParams} to set the language of the hosted payment page.
 */
export type PaymentLocale = 'tr' | 'en';

/**
 * Transaction status identifiers returned in payment query responses.
 * Each value corresponds to the `STATUS_ID` field in EsnekPos API responses.
 */
export enum TransactionStatusId {
  PaymentPending = 1,
  PaymentAwaiting3D = 2,
  PaymentSuccessful = 3,
  PaymentFailed = 4,
  CancelSuccessful = 5,
  CancelFailed = 6,
  RefundSuccessful = 7,
  RefundFailed = 8,
}

/**
 * Customer information required for payment initiation.
 * Used by {@link CommonPageParams}.
 */
export interface CustomerInfo {
  /** Customer's first name. */
  firstName: string;
  /** Customer's last name. */
  lastName: string;
  /** Customer's email address. */
  email: string;
  /** Customer's phone number. */
  phone: string;
  /** Customer's city. */
  city: string;
  /** Customer's district (ilçe). */
  district: string;
  /** Customer's full address. */
  address: string;
}

/**
 * Customer information including IP address, required for 3D payment initiation.
 * Used by {@link Pay3DParams}.
 */
export interface CustomerInfoWithIp extends CustomerInfo {
  /** Customer's IP address. Required for fraud prevention in 3D payment. */
  ip: string;
}

/**
 * A single product in an order.
 * At least one product is required for payment requests.
 */
export interface ProductItem {
  /** Product identifier assigned by the merchant. */
  id: string;
  /** Product name. */
  name: string;
  /** Product category. */
  category: string;
  /** Product description. */
  description: string;
  /**
   * Product amount as a string.
   * @example '80.00'
   */
  amount: string;
}

/**
 * Date range for list query endpoints.
 *
 * > **Warning:** EsnekPos endpoints are inconsistent about date format.
 * > `GetReceiptList` expects `YYYY-MM-DD`, while `GetPaymentList` and
 * > `GetExtractList` examples show `DD-MM-YYYY`. Check the specific endpoint
 * > documentation and test against the target environment.
 */
export interface DateRange {
  /** Start date string. */
  startDate: string;
  /** End date string. */
  endDate: string;
}

/**
 * Credit card input with PCI-DSS compliant serialization.
 *
 * Card numbers and CVV codes are **never** exposed in `toJSON()` or `toString()`.
 * This ensures that accidental logging of this object never leaks sensitive card data.
 *
 * @example
 * ```typescript
 * const card = new CreditCardInput({
 *   number: '4159562885391991',
 *   expiryMonth: '12',
 *   expiryYear: '2026',
 *   cvv: '123',
 *   owner: 'Jane Doe',
 *   installments: 1,
 * });
 *
 * console.log(card.toString()); // CreditCard(415956******1991)
 * console.log(JSON.stringify(card)); // {"number":"415956******1991","cvv":"***",...}
 * ```
 */
export class CreditCardInput {
  /** Full card number. Never exposed via toJSON() or toString(). */
  readonly number: string;
  /** Two-digit expiry month (e.g. `'12'`). */
  readonly expiryMonth: string;
  /** Four-digit expiry year (e.g. `'2026'`). */
  readonly expiryYear: string;
  /** Card CVV. Never exposed via toJSON() or toString(). */
  readonly cvv: string;
  /** Name on the card. */
  readonly owner: string;
  /** Number of installments. Use `1` for a single payment. */
  readonly installments: number;

  constructor(params: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    owner: string;
    installments: number;
  }) {
    this.number = params.number;
    this.expiryMonth = params.expiryMonth;
    this.expiryYear = params.expiryYear;
    this.cvv = params.cvv;
    this.owner = params.owner;
    this.installments = params.installments;
  }

  /** The card number with middle digits masked (e.g. `415956******1991`). */
  get maskedNumber(): string {
    return `${this.number.slice(0, 6)}******${this.number.slice(-4)}`;
  }

  /**
   * Returns a masked representation of this card for safe logging.
   * The card number is masked as `415956******1991`, CVV is always `***`.
   */
  toJSON(): object {
    return {
      number: this.maskedNumber,
      expiryMonth: this.expiryMonth,
      expiryYear: this.expiryYear,
      cvv: '***',
      owner: this.owner,
      installments: this.installments,
    };
  }

  /**
   * Returns a safe string representation showing only the masked card number.
   * @example 'CreditCard(415956******1991)'
   */
  toString(): string {
    return `CreditCard(${this.maskedNumber})`;
  }
}
