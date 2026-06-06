/**
 * 入金 (Payment) の Zod スキーマ
 *
 * バック (`paymentController` の入力検証) とフロント (フォーム送信前検証) で
 * 共有する。API の CreatePaymentRequest / UpdatePaymentRequest に対応し、
 * 型はここから推論する。
 *
 * billingId は nullable (請求未紐付けの孤児入金に対応)。
 */

import { z } from 'zod';
import { dateSchema, uuidSchema } from './common';

/** 任意・null 許容の YYYY-MM-DD 日付 */
const nullableDate = dateSchema.nullable().optional();
/** 任意・null 許容の整数 */
const nullableInt = z.number().int('整数を入力してください').nullable().optional();
/** 任意・null 許容の UUID */
const nullableUuid = uuidSchema.nullable().optional();

export const createPaymentSchema = z.object({
  billingId: nullableUuid,
  customerId: nullableUuid,
  contractPlotId: nullableUuid,
  scheduledDate: nullableDate,
  scheduledAmount: z
    .number()
    .nonnegative('金額は0以上で入力してください')
    .nullable()
    .optional(),
  paymentDate: nullableDate,
  paymentAmount: z.number().nonnegative('金額は0以上で入力してください'),
  // DB は fee_type @db.VarChar(50)。超過時の P2000 を入力時に弾く（#38）
  feeType: z.string().max(50, '料金種別は50文字以内で入力してください').nullable().optional(),
  applicationType: nullableInt,
  billingType: nullableInt,
  // DB は staff_in_charge @db.VarChar(100)。超過時の P2000 を入力時に弾く（#38）
  staffInCharge: z
    .string()
    .max(100, '担当者は100文字以内で入力してください')
    .nullable()
    .optional(),
  notes: z.string().nullable().optional(),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
