/**
 * Bank account entry for a sub-merchant.
 */
export interface SubMerchantBankAccount {
  iban: string;
  currency: string;
}

/**
 * Sub-merchant type — determines which fields are relevant for tax/legal purposes.
 * - `'PERSONAL'` — individual seller
 * - `'PERSONAL_COMPANY'` — sole proprietorship
 * - `'COMPANY'` — incorporated company
 */
export type SubMerchantType = 'PERSONAL' | 'PERSONAL_COMPANY' | 'COMPANY';

/**
 * Parameters for `client.marketplace.setSubMerchant`.
 *
 * Used for both **registering** a new sub-merchant and **updating** an existing one.
 * The `externalId` is the unique identifier assigned by the marketplace.
 *
 * @example
 * ```typescript
 * await client.marketplace.setSubMerchant({
 *   externalId: 'seller-42',
 *   type: 'COMPANY',
 *   name: 'Acme Store',
 *   ownerName: 'Jane',
 *   ownerSurname: 'Doe',
 *   ownerIdentityNumber: '12345678910',
 *   email: 'jane@acme.com',
 *   gsm: '5551234567',
 *   companyName: 'Acme Ltd.',
 *   taxOffice: 'Kadıköy',
 *   taxNumber: '1234567890',
 *   bankName: 'Jane Doe',
 *   bankAccounts: [{ iban: 'TR00...', currency: 'TRY' }],
 * });
 * ```
 */
export interface SetSubMerchantParams {
  /** Unique identifier for the sub-merchant within the marketplace system. */
  externalId: string;
  type: SubMerchantType;
  /** Display name of the marketplace store. */
  name: string;
  ownerName: string;
  ownerSurname: string;
  /** Turkish national identity number (TC Kimlik No). */
  ownerIdentityNumber: string;
  email: string;
  gsm: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  /** Account holder name for the bank account(s). */
  bankName: string;
  bankAccounts: SubMerchantBankAccount[];
}

/**
 * Parameters for `client.marketplace.querySubMerchant`.
 */
export interface QuerySubMerchantParams {
  /** The `externalId` assigned to the sub-merchant by the marketplace. */
  externalId: string;
}

/**
 * Parameters for `client.marketplace.reduceSubMerchantAmount`.
 *
 * Reduces the amount owed to a sub-merchant for a specific order. The `amount`
 * must be **negative** (e.g. `-5` to reduce by 5 TL).
 */
export interface ReduceSubMerchantAmountParams {
  orderRefNumber: string;
  externalId: string;
  /** Negative integer representing the reduction amount (e.g. `-5`). */
  amount: number;
}
