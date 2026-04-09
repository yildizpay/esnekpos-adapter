// @yildizpay/esnekpos-adapter — Public API

// Shared
export type {
  Currency,
  CustomerInfo,
  CustomerInfoWithIp,
  DateRange,
  PaymentLocale,
  ProductItem,
} from './shared/common.js';
export { CreditCardInput, TransactionStatusId } from './shared/common.js';

// Config
export type {
  EsnekPosClientConfig,
  EsnekPosDebugOptions,
  EsnekPosEnvironment,
} from './config/config.js';

// Payment
export type { CommonPageParams, Pay3DParams } from './payment/params.js';
export { CommonPaymentResult, Pay3DInitResult } from './payment/results.js';
export type { IPaymentService } from './payment/contract.js';

// Query
export type {
  ListPaymentsParams,
  ProcessQueryDetailParams,
  ProcessQueryParams,
} from './query/params.js';
export {
  ListPaymentsResult,
  ProcessQueryDetailResult,
  ProcessQueryResult,
} from './query/results.js';
export type {
  AmountTransferDetail,
  PaymentListItem,
  PaymentProduct,
  SubMerchantDetail,
  TransactionItem,
} from './query/results.js';
export type { IQueryService } from './query/contract.js';

// Refund
export type { RefundParams } from './refund/params.js';
export { RefundResult } from './refund/results.js';
export type { IRefundService } from './refund/contract.js';

// Callback
export type { CallbackPayload } from './callback/params.js';
export { PaymentCallbackResult } from './callback/results.js';
export type { CallbackCustomerInfo } from './callback/results.js';
export type { ICallbackService } from './callback/contract.js';

// Card
export type { BinQueryParams, GetInstallmentsParams } from './card/params.js';
export { BinQueryResult, GetInstallmentsResult } from './card/results.js';
export type { InstallmentOption } from './card/results.js';
export type { ICardService } from './card/contract.js';

// Reporting
export type {
  GetDealerBalanceParams,
  ListExtractsParams,
  ListReceiptsParams,
} from './reporting/params.js';
export {
  GetDealerBalanceResult,
  ListExtractsResult,
  ListReceiptsResult,
} from './reporting/results.js';
export type {
  DealerBalance,
  ExtractItem,
  ExtractTransaction,
  ReceiptItem,
} from './reporting/results.js';
export type { IReportingService } from './reporting/contract.js';

// Recurring
export type {
  AddRecurringCardParams,
  CancelRecurringPlanParams,
  CreateRecurringPlanParams,
  ListRecurringPlansParams,
  QueryRecurringPlanParams,
  RecurringCard,
  RecurringCustomer,
  RemoveRecurringCardParams,
} from './recurring/params.js';
export {
  AddRecurringCardResult,
  CancelRecurringPlanResult,
  CreateRecurringPlanResult,
  ListRecurringPlansResult,
  QueryRecurringPlanResult,
  RemoveRecurringCardResult,
} from './recurring/results.js';
export type {
  RecurringPaymentTransaction,
  RecurringPaymentTry,
  RecurringPlanListItem,
} from './recurring/results.js';
export type { IRecurringService } from './recurring/contract.js';

// Marketplace
export type {
  QuerySubMerchantParams,
  ReduceSubMerchantAmountParams,
  SetSubMerchantParams,
  SubMerchantBankAccount,
  SubMerchantType,
} from './marketplace/params.js';
export {
  QuerySubMerchantResult,
  ReduceSubMerchantAmountResult,
  SetSubMerchantResult,
} from './marketplace/results.js';
export type { MarketplaceSubMerchant } from './marketplace/results.js';
export type { IMarketplaceService } from './marketplace/contract.js';

// Payment Request
export type {
  PaymentRequestDeliveryType,
  QueryPaymentRequestStatusParams,
  SendPaymentRequestParams,
} from './payment-request/params.js';
export {
  QueryPaymentRequestStatusResult,
  SendPaymentRequestResult,
} from './payment-request/results.js';
export type { PaymentRequestPaymentItem } from './payment-request/results.js';
export type { IPaymentRequestService } from './payment-request/contract.js';
