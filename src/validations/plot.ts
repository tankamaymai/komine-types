/**
 * 区画フォームバリデーション（共有スキーマ）
 *
 * フロントエンドのフォームバリデーションとバックエンドのリクエストバリデーションで
 * 同一ルールを使用するための共有Zodスキーマ。
 * バックエンドのルールを正として、max length等を統一。
 */

import { z } from 'zod';
import {
  Gender,
  ContractRole,
  PaymentStatus,
  ContractStatus,
  DmSetting,
  AddressType,
} from '../enums';
import {
  optionalDateSchema,
  optionalEmailSchema,
  optionalNonnegativeInt,
  optionalNonnegativeNumber,
  katakanaSchema,
  postalCodeSchema,
  phoneSchema,
  yearMonthSchema,
} from './common';

// ===== 物理区画スキーマ =====

export const physicalPlotSchema = z.object({
  plotNumber: z
    .string()
    .min(1, '区画番号は必須です')
    .max(50, '区画番号は50文字以内で入力してください')
    .regex(/^[A-Z0-9-]+$/, '区画番号は半角英大文字・数字・ハイフンで入力してください'),
  areaName: z
    .string()
    .min(1, '区画は必須です')
    .max(100, '区画は100文字以内で入力してください'),
  areaSqm: z.coerce
    .number()
    .positive('面積は正の数値で入力してください')
    .default(3.6),
  mapId: z.coerce.number().int().nonnegative().optional().nullable(),
  notes: z.string().max(1000, '備考は1000文字以内で入力してください').optional().nullable(),
});

// ===== 契約区画スキーマ =====

export const contractPlotSchema = z.object({
  contractAreaSqm: z.coerce
    .number()
    .positive('契約面積は正の数値で入力してください'),
  locationDescription: z
    .string()
    .max(200, '位置説明は200文字以内で入力してください')
    .optional()
    .nullable(),
  inscription: z
    .string()
    .max(120, '碑文は120文字以内で入力してください')
    .optional()
    .nullable(),
});

// ===== 販売契約スキーマ =====

export const saleContractSchema = z.object({
  contractDate: optionalDateSchema.nullable(),
  price: z.coerce.number().nonnegative('価格は0以上で入力してください').optional().nullable(),
  contractStatus: z
    .nativeEnum(ContractStatus)
    .optional()
    .default(ContractStatus.Vacant),
  paymentStatus: z
    .nativeEnum(PaymentStatus)
    .optional()
    .default(PaymentStatus.Unpaid),
  reservationDate: optionalDateSchema,
  requestDate: optionalDateSchema,
  // DB は acceptance_number @db.VarChar(50)。超過時の P2000 を入力時に弾く（#38）
  acceptanceNumber: z.string().max(50, '受付番号は50文字以内で入力してください').optional(),
  acceptanceDate: optionalDateSchema,
  staffInCharge: z
    .string()
    .max(100, '担当者は100文字以内で入力してください')
    .optional()
    .nullable(),
  agentName: z
    .string()
    .max(100, '仲介人名は100文字以内で入力してください')
    .optional()
    .nullable(),
  permitDate: optionalDateSchema,
  // DB は permit_number @db.VarChar(50)。超過時の P2000 を入力時に弾く（#38）
  permitNumber: z.string().max(50, '許可書番号は50文字以内で入力してください').optional(),
  startDate: optionalDateSchema,
  notes: z.string().max(1000, '備考は1000文字以内で入力してください').optional().nullable(),
  graveKind: z.coerce.number().int().optional().nullable(),
  graveKubun: z.coerce.number().int().optional().nullable(),
  graveType: z.coerce.number().int().optional().nullable(),
  legacyGraveCd: z.coerce.number().int().optional().nullable(),
});

// ===== 顧客スキーマ =====

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, '氏名は必須です')
    .max(100, '氏名は100文字以内で入力してください'),
  nameKana: katakanaSchema('氏名カナ').max(
    100,
    '氏名カナは100文字以内で入力してください',
  ),
  birthDate: optionalDateSchema.nullable(),
  gender: z.nativeEnum(Gender).optional().nullable(),
  postalCode: postalCodeSchema,
  address: z
    .string()
    .min(1, '住所は必須です')
    .max(200, '住所は200文字以内で入力してください'),
  addressLine2: z
    .string()
    .max(200, '住所行2は200文字以内で入力してください')
    .optional()
    .nullable(),
  registeredPostalCode: z
    .string()
    .regex(/^\d{7}$/, '本籍郵便番号は7桁の数字で入力してください（ハイフンなし）')
    .or(z.literal(''))
    .optional()
    .nullable(),
  registeredAddress: z
    .string()
    .max(200, '登録住所は200文字以内で入力してください')
    .optional()
    .nullable(),
  phoneNumber: phoneSchema.nullable(),
  faxNumber: phoneSchema.nullable(),
  email: optionalEmailSchema.nullable(),
  // 振込先情報（ゆうちょ自動払込 CSV 出力用。レガシー t_danka.kikan_name 系から移行）
  bankName: z
    .string()
    .max(50, '銀行名は50文字以内で入力してください')
    .optional()
    .nullable(),
  branchName: z
    .string()
    .max(50, '支店名は50文字以内で入力してください')
    .optional()
    .nullable(),
  accountType: z
    .string()
    .max(10, '預金種目は10文字以内で入力してください')
    .optional()
    .nullable(),
  accountNumber: z
    .string()
    .max(20, '口座番号は20文字以内で入力してください')
    .optional()
    .nullable(),
  accountHolder: z
    .string()
    .max(100, '口座名義は100文字以内で入力してください')
    .optional()
    .nullable(),
  notes: z.string().max(1000, '備考は1000文字以内で入力してください').optional().nullable(),
  staffId: z.coerce.number().int().optional().nullable(),
  legacyDankaCd: z.coerce.number().int().optional().nullable(),
  role: z
    .nativeEnum(ContractRole)
    .optional()
    .default(ContractRole.Contractor),
});

// ===== 申込者スキーマ =====
//
// 旧画面では「申込者」と「契約者」を並列に表示する。新システムでは別 Customer +
// SaleContractRole(role=applicant) として保存。住所等は契約者と異なる場合のみ入力するため
// 必須項目は名前・カナのみ（業務確認 D2 #133 ベース）。

export const applicantSchema = z.object({
  name: z
    .string()
    .min(1, '氏名は必須です')
    .max(100, '氏名は100文字以内で入力してください'),
  nameKana: katakanaSchema('氏名カナ').max(
    100,
    '氏名カナは100文字以内で入力してください',
  ),
  birthDate: optionalDateSchema.nullable(),
  gender: z.nativeEnum(Gender).optional().nullable(),
  postalCode: z
    .string()
    .regex(/^\d{7}$/, '郵便番号は7桁の数字で入力してください（ハイフンなし）')
    .or(z.literal(''))
    .optional()
    .nullable(),
  address: z
    .string()
    .max(200, '住所は200文字以内で入力してください')
    .optional()
    .nullable(),
  addressLine2: z
    .string()
    .max(200, '住所行2は200文字以内で入力してください')
    .optional()
    .nullable(),
  registeredPostalCode: z
    .string()
    .regex(/^\d{7}$/, '本籍郵便番号は7桁の数字で入力してください（ハイフンなし）')
    .or(z.literal(''))
    .optional()
    .nullable(),
  registeredAddress: z
    .string()
    .max(200, '本籍地は200文字以内で入力してください')
    .optional()
    .nullable(),
  phoneNumber: phoneSchema.optional().nullable(),
  faxNumber: phoneSchema.optional().nullable(),
  email: optionalEmailSchema.nullable(),
  notes: z.string().max(1000, '備考は1000文字以内で入力してください').optional().nullable(),
  staffId: z.coerce.number().int().optional().nullable(),
  legacyDankaCd: z.coerce.number().int().optional().nullable(),
});

// ===== 勤務先情報スキーマ =====

export const workInfoSchema = z.object({
  companyName: z
    .string()
    .min(1, '勤務先名称は必須です')
    .max(100, '勤務先名称は100文字以内で入力してください'),
  companyNameKana: z
    .string()
    .max(100, '勤務先カナは100文字以内で入力してください')
    .optional()
    .default(''),
  workAddress: z
    .string()
    .max(200, '勤務先住所は200文字以内で入力してください')
    .optional()
    .default(''),
  workPostalCode: z
    .string()
    .max(10, '勤務先郵便番号は10文字以内で入力してください')
    .optional()
    .default(''),
  workPhoneNumber: phoneSchema.or(z.literal('')).default(''),
  dmSetting: z.nativeEnum(DmSetting).optional().default(DmSetting.Allow),
  addressType: z
    .nativeEnum(AddressType)
    .optional()
    .default(AddressType.Home),
  notes: z.string().max(1000, '備考は1000文字以内で入力してください').optional().nullable(),
});

// ===== 使用料スキーマ =====

export const usageFeeSchema = z.object({
  calculationType: z.string().max(20).optional().nullable(),
  taxType: z.string().max(20).optional().nullable(),
  billingType: z.string().max(20).optional().nullable(),
  billingYears: z.string().max(20).optional().nullable(),
  usageFee: z.string().max(50).optional().nullable(),
  area: z.string().max(20).optional().nullable(),
  unitPrice: z.string().max(50).optional().nullable(),
  paymentMethod: z.string().max(50).optional().nullable(),
});

// ===== 管理料スキーマ =====

export const managementFeeSchema = z.object({
  calculationType: z.string().max(20).optional().nullable(),
  taxType: z.string().max(20).optional().nullable(),
  billingType: z.string().max(20).optional().nullable(),
  billingYears: z.string().max(20).optional().nullable(),
  area: z.string().max(20).optional().nullable(),
  billingMonth: z.string().max(20).optional().nullable(),
  managementFee: z.string().max(50).optional().nullable(),
  unitPrice: z.string().max(50).optional().nullable(),
  lastBillingMonth: yearMonthSchema.nullable(),
  paymentMethod: z.string().max(50).optional().nullable(),
});

// ===== 墓石情報スキーマ =====

export const gravestoneInfoSchema = z.object({
  gravestoneBase: z.string().max(100).optional().nullable(),
  enclosurePosition: z.string().max(100).optional().nullable(),
  gravestoneDealer: z.string().max(100).optional().nullable(),
  gravestoneType: z.string().max(100).optional().nullable(),
  surroundingArea: z.string().max(100).optional().nullable(),
  gravestoneCost: optionalNonnegativeNumber.optional(),
  establishmentDeadline: optionalDateSchema.nullable(),
  establishmentDate: optionalDateSchema.nullable(),
  gravestoneInscription: z.string().max(200).optional().nullable(),
  directionId: z.coerce.number().int().optional().nullable(),
  positionId: z.coerce.number().int().optional().nullable(),
});

// ===== 家族連絡先スキーマ =====

export const familyContactSchema = z.object({
  id: z.string().optional(),
  emergencyContactFlag: z.boolean().optional().default(false),
  name: z
    .string()
    .min(1, '氏名は必須です')
    .max(100, '氏名は100文字以内で入力してください'),
  nameKana: z.string().max(100).optional().nullable(),
  birthDate: optionalDateSchema.nullable(),
  relationship: z
    .string()
    .min(1, '続柄は必須です')
    .max(50, '続柄は50文字以内で入力してください'),
  postalCode: z.string().max(10).optional().nullable(),
  address: z
    .string()
    .max(200, '住所は200文字以内で入力してください')
    .optional()
    .nullable(),
  phoneNumber: z
    .string()
    .max(20, '電話番号は20文字以内で入力してください')
    .optional()
    .nullable(),
  phoneNumber2: z.string().max(20).optional().nullable(),
  faxNumber: z.string().max(20).optional().nullable(),
  email: optionalEmailSchema.nullable(),
  registeredAddress: z.string().max(200).optional().nullable(),
  mailingType: z.nativeEnum(AddressType).optional().nullable(),
  workCompanyName: z.string().max(100).optional().nullable(),
  workCompanyNameKana: z.string().max(100).optional().nullable(),
  workAddress: z.string().max(200).optional().nullable(),
  workPhoneNumber: z.string().max(20).optional().nullable(),
  contactMethod: z.string().max(50).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

// ===== 埋葬者スキーマ =====

export const buriedPersonSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, '氏名は必須です')
    .max(100, '氏名は100文字以内で入力してください'),
  nameKana: z.string().max(100).optional().nullable(),
  relationship: z.string().max(50).optional().nullable(),
  birthDate: optionalDateSchema.nullable(),
  deathDate: optionalDateSchema.nullable(),
  age: optionalNonnegativeInt.optional(),
  gender: z.nativeEnum(Gender).optional().nullable(),
  burialDate: optionalDateSchema.nullable(),
  posthumousName: z.string().max(200).optional().nullable(),
  reportDate: optionalDateSchema.nullable(),
  religion: z.string().max(50).optional().nullable(),
  deathPlace: z.string().max(200).optional().nullable(),
  causeOfDeath: z.string().max(200).optional().nullable(),
  chiefMournerName: z.string().max(100).optional().nullable(),
  chiefMournerRelationship: z.string().max(50).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

// ===== 工事情報スキーマ =====

export const constructionInfoSchema = z.object({
  id: z.string().optional(),
  // DB は construction_type @db.VarChar(50)。超過時の P2000 を入力時に弾く（#40）
  constructionType: z
    .string()
    .max(50, '工事区分は50文字以内で入力してください')
    .optional()
    .nullable(),
  startDate: optionalDateSchema.nullable(),
  completionDate: optionalDateSchema.nullable(),
  contractor: z.string().max(100).optional().nullable(),
  supervisor: z.string().max(100).optional().nullable(),
  progress: z.string().max(50).optional().nullable(),
  // DB は work_item_1 @db.VarChar(100)。超過時の P2000 を入力時に弾く（#40）
  workItem1: z
    .string()
    .max(100, '工事項目1は100文字以内で入力してください')
    .optional()
    .nullable(),
  workDate1: optionalDateSchema.nullable(),
  workAmount1: optionalNonnegativeInt.optional(),
  workStatus1: z.string().max(50).optional().nullable(),
  // DB は work_item_2 @db.VarChar(100)。超過時の P2000 を入力時に弾く（#40）
  workItem2: z
    .string()
    .max(100, '工事項目2は100文字以内で入力してください')
    .optional()
    .nullable(),
  workDate2: optionalDateSchema.nullable(),
  workAmount2: optionalNonnegativeInt.optional(),
  workStatus2: z.string().max(50).optional().nullable(),
  permitNumber: z.string().max(50).optional().nullable(),
  applicationDate: optionalDateSchema.nullable(),
  permitDate: optionalDateSchema.nullable(),
  permitStatus: z.string().max(50).optional().nullable(),
  paymentType1: z.string().max(50).optional().nullable(),
  paymentAmount1: optionalNonnegativeInt.optional(),
  paymentDate1: optionalDateSchema.nullable(),
  paymentStatus1: z.string().max(50).optional().nullable(),
  paymentType2: z.string().max(50).optional().nullable(),
  paymentAmount2: optionalNonnegativeInt.optional(),
  paymentScheduledDate2: optionalDateSchema.nullable(),
  paymentStatus2: z.string().max(50).optional().nullable(),
  scheduledEndDate: optionalDateSchema.nullable(),
  constructionContent: z.string().max(2000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

// ===== 合祀情報スキーマ =====

export const collectiveBurialSchema = z.object({
  burialCapacity: z.coerce
    .number()
    .int()
    .positive('埋葬上限は1以上で入力してください'),
  validityPeriodYears: z.coerce
    .number()
    .int()
    .positive('有効期間は1年以上で入力してください'),
  billingAmount: optionalNonnegativeNumber.optional(),
  notes: z.string().max(1000).optional().nullable(),
});

// ===== メインフォームスキーマ（作成用） =====

export const plotFormSchema = z.object({
  physicalPlot: physicalPlotSchema,
  contractPlot: contractPlotSchema,
  saleContract: saleContractSchema,
  customer: customerSchema,
  applicant: applicantSchema.optional().nullable(),
  workInfo: workInfoSchema.optional().nullable(),
  usageFee: usageFeeSchema.optional().nullable(),
  managementFee: managementFeeSchema.optional().nullable(),
  gravestoneInfo: gravestoneInfoSchema.optional().nullable(),
  familyContacts: z.array(familyContactSchema).optional(),
  buriedPersons: z.array(buriedPersonSchema).optional(),
  constructionInfos: z.array(constructionInfoSchema).optional(),
  collectiveBurial: collectiveBurialSchema.optional().nullable(),
});

// ===== メインフォームスキーマ（更新用） =====

export const plotUpdateFormSchema = z.object({
  physicalPlot: z
    .object({
      plotNumber: z.string().max(50).optional(),
      areaName: z.string().max(100).optional(),
      areaSqm: z.coerce.number().positive().optional(),
      status: z.string().max(20).optional(),
      mapId: z.coerce.number().int().nonnegative().optional().nullable(),
      notes: z.string().max(1000).optional().nullable(),
    })
    .optional(),
  contractPlot: contractPlotSchema.partial().optional(),
  saleContract: saleContractSchema.partial().optional(),
  customer: customerSchema.partial().optional(),
  applicant: applicantSchema.partial().optional().nullable(),
  workInfo: workInfoSchema.optional().nullable(),
  usageFee: usageFeeSchema.optional().nullable(),
  managementFee: managementFeeSchema.optional().nullable(),
  gravestoneInfo: gravestoneInfoSchema.optional().nullable(),
  familyContacts: z.array(familyContactSchema).optional(),
  buriedPersons: z.array(buriedPersonSchema).optional(),
  constructionInfos: z.array(constructionInfoSchema).optional(),
  collectiveBurial: collectiveBurialSchema.optional().nullable(),
});

// ===== 型エクスポート =====

export type PhysicalPlotFormData = z.infer<typeof physicalPlotSchema>;
export type ContractPlotFormData = z.infer<typeof contractPlotSchema>;
export type SaleContractFormData = z.infer<typeof saleContractSchema>;
export type CustomerSectionFormData = z.infer<typeof customerSchema>;
export type ApplicantSectionFormData = z.infer<typeof applicantSchema>;
export type WorkInfoFormData = z.infer<typeof workInfoSchema>;
export type UsageFeeFormData = z.infer<typeof usageFeeSchema>;
export type ManagementFeeFormData = z.infer<typeof managementFeeSchema>;
export type GravestoneInfoFormData = z.infer<typeof gravestoneInfoSchema>;
export type FamilyContactFormData = z.infer<typeof familyContactSchema>;
export type BuriedPersonFormData = z.infer<typeof buriedPersonSchema>;
export type ConstructionInfoFormData = z.infer<typeof constructionInfoSchema>;
export type CollectiveBurialFormData = z.infer<typeof collectiveBurialSchema>;

export type PlotFormData = z.infer<typeof plotFormSchema>;
export type PlotUpdateFormData = z.infer<typeof plotUpdateFormSchema>;
