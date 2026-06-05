/**
 * generatePdfRequestSchema のテスト（#32）
 *
 * discriminated union に全テンプレートタイプが揃っていることを保証する。
 * envelope-letter / envelope-base が欠落していたため、封筒書・封筒台の
 * PDF生成が入口の Zod 検証で常に 400 になっていた。
 */

import { generatePdfRequestSchema } from '../../validations/document';
import { DOCUMENT_TEMPLATE_TYPES } from '../../api/documents';

// テンプレートタイプごとの最小有効 templateData
const MINIMAL_TEMPLATE_DATA: Record<string, unknown> = {
  invoice: { customerName: '山田太郎' },
  postcard: {
    recipientName: '山田太郎',
    recipientAddress: '東京都新宿区1-1-1',
    recipientPostalCode: '1600022',
    senderName: '小嶺霊園',
    senderAddress: '福岡県北九州市1-1-1',
    senderPostalCode: '8070842',
    message: 'ご案内',
    date: '2026-06-05',
  },
  permit: { recipientName: '山田太郎' },
  'envelope-letter': { recipientName: '山田太郎', recipientAddress: '東京都新宿区1-1-1' },
  'envelope-base': { recipientName: '山田太郎', recipientAddress: '東京都新宿区1-1-1' },
  'payment-guide': { orgName: '小嶺霊園' },
};

describe('generatePdfRequestSchema (#32)', () => {
  it.each(DOCUMENT_TEMPLATE_TYPES.map((t) => [t]))(
    '全テンプレートタイプを受理する: %s',
    (templateType) => {
      const result = generatePdfRequestSchema.safeParse({
        templateType,
        templateData: MINIMAL_TEMPLATE_DATA[templateType],
      });
      expect(result.success).toBe(true);
    }
  );

  it('envelope-letter は permit と同じテンプレートデータ形を受理する', () => {
    const result = generatePdfRequestSchema.safeParse({
      templateType: 'envelope-letter',
      templateData: {
        recipientPostalCode: '1600022',
        recipientAddress: '東京都新宿区1-1-1',
        recipientName: '山田太郎',
      },
      name: '封筒書_山田太郎',
    });
    expect(result.success).toBe(true);
  });

  it('未知の templateType は拒否する', () => {
    const result = generatePdfRequestSchema.safeParse({
      templateType: 'unknown-template',
      templateData: {},
    });
    expect(result.success).toBe(false);
  });

  it('templateData の型不一致は拒否する（invoice に customerName 欠落）', () => {
    const result = generatePdfRequestSchema.safeParse({
      templateType: 'invoice',
      templateData: {},
    });
    expect(result.success).toBe(false);
  });
});
