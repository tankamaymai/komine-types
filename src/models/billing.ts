/**
 * Billing / Payment type definitions
 *
 * Matches: Prisma Billing, Payment models (Phase 2 schema migration)
 * Backend formatters: src/billings/billingController.ts, src/payments/paymentController.ts
 */

import { BillingCategory, BillingRecordStatus } from '../enums';

/**
 * Customer summary embedded in Billing/Payment list responses
 */
export interface BillingCustomerSummary {
  id: string;
  name: string;
  nameKana: string;
}

/**
 * Billing summary embedded in Payment responses
 */
export interface BillingSummaryForPayment {
  id: string;
  category: BillingCategory;
  amount: number;
  billingDate: string | null;
  status: BillingRecordStatus;
}

/**
 * Billing - 請求 (legacy t_seikyu の移行先)
 */
export interface Billing {
  id: string;
  contractPlotId: string;
  customerId: string;
  category: BillingCategory;
  amount: number;
  useStartYear: number | null;
  useEndYear: number | null;
  targetMonth: number | null;
  billingYears: number | null;
  contractDate: string | null; // YYYY-MM-DD
  billingDate: string | null;
  paidAmount: number;
  lastPaymentDate: string | null;
  terminated: boolean;
  terminatedDate: string | null;
  status: BillingRecordStatus;
  applicationType: number | null;
  billingType: number | null;
  notes: string | null;
  /** 前受金一括登録の単位を識別する ID（取り消し用。通常の請求・入金は null） */
  prepaidBatchId: string | null;
  legacySeikyuCd: number | null;
  customer: BillingCustomerSummary | null;
  plotNumber: string | null;
  /** 表示用区画番号（grave_name_cd 由来、#158）。legacy-* の plot_number に代えて画面表示に使う #283 */
  displayNumber?: string | null;
  areaName: string | null;
  createdAt: string; // ISO datetime
  updatedAt: string;
}

/**
 * Payment summary embedded in Billing detail response
 */
export interface BillingPaymentSummary {
  id: string;
  paymentDate: string | null;
  scheduledDate: string | null;
  paymentAmount: number;
  scheduledAmount: number | null;
  feeType: string | null;
  staffInCharge: string | null;
  notes: string | null;
}

/**
 * Payment - 入金 (legacy t_nyukin の移行先)
 *
 * billing_id は nullable (孤児入金 16 件のような請求未紐付けケースに対応)
 */
export interface Payment {
  id: string;
  billingId: string | null;
  customerId: string | null;
  contractPlotId: string | null;
  scheduledDate: string | null;
  scheduledAmount: number | null;
  paymentDate: string | null;
  paymentAmount: number;
  feeType: string | null;
  applicationType: number | null;
  billingType: number | null;
  staffInCharge: string | null;
  notes: string | null;
  /** 前受金一括登録の単位を識別する ID（取り消し用。通常の請求・入金は null） */
  prepaidBatchId: string | null;
  legacyNyukinCd: number | null;
  billing: BillingSummaryForPayment | null;
  customer: BillingCustomerSummary | null;
  plotNumber: string | null;
  /** 表示用区画番号（grave_name_cd 由来、#158）。legacy-* の plot_number に代えて画面表示に使う #283 */
  displayNumber?: string | null;
  areaName: string | null;
  createdAt: string;
  updatedAt: string;
}
