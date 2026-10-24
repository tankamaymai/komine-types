/**
 * 請求 (Billing) の Zod スキーマ
 *
 * バック (`billingController` の入力検証) とフロント (フォーム送信前検証) で
 * 共有する。API の CreateBillingRequest / UpdateBillingRequest に対応し、
 * 型はここから推論する。
 */

import { z } from 'zod';
import { BillingCategory, BillingRecordStatus } from '../enums';
import { dateSchema, uuidSchema } from './common';

/** 任意・null 許容の YYYY-MM-DD 日付 */
const nullableDate = dateSchema.nullable().optional();
/** 任意・null 許容の整数 */
const nullableInt = z.number().int('整数を入力してください').nullable().optional();
/** 金額（0以上の整数。小数はデータベースに入らない） */
const amountSchema = z
  .number()
  .int('金額は整数で入力してください')
  .nonnegative('金額は0以上で入力してください');
/** 使用開始年・使用終了年 */
const yearSchema = z
  .number()
  .int('整数を入力してください')
  .min(1900, '年は1900〜2999で入力してください')
  .max(2999, '年は1900〜2999で入力してください')
  .nullable()
  .optional();
/** 一括請求の年数 */
const billingYearsSchema = z
  .number()
  .int('整数を入力してください')
  .min(1, '年数は1〜100で入力してください')
  .max(100, '年数は1〜100で入力してください')
  .nullable()
  .optional();
const notesSchema = z
  .string()
  .max(2000, '備考は2000文字以内で入力してください')
  .nullable()
  .optional();

export const createBillingSchema = z.object({
  contractPlotId: uuidSchema,
  customerId: uuidSchema,
  category: z.nativeEnum(BillingCategory),
  amount: amountSchema,
  useStartYear: yearSchema,
  useEndYear: yearSchema,
  targetMonth: z
    .number()
    .int('整数を入力してください')
    .min(1, '対象月は1〜12で入力してください')
    .max(12, '対象月は1〜12で入力してください')
    .nullable()
    .optional(),
  billingYears: billingYearsSchema,
  contractDate: nullableDate,
  billingDate: nullableDate,
  applicationType: nullableInt,
  billingType: nullableInt,
  status: z.nativeEnum(BillingRecordStatus).optional(),
  notes: notesSchema,
});

export const updateBillingSchema = z.object({
  category: z.nativeEnum(BillingCategory).optional(),
  amount: amountSchema.optional(),
  useStartYear: yearSchema,
  useEndYear: yearSchema,
  targetMonth: z
    .number()
    .int('整数を入力してください')
    .min(1, '対象月は1〜12で入力してください')
    .max(12, '対象月は1〜12で入力してください')
    .nullable()
    .optional(),
  billingYears: billingYearsSchema,
  contractDate: nullableDate,
  billingDate: nullableDate,
  applicationType: nullableInt,
  billingType: nullableInt,
  status: z.nativeEnum(BillingRecordStatus).optional(),
  terminated: z.boolean().optional(),
  terminatedDate: nullableDate,
  notes: notesSchema,
});

export type CreateBillingInput = z.infer<typeof createBillingSchema>;
export type UpdateBillingInput = z.infer<typeof updateBillingSchema>;

export const listUnpaidBillingsQuerySchema = z.object({
  q: z.string().trim().min(1, '名前か区画番号を書いてください'),
  year: z.coerce.number().int().min(1900).max(2200).optional(),
  category: z.nativeEnum(BillingCategory).optional(),
});

export type ListUnpaidBillingsQueryInput = z.infer<typeof listUnpaidBillingsQuerySchema>;

export const listUncollectedBillingsQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === undefined || v === '' ? undefined : v)),
  year: z.coerce.number().int().min(1900).max(2200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListUncollectedBillingsQueryInput = z.infer<
  typeof listUncollectedBillingsQuerySchema
>;
