/**
 * Card details for a recurring payment.
 */
export interface RecurringCard {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  owner: string;
}

/**
 * Customer details required for a recurring payment.
 */
export interface RecurringCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  clientIp: string;
}

/**
 * Parameters for `client.recurring.createPlan`.
 *
 * @example
 * ```typescript
 * await client.recurring.createPlan({
 *   orderRefNumber: 'SUB-001',
 *   amount: '100.00',
 *   currency: 'TRY',
 *   backUrl: 'https://example.com/recurring/callback',
 *   repeat: 12,
 *   triesCount: 3,
 *   startDate: '2024-01-01',
 *   cards: [card],
 *   customer,
 * });
 * ```
 */
export interface CreateRecurringPlanParams {
  orderRefNumber: string;
  /** Payment amount per instalment, e.g. `'100.00'`. */
  amount: string;
  /** Currency code: `'TRY'`, `'USD'`, `'EUR'`, or `'GBP'`. */
  currency: string;
  /** URL where EsnekPos will POST the result of each recurring charge. */
  backUrl: string;
  /** Total number of recurring charges. */
  repeat: number;
  /** Number of retry attempts per charge on failure. */
  triesCount: number;
  /** Start date in `'YYYY-MM-DD'` format. */
  startDate: string;
  /**
   * One or more cards to charge in sequence.
   * Uses {@link RecurringCard} — not {@link CreditCardInput} — because the recurring
   * API has no installment concept at the card level.
   */
  cards: RecurringCard[];
  customer: RecurringCustomer;
}

/**
 * Parameters for `client.recurring.cancelPlan`.
 */
export interface CancelRecurringPlanParams {
  /** The `ORDER_REF_NUMBER` of the recurring plan to cancel. */
  orderRefNumber: string;
}

/**
 * Parameters for `client.recurring.removeCard`.
 *
 * Uses the same endpoint as `cancelPlan` but includes `CARD_ID` to target a
 * specific card rather than the entire plan.
 */
export interface RemoveRecurringCardParams {
  orderRefNumber: string;
  /** Card ID returned by the card listing service. */
  cardId: string;
}

/**
 * Parameters for `client.recurring.addCard`.
 */
export interface AddRecurringCardParams {
  orderRefNumber: string;
  card: RecurringCard;
}

/**
 * Parameters for `client.recurring.queryPlan`.
 */
export interface QueryRecurringPlanParams {
  orderRefNumber: string;
}

/**
 * Parameters for `client.recurring.listPlans`.
 */
export interface ListRecurringPlansParams {
  startDate: string;
  endDate: string;
}
