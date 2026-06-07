/**
 * 区画スキーマのユニットテスト
 */
import { constructionInfoSchema, saleContractSchema } from '../../validations/plot';

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

describe('constructionInfoSchema', () => {
  it('accepts an empty payload (all fields optional)', () => {
    expect(constructionInfoSchema.safeParse({}).success).toBe(true);
  });

  // DB VarChar 長との整合（#40）— 超過時に P2000 でなく入力時バリデーションで弾く
  it('accepts constructionType up to 50 chars and rejects 51 chars (VarChar(50))', () => {
    expect(constructionInfoSchema.safeParse({ constructionType: 'あ'.repeat(50) }).success).toBe(
      true,
    );
    const r = constructionInfoSchema.safeParse({ constructionType: 'あ'.repeat(51) });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('工事区分は50文字以内で入力してください');
    }
  });

  it('accepts workItem1 up to 100 chars and rejects 101 chars (VarChar(100))', () => {
    expect(constructionInfoSchema.safeParse({ workItem1: 'あ'.repeat(100) }).success).toBe(true);
    const r = constructionInfoSchema.safeParse({ workItem1: 'あ'.repeat(101) });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('工事項目1は100文字以内で入力してください');
    }
  });

  it('accepts workItem2 up to 100 chars and rejects 101 chars (VarChar(100))', () => {
    expect(constructionInfoSchema.safeParse({ workItem2: 'あ'.repeat(100) }).success).toBe(true);
    const r = constructionInfoSchema.safeParse({ workItem2: 'あ'.repeat(101) });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('工事項目2は100文字以内で入力してください');
    }
  });
});
