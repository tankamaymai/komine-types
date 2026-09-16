import { BillingCategory } from '../../enums';
import {
  listUncollectedBillingsQuerySchema,
  listUnpaidBillingsQuerySchema,
} from '../../validations/billing';
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

describe('listUncollectedBillingsQuerySchema', () => {
  it('accepts empty query with defaults', () => {
    const r = listUncollectedBillingsQuerySchema.safeParse({});
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.q).toBeUndefined();
      expect(r.data.page).toBe(1);
      expect(r.data.limit).toBe(50);
    }
  });

  it('treats blank q as undefined', () => {
    const r = listUncollectedBillingsQuerySchema.safeParse({ q: '   ' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.q).toBeUndefined();
    }
  });

  it('accepts q with value', () => {
    const r = listUncollectedBillingsQuerySchema.safeParse({ q: '田中' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.q).toBe('田中');
    }
  });

  it('coerces year, page, and limit from strings', () => {
    const r = listUncollectedBillingsQuerySchema.safeParse({
      year: '2026',
      page: '2',
      limit: '20',
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.year).toBe(2026);
      expect(r.data.page).toBe(2);
      expect(r.data.limit).toBe(20);
    }
  });

  it('rejects year below 1900', () => {
    expect(listUncollectedBillingsQuerySchema.safeParse({ year: 1899 }).success).toBe(false);
  });

  it('rejects year above 2200', () => {
    expect(listUncollectedBillingsQuerySchema.safeParse({ year: 2201 }).success).toBe(false);
  });

  it('rejects page below 1', () => {
    expect(listUncollectedBillingsQuerySchema.safeParse({ page: 0 }).success).toBe(false);
  });

  it('rejects limit above 100', () => {
    expect(listUncollectedBillingsQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
  });

  it('rejects limit below 1', () => {
    expect(listUncollectedBillingsQuerySchema.safeParse({ limit: 0 }).success).toBe(false);
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
