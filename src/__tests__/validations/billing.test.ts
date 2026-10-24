/**
 * 請求の入力ルール。画面と裏側が同じ1枚を見る。
 * 金額は整数、年は1900〜2999、年数は1〜100、メモは2000文字まで。
 */
import { BillingCategory } from '../../enums';
import { createBillingSchema, updateBillingSchema } from '../../validations/billing';

const plotId = '123e4567-e89b-12d3-a456-426614174000';
const customerId = '123e4567-e89b-12d3-a456-426614174001';

const validCreate = {
  contractPlotId: plotId,
  customerId,
  category: BillingCategory.UsageFee,
  amount: 1000,
};

describe('createBillingSchema', () => {
  it('整数の金額は通す', () => {
    const result = createBillingSchema.safeParse(validCreate);
    expect(result.success).toBe(true);
  });

  it('小数の金額は止める', () => {
    const result = createBillingSchema.safeParse({ ...validCreate, amount: 1.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('整数');
    }
  });

  it('2000文字を超えるメモは止める', () => {
    const result = createBillingSchema.safeParse({
      ...validCreate,
      notes: 'あ'.repeat(2001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('2000');
    }
  });

  it('1899年は止める', () => {
    const result = createBillingSchema.safeParse({ ...validCreate, useStartYear: 1899 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('1900');
    }
  });

  it('請求年数101は止める', () => {
    const result = createBillingSchema.safeParse({ ...validCreate, billingYears: 101 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('100');
    }
  });
});

describe('updateBillingSchema', () => {
  it('更新でも小数の金額は止める', () => {
    const result = updateBillingSchema.safeParse({ amount: 1.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('整数');
    }
  });
});
