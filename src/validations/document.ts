/**
 * 書類 / PDF テンプレート関連の Zod スキーマ
 *
 * バック (`documentController` の入力検証) とフロント (フォーム送信前の検証) で
 * 同じスキーマを使い、型もここから推論する。
 */

import { z } from 'zod';

// ============================================================
// 各テンプレートデータの Zod スキーマ
// ============================================================

const invoiceItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
});

export const invoiceTemplateDataSchema = z.object({
  customerName: z.string().min(1, 'customerName は必須です'),
  yearCount: z.union([z.number(), z.string()]).optional(),
  amount: z.number().optional(),
  nextNoticeDate: z.string().optional(),
  seasonGreeting: z.string().optional(),

  invoiceNumber: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  customerAddress: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  total: z.number().optional(),
  notes: z.string().optional(),
});

export const postcardTemplateDataSchema = z.object({
  recipientName: z.string(),
  recipientAddress: z.string(),
  recipientPostalCode: z.string(),
  senderName: z.string(),
  senderAddress: z.string(),
  senderPostalCode: z.string(),
  message: z.string(),
  date: z.string(),
});

export const permitTemplateDataSchema = z.object({
  permitNumber: z.string().optional(),
  permitType: z.string().optional(),
  plotNumber: z.string().optional(),
  area: z.string().optional(),
  issueYear: z.string().optional(),
  issueMonth: z.string().optional(),
  issueDay: z.string().optional(),
  applicantName: z.string().optional(),
  registeredAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  recipientPostalCode: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientAddress2: z.string().optional(),
  recipientName: z.string().optional(),
  notes: z.string().optional(),
});

export const paymentGuideTemplateDataSchema = z.object({
  option1: z.string().optional(),
  option2: z.string().optional(),
  notice1: z.string().optional(),
  notice2: z.string().optional(),
  notice3: z.string().optional(),
  bank1Name: z.string().optional(),
  bank1AccountType: z.string().optional(),
  bank1AccountNumber: z.string().optional(),
  bank2Name: z.string().optional(),
  bank2Symbol: z.string().optional(),
  bank2Number: z.string().optional(),
  orgName: z.string().optional(),
  orgNameKana: z.string().optional(),
  repName: z.string().optional(),
  repNameKana: z.string().optional(),
  cemeteryName: z.string().optional(),
  tel: z.string().optional(),
  fax: z.string().optional(),
});

// ============================================================
// PDF 生成リクエストの discriminated union
// ============================================================

const baseGeneratePdfFields = {
  documentId: z.string().uuid().optional(),
  name: z.string().optional(),
  contractPlotId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
};

export const generatePdfRequestSchema = z.discriminatedUnion('templateType', [
  z.object({
    templateType: z.literal('invoice'),
    templateData: invoiceTemplateDataSchema,
    ...baseGeneratePdfFields,
  }),
  z.object({
    templateType: z.literal('postcard'),
    templateData: postcardTemplateDataSchema,
    ...baseGeneratePdfFields,
  }),
  z.object({
    templateType: z.literal('permit'),
    templateData: permitTemplateDataSchema,
    ...baseGeneratePdfFields,
  }),
  // 封筒書・封筒台は許可証と同じテンプレートデータ（宛先系フィールド）を使う。
  // backend documentValidation.ts の TEMPLATE_DATA_SCHEMAS（regenerate パス）と
  // 同一の割り当て。union から欠落していると generate-pdf の入口で
  // 'No matching discriminator' → 400 になり封筒PDFが一切出力できない（#32）
  z.object({
    templateType: z.literal('envelope-letter'),
    templateData: permitTemplateDataSchema,
    ...baseGeneratePdfFields,
  }),
  z.object({
    templateType: z.literal('envelope-base'),
    templateData: permitTemplateDataSchema,
    ...baseGeneratePdfFields,
  }),
  z.object({
    templateType: z.literal('payment-guide'),
    templateData: paymentGuideTemplateDataSchema,
    ...baseGeneratePdfFields,
  }),
]);

export type GeneratePdfRequestInput = z.infer<typeof generatePdfRequestSchema>;
