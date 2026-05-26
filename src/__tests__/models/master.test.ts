/**
 * MASTER_TYPES の安定性テスト
 *
 * MASTER_TYPES は URL slug (`/api/v1/masters/:masterType`) と
 * AllMastersResponse のキー導出の双方に使われる契約値。
 */
import { MASTER_TYPES } from '../../models/master';

describe('MASTER_TYPES', () => {
  // arrayContaining を使い、既存 slug の rename/削除は検知しつつ、
  // 新規マスタ追加（例: direction/position, issue #147）でテストが壊れないようにする。
  it('contains the core master slugs', () => {
    expect(MASTER_TYPES).toEqual(
      expect.arrayContaining([
        'cemetery-type',
        'payment-method',
        'tax-type',
        'calc-type',
        'billing-type',
        'recipient-type',
        'construction-type',
        'section-name',
        'relationship',
        'contractor',
      ]),
    );
  });

  it('has no duplicate slugs', () => {
    expect(new Set(MASTER_TYPES).size).toBe(MASTER_TYPES.length);
  });

  it('uses kebab-case / lowercase slugs only', () => {
    for (const slug of MASTER_TYPES) {
      expect(slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});
