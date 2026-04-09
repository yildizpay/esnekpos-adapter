import type { CommonPageParams, Pay3DParams } from './params.js';
import type { CommonPaymentResult, Pay3DInitResult } from './results.js';

/**
 * Payment service contract.
 *
 * Implemented by `EsnekPosClient` and `EsnekPosMockClient`.
 * Accessible via `client.payment`.
 */
export interface IPaymentService {
  /**
   * Initiates a 3D Secure payment.
   *
   * Sends card details directly to EsnekPos and returns a redirect URL for
   * 3D verification. The user must be redirected to complete the payment.
   *
   * Always verify the final payment status via `client.query.processQuery`
   * after receiving the callback — do not rely solely on the callback payload.
   *
   * @param params - Payment parameters including card, customer, and order details.
   * @returns A {@link Pay3DInitResult} with the 3D redirect URL and transaction info.
   *
   * @example
   * ```typescript
   * const result = await client.payment.pay3D(params);
   * if (result.isAccepted) redirect(result.redirectUrl);
   * ```
   */
  pay3D(params: Pay3DParams): Promise<Pay3DInitResult>;

  /**
   * Initiates a hosted payment page session.
   *
   * EsnekPos collects card details on their own page — no card input is required
   * from the merchant. Returns a redirect URL to the hosted page.
   *
   * @param params - Payment parameters including customer and order details.
   * @returns A {@link CommonPaymentResult} with the hosted page URL.
   *
   * @example
   * ```typescript
   * const result = await client.payment.commonPage(params);
   * if (result.isAccepted) redirect(result.redirectUrl);
   * ```
   */
  commonPage(params: CommonPageParams): Promise<CommonPaymentResult>;
}
