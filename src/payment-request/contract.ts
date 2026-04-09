import type { QueryPaymentRequestStatusParams, SendPaymentRequestParams } from './params.js';
import type { QueryPaymentRequestStatusResult, SendPaymentRequestResult } from './results.js';

/**
 * Service contract for payment request (ödeme isteği) operations.
 *
 * Implemented by `EsnekPosClient` and available as `client.paymentRequest`.
 *
 * Payment requests allow merchants to generate a payment link and optionally
 * notify customers via SMS or email, without requiring card details upfront.
 *
 * @example
 * ```typescript
 * const sent = await client.paymentRequest.send({ ... });
 * if (sent.isAccepted) {
 *   // Share sent.url with the customer
 *   const status = await client.paymentRequest.queryStatus({
 *     sendPaymentRequestId: sent.requestId,
 *   });
 *   console.log(status.successfulPayment);
 * }
 * ```
 */
export interface IPaymentRequestService {
  /**
   * Sends a payment request to a customer via SMS, email, or generates a link.
   *
   * Maps to `POST /api/services/SendPaymentRequest`.
   */
  send(params: SendPaymentRequestParams): Promise<SendPaymentRequestResult>;

  /**
   * Queries the payment status of a previously sent payment request.
   *
   * Maps to `POST /api/services/SendPaymentRequestQuery`.
   */
  queryStatus(params: QueryPaymentRequestStatusParams): Promise<QueryPaymentRequestStatusResult>;
}
