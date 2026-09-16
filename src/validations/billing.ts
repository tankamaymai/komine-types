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
/** 金額（0以上） */
const amountSchema = z.number().nonnegative('金額は0以上で入力してください');

export const createBillingSchema = z.object({
  contractPlotId: uuidSchema,
  customerId: uuidSchema,
  category: z.nativeEnum(BillingCategory),
  amount: amountSchema,
  useStartYear: nullableInt,
  useEndYear: nullableInt,
  targetMonth: z
    .number()
    .int('整数を入力してください')
    .min(1, '対象月は1〜12で入力してください')
    .max(12, '対象月は1〜12で入力してください')
    .nullable()
    .optional(),
  billingYears: nullableInt,
  contractDate: nullableDate,
  billingDate: nullableDate,
  applicationType: nullableInt,
  billingType: nullableInt,
  status: z.nativeEnum(BillingRecordStatus).optional(),
  notes: z.string().nullable().optional(),
});

export const updateBillingSchema = z.object({
  category: z.nativeEnum(BillingCategory).optional(),
  amount: amountSchema.optional(),
  useStartYear: nullableInt,
  useEndYear: nullableInt,
  targetMonth: z
    .number()
    .int('整数を入力してください')
    .min(1, '対象月は1〜12で入力してください')
    .max(12, '対象月は1〜12で入力してください')
    .nullable()
    .optional(),
  billingYears: nullableInt,
  contractDate: nullableDate,
  billingDate: nullableDate,
  applicationType: nullableInt,
  billingType: nullableInt,
  status: z.nativeEnum(BillingRecordStatus).optional(),
  terminated: z.boolean().optional(),
  terminatedDate: nullableDate,
  notes: z.string().nullable().optional(),
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
