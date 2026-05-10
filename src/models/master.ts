/**
 * Master data type definitions
 *
 * Matches: Prisma master models (CemeteryTypeMaster, PaymentMethodMaster,
 * TaxTypeMaster, CalcTypeMaster, BillingTypeMaster, RecipientTypeMaster,
 * ConstructionTypeMaster, SectionNameMaster, RelationshipMaster)
 * Backend formatter: src/masters/masterController.ts
 */

/**
 * Common master record shape returned from the API.
 */
export interface MasterRecord {
  id: number;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number | null;
  isActive: boolean;
}

/**
 * Tax type master adds tax_rate as decimal string.
 */
export interface TaxTypeMaster extends MasterRecord {
  taxRate: string | null;
}

/**
 * Section name master adds period (第1期 etc).
 */
export interface SectionNameMaster extends MasterRecord {
  period: string;
}

/**
 * Relationship master (続柄): legacy sykbnn KBNNO=2009 holds 35 entries
 * (配偶者, 子, 親, etc) used as the value domain of
 * BuriedPerson.relationship and FamilyContact.relationship.
 */
export type RelationshipMaster = MasterRecord;

/**
 * Aliases for the simple masters (kept for clarity at call sites).
 */
export type CemeteryTypeMaster = MasterRecord;
export type PaymentMethodMaster = MasterRecord;
export type CalcTypeMaster = MasterRecord;
export type BillingTypeMaster = MasterRecord;
export type RecipientTypeMaster = MasterRecord;
export type ConstructionTypeMaster = MasterRecord;

/**
 * Identifier for each master collection used as both URL slug
 * (`/api/v1/masters/:masterType`) and key in `AllMastersResponse`.
 */
export const MASTER_TYPES = [
  'cemetery-type',
  'payment-method',
  'tax-type',
  'calc-type',
  'billing-type',
  'recipient-type',
  'construction-type',
  'section-name',
  'relationship',
] as const;

export type MasterType = (typeof MASTER_TYPES)[number];

/**
 * Response shape of GET /api/v1/masters/all.
 * Keys mirror the camelCased master collection names.
 */
export interface AllMastersResponse {
  cemeteryType: CemeteryTypeMaster[];
  paymentMethod: PaymentMethodMaster[];
  taxType: TaxTypeMaster[];
  calcType: CalcTypeMaster[];
  billingType: BillingTypeMaster[];
  recipientType: RecipientTypeMaster[];
  constructionType: ConstructionTypeMaster[];
  sectionName: SectionNameMaster[];
  relationship: RelationshipMaster[];
}
