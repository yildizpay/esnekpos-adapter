import type { DateRange } from '../shared/common.js';

/**
 * Parameters for `client.query.processQuery`.
 */
export interface ProcessQueryParams {
  /**
   * The `orderRefNumber` used when the payment was initiated.
   */
  orderRefNumber: string;
}

/**
 * Parameters for `client.query.processQueryDetail`.
 */
export interface ProcessQueryDetailParams {
  /**
   * The `orderRefNumber` used when the payment was initiated.
   */
  orderRefNumber: string;
}

/**
 * Parameters for `client.query.listPayments`.
 */
export interface ListPaymentsParams extends DateRange {}
