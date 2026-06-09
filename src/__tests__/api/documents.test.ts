import { splitPermitAddressAtChome, splitPostalCodeDigits } from '../../api/documents';

describe('splitPermitAddressAtChome', () => {
  it('○丁目までを1列目、以降を2列目に分割する', () => {
    expect(
      splitPermitAddressAtChome(
        '福岡県北九州市八幡西区小峰1丁目2番3号 マンション101'
      )
    ).toEqual({
      line1: '福岡県北九州市八幡西区小峰1丁目',
      line2: '2番3号 マンション101',
    });
  });

  it('丁目が無い場合は全体を1列目にする', () => {
    expect(
      splitPermitAddressAtChome('福岡県北九州市八幡西区小嶺台1-2-3')
    ).toEqual({
      line1: '福岡県北九州市八幡西区小嶺台1-2-3',
      line2: '',
    });
  });

  it('空文字は両方空を返す', () => {
    expect(splitPermitAddressAtChome('')).toEqual({ line1: '', line2: '' });
  });
});

describe('splitPostalCodeDigits', () => {
  it('ハイフン付き郵便番号を7桁に分割する', () => {
    expect(splitPostalCodeDigits('807-0081')).toEqual([
      '8', '0', '7', '0', '0', '8', '1',
    ]);
  });

  it('7桁未満は空文字で埋める', () => {
    expect(splitPostalCodeDigits('123')).toEqual([
      '1', '2', '3', '', '', '', '',
    ]);
  });
});
