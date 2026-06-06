/**
 * 入金スキーマのユニットテスト
 */
import { createPaymentSchema, updatePaymentSchema } from '../../validations/payment';

const validUuid = '123e4567-e89b-12d3-a456-426614174000';

describe('createPaymentSchema', () => {
  it('accepts a minimal payload (paymentAmount only)', () => {
    const r = createPaymentSchema.safeParse({ paymentAmount: 0 });
    expect(r.success).toBe(true);
  });

  it('accepts a fully-populated payload', () => {
    const r = createPaymentSchema.safeParse({
      billingId: validUuid,
      customerId: validUuid,
      contractPlotId: validUuid,
      scheduledDate: '2026-05-01',
      scheduledAmount: 10000,
      paymentDate: '2026-05-10',
      paymentAmount: 10000,
      feeType: 'usage_fee',
      applicationType: 1,
      billingType: 2,
      staffInCharge: '山田',
      notes: 'メモ',
    });
    expect(r.success).toBe(true);
  });

  it('accepts null for nullable foreign keys (orphan payment)', () => {
    const r = createPaymentSchema.safeParse({
      billingId: null,
      paymentAmount: 5000,
    });
    expect(r.success).toBe(true);
  });

  it('rejects a missing paymentAmount', () => {
    expect(createPaymentSchema.safeParse({}).success).toBe(false);
  });

  it('rejects a negative paymentAmount', () => {
    expect(createPaymentSchema.safeParse({ paymentAmount: -1 }).success).toBe(false);
  });

  it('rejects a malformed billingId UUID', () => {
    expect(
      createPaymentSchema.safeParse({ paymentAmount: 1, billingId: 'nope' }).success,
    ).toBe(false);
  });

  it('rejects a malformed scheduledDate', () => {
    expect(
      createPaymentSchema.safeParse({ paymentAmount: 1, scheduledDate: '2026/05/01' }).success,
    ).toBe(false);
  });

  it('rejects a non-integer applicationType', () => {
    expect(
      createPaymentSchema.safeParse({ paymentAmount: 1, applicationType: 1.5 }).success,
    ).toBe(false);
  });

  // DB VarChar 長との整合（#38）— 超過時に P2000 でなく入力時バリデーションで弾く
  it('accepts feeType up to 50 chars and rejects 51 chars (VarChar(50))', () => {
    expect(
      createPaymentSchema.safeParse({ paymentAmount: 1, feeType: 'あ'.repeat(50) }).success,
    ).toBe(true);
    expect(
      createPaymentSchema.safeParse({ paymentAmount: 1, feeType: 'あ'.repeat(51) }).success,
    ).toBe(false);
  });

  it('accepts staffInCharge up to 100 chars and rejects 101 chars (VarChar(100))', () => {
    expect(
      createPaymentSchema.safeParse({ paymentAmount: 1, staffInCharge: 'あ'.repeat(100) })
        .success,
    ).toBe(true);
    expect(
      createPaymentSchema.safeParse({ paymentAmount: 1, staffInCharge: 'あ'.repeat(101) })
        .success,
    ).toBe(false);
  });
});

describe('updatePaymentSchema (partial)', () => {
  it('accepts an empty object', () => {
    expect(updatePaymentSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a single-field update', () => {
    expect(updatePaymentSchema.safeParse({ notes: '更新' }).success).toBe(true);
  });

  it('still enforces field-level rules on provided fields', () => {
    expect(updatePaymentSchema.safeParse({ paymentAmount: -10 }).success).toBe(false);
  });
});
