/**
 * 区画スキーマのユニットテスト
 */
import {
  additionalPlotsFieldSchema,
  buriedPersonsSchema,
  constructionInfoSchema,
  saleContractSchema,
} from '../../validations/plot';

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

describe('buriedPersonsSchema', () => {
  // 合祀カウントダウンの起点日は最終納骨者の埋葬日で決まるため、
  // 複数指定されると起点が一意に決まらない（議事録 2026-07-21 §1）
  it('最終納骨者が1人なら通す', () => {
    const r = buriedPersonsSchema.safeParse([
      { name: '田中一郎', isFinalBurial: false },
      { name: '田中花子', isFinalBurial: true },
    ]);
    expect(r.success).toBe(true);
  });

  it('最終納骨者が2人以上なら弾く', () => {
    const r = buriedPersonsSchema.safeParse([
      { name: '田中一郎', isFinalBurial: true },
      { name: '田中花子', isFinalBurial: true },
    ]);
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('最終納骨者は1人までしか指定できません');
    }
  });

  it('最終納骨者が未指定でも通す（契約日起点にフォールバックする）', () => {
    expect(buriedPersonsSchema.safeParse([{ name: '田中一郎' }]).success).toBe(true);
    expect(buriedPersonsSchema.safeParse([]).success).toBe(true);
  });
});

describe('additionalPlotsFieldSchema', () => {
  const item = {
    physicalPlot: { id: '11111111-1111-4111-8111-111111111111', plotNumber: 'A-10' },
    contractPlot: { contractAreaSqm: 1.8 },
  };
  const extras = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      ...item,
      physicalPlot: { id: `11111111-1111-4111-8111-${String(i).padStart(12, '0')}` },
    }));

  it('accepts undefined and an empty array', () => {
    expect(additionalPlotsFieldSchema.safeParse(undefined).success).toBe(true);
    expect(additionalPlotsFieldSchema.safeParse([]).success).toBe(true);
  });

  it('accepts one extra plot chosen by id', () => {
    expect(additionalPlotsFieldSchema.safeParse([item]).success).toBe(true);
  });

  it('rejects an extra plot without physicalPlot.id', () => {
    const r = additionalPlotsFieldSchema.safeParse([{ ...item, physicalPlot: { plotNumber: 'A-10' } }]);
    expect(r.success).toBe(false);
  });

  it('rejects a zero contract area', () => {
    const r = additionalPlotsFieldSchema.safeParse([{ ...item, contractPlot: { contractAreaSqm: 0 } }]);
    expect(r.success).toBe(false);
  });

  it('accepts 19 extras (20 with the first) and rejects 20 extras', () => {
    expect(additionalPlotsFieldSchema.safeParse(extras(19)).success).toBe(true);
    const r = additionalPlotsFieldSchema.safeParse(extras(20));
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toBe('一度に登録できる区画は20件までです');
  });
});
