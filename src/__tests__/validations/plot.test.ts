/**
 * 区画スキーマのユニットテスト
 */
import { saleContractSchema } from '../../validations/plot';

describe('saleContractSchema', () => {
  it('accepts an empty payload (all fields optional)', () => {
    expect(saleContractSchema.safeParse({}).success).toBe(true);
  });

  // DB VarChar(50) との整合（#38）— 超過時に P2000 でなく入力時バリデーションで弾く
  it('accepts acceptanceNumber up to 50 chars and rejects 51 chars (VarChar(50))', () => {
    expect(saleContractSchema.safeParse({ acceptanceNumber: 'あ'.repeat(50) }).success).toBe(
      true,
    );
    const r = saleContractSchema.safeParse({ acceptanceNumber: 'あ'.repeat(51) });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('受付番号は50文字以内で入力してください');
    }
  });

  it('accepts permitNumber up to 50 chars and rejects 51 chars (VarChar(50))', () => {
    expect(saleContractSchema.safeParse({ permitNumber: 'あ'.repeat(50) }).success).toBe(true);
    const r = saleContractSchema.safeParse({ permitNumber: 'あ'.repeat(51) });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('許可書番号は50文字以内で入力してください');
    }
  });
});
