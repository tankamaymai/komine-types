/**
 * Billing / Payment API request/response types
 *
 * Backend endpoints: GET/POST/PUT/DELETE /api/v1/billings and /api/v1/payments
 * Source: komine-crm-backend src/billings/, src/payments/
 */

import { BillingCategory, BillingRecordStatus } from '../enums';
import { Billing, BillingPaymentSummary, Payment } from '../models/billing';
import { MessageResponse } from './common';

/**
 * Pagination metadata returned by Billing/Payment list endpoints.
 *
 * Note: this differs from the common PaginationMeta because the backend
 * billing/payment endpoints serialize the field as `totalCount` (not `total`).
 */
export interface BillingsPaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// ===== Billing =====

export interface BillingsListResponse {
  items: Billing[];
  pagination: BillingsPaginationMeta;
}

export interface BillingDetailResponse extends Billing {
  payments: BillingPaymentSummary[];
}

export interface CreateBillingRequest {
  contractPlotId: string;
  customerId: string;
  category: BillingCategory;
  amount: number;
  useStartYear?: number | null;
  useEndYear?: number | null;
  targetMonth?: number | null;
  billingYears?: number | null;
  contractDate?: string | null;
  billingDate?: string | null;
  applicationType?: number | null;
  billingType?: number | null;
  status?: BillingRecordStatus;
  notes?: string | null;
}

export interface UpdateBillingRequest {
  category?: BillingCategory;
  amount?: number;
  useStartYear?: number | null;
  useEndYear?: number | null;
  targetMonth?: number | null;
  billingYears?: number | null;
  contractDate?: string | null;
  billingDate?: string | null;
  applicationType?: number | null;
  billingType?: number | null;
  status?: BillingRecordStatus;
  terminated?: boolean;
  terminatedDate?: string | null;
  notes?: string | null;
}

export interface ListBillingsQuery {
  page?: number;
  limit?: number;
  contractPlotId?: string;
  customerId?: string;
  category?: BillingCategory;
  status?: BillingRecordStatus;
  billingDateFrom?: string;
  billingDateTo?: string;
  sortBy?: 'billing_date' | 'contract_date' | 'amount' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export type DeleteBillingResponse = MessageResponse;

/**
 * Billing summary query (GET /billings/summary)
 *
 * Same filters as ListBillingsQuery minus pagination/sort — the summary
 * aggregates over ALL matching rows, not just the current page.
 * Added for frontend issue #225 (per-page StatCard totals were misleading).
 */
export interface BillingSummaryQuery {
  contractPlotId?: string;
  customerId?: string;
  category?: BillingCategory;
  status?: BillingRecordStatus;
  billingDateFrom?: string;
  billingDateTo?: string;
}

/**
 * Billing summary response (GET /billings/summary)
 *
 * All amounts in yen, aggregated over every billing matching the filters.
 */
export interface BillingSummaryResponse {
  /** 請求総額（フィルタ一致全件の amount 合計） */
  totalAmount: number;
  /** 入金済額（フィルタ一致全件の paidAmount 合計） */
  paidAmount: number;
  /** 未入金額（totalAmount - paidAmount） */
  unpaidAmount: number;
  /** 延滞件数（status='overdue' の件数） */
  overdueCount: number;
  /** フィルタ一致の総件数 */
  totalCount: number;
}

// ===== Prepaid Billing（前受金一括処理） =====

/** 前受金一括登録で作られる 1 年分の内訳 */
export interface PrepaidBillingYearRow {
  /** 対象年（西暦） */
  year: number;
  /** その年に割り当てられる金額（円） */
  amount: number;
  /** 既存の管理料請求が既にこの年をカバーしている */
  duplicated: boolean;
  /** 年が入っていない既存請求があり、この年が請求済みか機械判定できない */
  needsReview: boolean;
}

export interface PrepaidBillingPreviewRequest {
  contractPlotId: string;
  /** 窓口で受領した総額（円） */
  receivedAmount: number;
  /** 前受する年数 */
  years: number;
  /** 開始年（西暦）。未指定なら既存請求から推定する */
  startYear?: number | null;
}

export interface PrepaidBillingPreviewResponse {
  /** 年ごとの内訳（開始年から昇順） */
  rows: PrepaidBillingYearRow[];
  /** 実際に使われる開始年（推定結果を含む） */
  startYear: number;
  /** 開始年を推定できたか。false のときは窓口で入力が必要 */
  startYearEstimated: boolean;
  /** 管理料設定の年額（円）。設定が読めなければ null */
  annualFee: number | null;
  /** 受領額 -（年額 × 年数）。年額が読めなければ null */
  difference: number | null;
  /** 既存請求と重複する年（1 件でもあれば登録できない） */
  duplicatedYears: number[];
  /**
   * 請求済みか機械判定できない年。
   *
   * 年が入っていない既存請求がある区画で発生する。登録は止めないが、
   * 窓口で既存請求を確かめてもらうため画面に警告を出す。
   */
  needsReviewYears: number[];
}

export interface CreatePrepaidBillingRequest {
  contractPlotId: string;
  receivedAmount: number;
  years: number;
  startYear: number;
  /** 入金日 YYYY-MM-DD */
  paymentDate: string;
  notes?: string | null;
}

export interface CreatePrepaidBillingResponse {
  /** 一括取り消しに使う ID */
  prepaidBatchId: string;
  /** 作成した請求の件数 */
  billingCount: number;
  startYear: number;
  endYear: number;
  totalAmount: number;
}

export type DeletePrepaidBillingResponse = MessageResponse;

// ===== Payment =====

export interface PaymentsListResponse {
  items: Payment[];
  pagination: BillingsPaginationMeta;
}

export type PaymentDetailResponse = Payment;

export interface CreatePaymentRequest {
  billingId?: string | null;
  customerId?: string | null;
  contractPlotId?: string | null;
  scheduledDate?: string | null;
  scheduledAmount?: number | null;
  paymentDate?: string | null;
  paymentAmount: number;
  feeType?: string | null;
  applicationType?: number | null;
  billingType?: number | null;
  staffInCharge?: string | null;
  notes?: string | null;
}

export interface UpdatePaymentRequest {
  billingId?: string | null;
  customerId?: string | null;
  contractPlotId?: string | null;
  scheduledDate?: string | null;
  scheduledAmount?: number | null;
  paymentDate?: string | null;
  paymentAmount?: number;
  feeType?: string | null;
  applicationType?: number | null;
  billingType?: number | null;
  staffInCharge?: string | null;
  notes?: string | null;
}

export interface ListPaymentsQuery {
  page?: number;
  limit?: number;
  billingId?: string;
  customerId?: string;
  contractPlotId?: string;
  paymentDateFrom?: string;
  paymentDateTo?: string;
  orphan?: boolean;
  sortBy?: 'payment_date' | 'scheduled_date' | 'payment_amount' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export type DeletePaymentResponse = MessageResponse;
