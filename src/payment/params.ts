import type {
  CreditCardInput,
  Currency,
  CustomerInfo,
  CustomerInfoWithIp,
  PaymentLocale,
  ProductItem,
} from '../shared/common.js';

/**
 * Parameters for initiating a 3D Secure payment via `client.payment.pay3D`.
 *
 * `MERCHANT` and `MERCHANT_KEY` are taken from the client config and injected
 * automatically — do not include them here.
 *
 * @example
 * ```typescript
 * const result = await client.payment.pay3D({
 *   orderRefNumber: 'ORDER-001',
 *   amount: '150.00',
 *   currency: 'TRY',
 *   backUrl: 'https://myshop.com/payment/callback',
 *   card: new CreditCardInput({ number: '4159562885391991', expiryMonth: '12', expiryYear: '2026', cvv: '123', owner: 'Jane Doe', installments: 1 }),
 *   customer: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '5551234567', city: 'Istanbul', district: 'Kadikoy', address: '...', ip: '192.168.1.1' },
 *   products: [{ id: '1', name: 'T-Shirt', category: 'Clothing', description: 'Blue t-shirt', amount: '150.00' }],
 * });
 *
 * if (result.isAccepted) {
 *   redirect(result.redirectUrl);
 * }
 * ```
 */
export interface Pay3DParams {
  /**
   * Merchant-assigned order reference number. Max 24 characters.
   * Used to track the payment via `client.query.processQuery`.
   */
  orderRefNumber: string;
  /**
   * Payment amount as a string with two decimal places.
   * @example '150.00'
   */
  amount: string;
  /** Payment currency. */
  currency: Currency;
  /**
   * Callback URL where EsnekPos will POST the payment result (FORM POST).
   * Must be a publicly accessible HTTPS URL.
   */
  backUrl: string;
  /** Credit card details. Sensitive data is masked automatically via {@link CreditCardInput}. */
  card: CreditCardInput;
  /** Customer information including IP address (required for fraud prevention). */
  customer: CustomerInfoWithIp;
  /** Order products. At least one product is required. */
  products: ProductItem[];
}

/**
 * Parameters for initiating a hosted payment page via `client.payment.commonPage`.
 *
 * Unlike `pay3D`, card details are collected directly by EsnekPos on their
 * hosted page — no card input is needed here.
 *
 * @example
 * ```typescript
 * const result = await client.payment.commonPage({
 *   orderRefNumber: 'ORDER-002',
 *   amount: '200.00',
 *   currency: 'TRY',
 *   backUrl: 'https://myshop.com/payment/callback',
 *   locale: 'tr',
 *   customer: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '5551234567', city: 'Istanbul', district: 'Kadikoy', address: '...' },
 *   products: [{ id: '1', name: 'Shoes', category: 'Footwear', description: 'Blue sneakers', amount: '200.00' }],
 * });
 *
 * if (result.isAccepted) {
 *   redirect(result.redirectUrl);
 * }
 * ```
 */
export interface CommonPageParams {
  /**
   * Merchant-assigned order reference number. Max 24 characters.
   */
  orderRefNumber: string;
  /**
   * Payment amount as a string with two decimal places.
   * @example '200.00'
   */
  amount: string;
  /** Payment currency. */
  currency: Currency;
  /**
   * Callback URL where EsnekPos will POST the payment result (FORM POST).
   * Must be a publicly accessible HTTPS URL.
   */
  backUrl: string;
  /** Language for the hosted payment page. */
  locale: PaymentLocale;
  /** Customer information. IP address is not required for this flow. */
  customer: CustomerInfo;
  /** Order products. At least one product is required. */
  products: ProductItem[];
}
