/**
 * How the payment request should be delivered to the customer.
 * - `1` — SMS
 * - `2` — Email
 * - `3` — Generate link only (no notification sent)
 */
export type PaymentRequestDeliveryType = 1 | 2 | 3;

/**
 * Parameters for `client.paymentRequest.send`.
 *
 * EsnekPos generates a payment page URL and optionally notifies the customer
 * via SMS or email. Use the returned `requestId` to poll for payment status.
 *
 * @example
 * ```typescript
 * const result = await client.paymentRequest.send({
 *   amount: '10,56',
 *   installment: 0,
 *   phoneNumber: '5554443322',
 *   email: 'customer@example.com',
 *   type: 1,           // send via SMS
 *   locale: 'tr',
 *   isTotalAmount: true,
 *   product: 'Premium Plan',
 * });
 *
 * if (result.isAccepted) {
 *   console.log(result.url);       // payment page URL
 *   console.log(result.requestId); // store to query status later
 * }
 * ```
 */
export interface SendPaymentRequestParams {
  /** Amount, formatted as a Turkish decimal string, e.g. `'10,56'`. */
  amount: string;
  /**
   * Maximum installment count. Pass `0` to allow unlimited installments.
   */
  installment: number;
  phoneNumber: string;
  email: string;
  type: PaymentRequestDeliveryType;
  /** Payment page locale: `'tr'` or `'en'`. */
  locale: 'tr' | 'en';
  /**
   * - `true` — `amount` is the total charged to the card (including commission)
   * - `false` — `amount` is the net amount deposited to the merchant
   */
  isTotalAmount: boolean;
  /** Product or service name displayed on the payment page. */
  product: string;
}

/**
 * Parameters for `client.paymentRequest.queryStatus`.
 */
export interface QueryPaymentRequestStatusParams {
  /**
   * The `requestId` returned by `client.paymentRequest.send`.
   */
  sendPaymentRequestId: string;
}
