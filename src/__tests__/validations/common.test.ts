/**
 * 共通バリデーションスキーマのユニットテスト
 *
 * @komine/types は frontend/backend 双方の単一ソースのため、
 * フィールドレベルバリデーションの挙動を固定し、デグレを検知する。
 */
import {
  dateSchema,
  optionalDateSchema,
  yearMonthSchema,
  phoneSchema,
  requiredPhoneSchema,
  postalCodeSchema,
  emailSchema,
  optionalEmailSchema,
  katakanaSchema,
  optionalNonnegativeNumber,
  optionalNonnegativeInt,
  uuidSchema,
} from '../../validations/common';

describe('dateSchema (YYYY-MM-DD)', () => {
  it.each(['2026-05-26', '2000-01-01', '1999-12-31'])('accepts %s', (v) => {
    expect(dateSchema.safeParse(v).success).toBe(true);
  });

  it.each(['2026/05/26', '26-05-2026', '2026-5-6', '', 'abc'])('rejects %s', (v) => {
    expect(dateSchema.safeParse(v).success).toBe(false);
  });
});

describe('optionalDateSchema', () => {
  it('accepts a valid date', () => {
    expect(optionalDateSchema.safeParse('2026-05-26').success).toBe(true);
  });
  it('accepts empty string', () => {
    expect(optionalDateSchema.safeParse('').success).toBe(true);
  });
  it('accepts undefined', () => {
    expect(optionalDateSchema.safeParse(undefined).success).toBe(true);
  });
  it('rejects a malformed date', () => {
    expect(optionalDateSchema.safeParse('2026/05/26').success).toBe(false);
  });
});

describe('yearMonthSchema (YYYY年MM月)', () => {
  it.each(['2026年5月', '2026年12月', ''])('accepts %s', (v) => {
    expect(yearMonthSchema.safeParse(v).success).toBe(true);
  });
  it.each(['2026-05', '2026年5', '5月'])('rejects %s', (v) => {
    expect(yearMonthSchema.safeParse(v).success).toBe(false);
  });
});

describe('phoneSchema (optional)', () => {
  it.each(['0312345678', '09012345678', ''])('accepts %s', (v) => {
    expect(phoneSchema.safeParse(v).success).toBe(true);
  });
  it.each(['1234567890', '03-1234-5678', '090123456789', '090123'])('rejects %s', (v) => {
    expect(phoneSchema.safeParse(v).success).toBe(false);
  });
});

describe('requiredPhoneSchema', () => {
  it('accepts a valid number', () => {
    expect(requiredPhoneSchema.safeParse('09012345678').success).toBe(true);
  });
  it('rejects empty string', () => {
    expect(requiredPhoneSchema.safeParse('').success).toBe(false);
  });
  it('rejects hyphenated number', () => {
    expect(requiredPhoneSchema.safeParse('090-1234-5678').success).toBe(false);
  });
});

describe('postalCodeSchema (7 digits)', () => {
  it('accepts 1234567', () => {
    expect(postalCodeSchema.safeParse('1234567').success).toBe(true);
  });
  it.each(['123-4567', '123456', '12345678', ''])('rejects %s', (v) => {
    expect(postalCodeSchema.safeParse(v).success).toBe(false);
  });
});

describe('emailSchema / optionalEmailSchema', () => {
  it('accepts a valid email', () => {
    expect(emailSchema.safeParse('a@example.com').success).toBe(true);
  });
  it('rejects an invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });
  it('optional accepts empty string', () => {
    expect(optionalEmailSchema.safeParse('').success).toBe(true);
  });
  it('optional rejects malformed value', () => {
    expect(optionalEmailSchema.safeParse('foo@').success).toBe(false);
  });
});

describe('katakanaSchema', () => {
  const schema = katakanaSchema('氏名カナ');
  it.each(['ヤマダ', 'ヤマダ タロウ', 'ヤマダー'])('accepts %s', (v) => {
    expect(schema.safeParse(v).success).toBe(true);
  });
  it.each(['やまだ', '山田', 'Yamada', ''])('rejects %s', (v) => {
    expect(schema.safeParse(v).success).toBe(false);
  });
  it('includes the field name in the error message', () => {
    const result = schema.safeParse('やまだ');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('氏名カナ');
    }
  });
});

describe('optionalNonnegativeNumber', () => {
  it('coerces empty string to null', () => {
    const r = optionalNonnegativeNumber.safeParse('');
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeNull();
  });
  it('coerces undefined to null', () => {
    const r = optionalNonnegativeNumber.safeParse(undefined);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeNull();
  });
  it('accepts a numeric string and coerces to number', () => {
    const r = optionalNonnegativeNumber.safeParse('1500');
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe(1500);
  });
  it('rejects a negative number', () => {
    expect(optionalNonnegativeNumber.safeParse(-1).success).toBe(false);
  });
});

describe('optionalNonnegativeInt', () => {
  it('accepts an integer', () => {
    const r = optionalNonnegativeInt.safeParse('10');
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe(10);
  });
  it('empty string becomes null', () => {
    const r = optionalNonnegativeInt.safeParse('');
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeNull();
  });
  it('rejects a non-integer', () => {
    expect(optionalNonnegativeInt.safeParse(1.5).success).toBe(false);
  });
  it('rejects a negative integer', () => {
    expect(optionalNonnegativeInt.safeParse(-3).success).toBe(false);
  });
});

describe('uuidSchema', () => {
  it('accepts a valid UUID', () => {
    expect(uuidSchema.safeParse('123e4567-e89b-12d3-a456-426614174000').success).toBe(true);
  });
  it('rejects a non-UUID string', () => {
    expect(uuidSchema.safeParse('not-a-uuid').success).toBe(false);
  });
});
