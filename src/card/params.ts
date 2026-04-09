/**
 * Parameters for `client.card.binQuery`.
 *
 * > **Note:** This endpoint does not require merchant authentication.
 * > The first 6–8 digits of the card number are sufficient.
 */
export interface BinQueryParams {
  /**
   * First 6–8 digits of the card number (the BIN/IIN).
   * @example '415956'
   */
  cardNumber: string;
}

/**
 * Parameters for `client.card.getInstallments`.
 *
 * All fields except `currency` are optional. Provide `bin` to get
 * card-family-specific installment options.
 */
export interface GetInstallmentsParams {
  /**
   * Payment amount used to calculate per-installment amounts.
   * If omitted, amounts in the result will be zero.
   * @example '1250.00'
   */
  amount?: string;
  /**
   * First 8 digits of the card number (BIN) to filter by card family.
   * @example '51015200'
   */
  bin?: string;
  /**
   * When `1`, commission is passed to the customer.
   * When `0` (default), commission is borne by the merchant.
   */
  commissionForCustomer?: 0 | 1;
}
