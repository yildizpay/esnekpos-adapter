import type {
  AddRecurringCardParams,
  CancelRecurringPlanParams,
  CreateRecurringPlanParams,
  ListRecurringPlansParams,
  QueryRecurringPlanParams,
  RemoveRecurringCardParams,
} from './params.js';
import type {
  AddRecurringCardResult,
  CancelRecurringPlanResult,
  CreateRecurringPlanResult,
  ListRecurringPlansResult,
  QueryRecurringPlanResult,
  RemoveRecurringCardResult,
} from './results.js';

/**
 * Service contract for recurring (subscription) payment operations.
 *
 * Implemented by `EsnekPosClient` and available as `client.recurring`.
 *
 * @example
 * ```typescript
 * const result = await client.recurring.createPlan({ ... });
 * if (result.isAccepted) {
 *   console.log('Recurring plan created');
 * }
 * ```
 */
export interface IRecurringService {
  /**
   * Creates a new recurring payment plan.
   *
   * Maps to `POST /api/pay/RecurringPayment`.
   */
  createPlan(params: CreateRecurringPlanParams): Promise<CreateRecurringPlanResult>;

  /**
   * Cancels an entire recurring payment plan.
   *
   * Maps to `POST /api/services/RecurringPaymentCancel` (without `CARD_ID`).
   */
  cancelPlan(params: CancelRecurringPlanParams): Promise<CancelRecurringPlanResult>;

  /**
   * Removes a specific card from a recurring plan without cancelling the plan.
   *
   * Maps to `POST /api/services/RecurringPaymentCancel` (with `CARD_ID`).
   */
  removeCard(params: RemoveRecurringCardParams): Promise<RemoveRecurringCardResult>;

  /**
   * Adds a new card to an existing recurring payment plan.
   *
   * Maps to `POST /api/services/RecurringPaymentCardAdd`.
   */
  addCard(params: AddRecurringCardParams): Promise<AddRecurringCardResult>;

  /**
   * Queries the status and transaction history of a single recurring plan.
   *
   * Maps to `POST /api/services/RecurringPaymentQuery`.
   */
  queryPlan(params: QueryRecurringPlanParams): Promise<QueryRecurringPlanResult>;

  /**
   * Lists all recurring plans within a date range.
   *
   * Maps to `POST /api/services/GetRecurringPaymentList`.
   */
  listPlans(params: ListRecurringPlansParams): Promise<ListRecurringPlansResult>;
}
