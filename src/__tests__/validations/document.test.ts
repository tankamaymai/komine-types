/**
 * generatePdfRequestSchema のテスト（#32）
 *
 * discriminated union に全テンプレートタイプが揃っていることを保証する。
 * envelope-letter / envelope-base が欠落していたため、封筒書・封筒大の
 * PDF生成が入口の Zod 検証で常に 400 になっていた。
 */

import { generatePdfRequestSchema } from '../../validations/document';
import {
  DOCUMENT_TEMPLATE_TYPES,
  ENVELOPE_BASE_PAGES,
  ENVELOPE_LETTER_PAGES,
  PERMIT_CERTIFICATE_PAGES,
} from '../../api/documents';

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

  it('許可証の厚紙印刷フラグ textOnly を受理する', () => {
    const result = generatePdfRequestSchema.safeParse({
      templateType: 'permit',
      templateData: { issueYear: '2026', issueMonth: '9', issueDay: '23' },
      textOnly: true,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.textOnly).toBe(true);
  });

  it('封筒書は表面だけ', () => {
    expect(ENVELOPE_LETTER_PAGES).toHaveLength(1);
    expect(ENVELOPE_LETTER_PAGES[0]?.label).not.toContain('裏');
  });

  it('封筒は住所と名前が縦書きで、郵便番号の下と中央に置いている', () => {
    const front = ENVELOPE_LETTER_PAGES[0];
    const address = front?.fields.find((field) => field.id === 'recipientAddress');
    const name = front?.fields.find((field) => field.id === 'recipientName');
    expect(address?.direction).toBe('vertical');
    expect(name?.direction).toBe('vertical');
    expect(address && name && address.x > name.x).toBe(true);
  });

  it('封筒大の郵便番号1桁目は、台紙の左端の枠の中心付近', () => {
    const digit = ENVELOPE_BASE_PAGES[0]?.fields.find(
      (field) => field.id === 'recipientPostalDigit1'
    );
    expect(digit?.x).toBeGreaterThan(440);
    expect(digit?.x).toBeLessThan(470);
    expect(digit?.y).toBeGreaterThan(950);
  });

  it('許可証の発行年は月・日よりさらに右、月と日は元の位置より約16px右', () => {
    const fields = PERMIT_CERTIFICATE_PAGES[0]?.fields ?? [];
    const xOf = (id: string) => fields.find((field) => field.id === id)?.x;
    expect(xOf('issueYear')).toBe(411);
    expect(xOf('issueMonth')).toBe(466);
    expect(xOf('issueDay')).toBe(516);
  });

  it('templateData の型不一致は拒否する（invoice に customerName 欠落）', () => {
    const result = generatePdfRequestSchema.safeParse({
      templateType: 'invoice',
      templateData: {},
    });
    expect(result.success).toBe(false);
  });
});
