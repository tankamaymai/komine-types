import { BillingCategory } from '../../enums';
import { listUnpaidBillingsQuerySchema } from '../../validations/billing';
import { settleRemainingSchema } from '../../validations/payment';

const UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('listUnpaidBillingsQuerySchema', () => {
  it('accepts q only', () => {
    const r = listUnpaidBillingsQuerySchema.safeParse({ q: '田中' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.q).toBe('田中');
      expect(r.data.year).toBeUndefined();
      expect(r.data.category).toBeUndefined();
    }
  });

  it('trims q and accepts year + category', () => {
    const r = listUnpaidBillingsQuerySchema.safeParse({
      q: '  10番  ',
      year: '2026',
      category: BillingCategory.ManagementFee,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.q).toBe('10番');
      expect(r.data.year).toBe(2026);
      expect(r.data.category).toBe(BillingCategory.ManagementFee);
    }
  });

  it('rejects blank q', () => {
    const r = listUnpaidBillingsQuerySchema.safeParse({ q: '   ' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('名前か区画番号を書いてください');
    }
  });

  it('rejects year outside 1900-2200', () => {
    expect(listUnpaidBillingsQuerySchema.safeParse({ q: '田中', year: 1899 }).success).toBe(false);
    expect(listUnpaidBillingsQuerySchema.safeParse({ q: '田中', year: 2201 }).success).toBe(false);
  });
});

describe('settleRemainingSchema', () => {
  it('accepts billingId', () => {
    expect(settleRemainingSchema.safeParse({ billingId: UUID }).success).toBe(true);
  });

  it('rejects missing billingId', () => {
    expect(settleRemainingSchema.safeParse({}).success).toBe(false);
  });
});
