/**
 * Document / PDF テンプレート関連の共有型・データ定義
 *
 * バック (`komine-crm-backend/src/documents`) と
 * フロント (`komine-crm-frontend/src/lib/api/documents.ts` など) で
 * 同一の型・座標を使うため、ここを単一ソースとする。
 *
 * - PDF 生成（バック）: pdf-lib で座標どおりに描画
 * - プレビュー（フロント）: PNG 背景に同じ座標で入力ボックスを重ねる
 *
 * いずれかを直接いじってバック・フロントが食い違うと、プレビューと
 * 実出力がズレる UI バグになるので必ずこのファイルから読み込むこと。
 */

// ============================================================
// テンプレートタイプ
// ============================================================

export type DocumentTemplateType =
  | 'invoice'
  | 'postcard'
  | 'permit'
  | 'envelope-letter'
  | 'envelope-base'
  | 'payment-guide';

/** 全テンプレートタイプ（順序維持） */
export const DOCUMENT_TEMPLATE_TYPES: readonly DocumentTemplateType[] = [
  'invoice',
  'postcard',
  'permit',
  'envelope-letter',
  'envelope-base',
  'payment-guide',
] as const;

// ============================================================
// 護持費のお知らせ（旧称: 請求書 / invoice）
// ============================================================

/**
 * 護持費のお知らせ（invoice テンプレート）のテンプレートデータ。
 * 黒崎小嶺霊園 管理事務所のフォーマットに沿った構造。
 * 旧「請求書」形式のフィールドは互換のため optional で残している。
 */
export interface InvoiceTemplateData {
  // 護持費のお知らせ用
  customerName: string;
  /** 護持費の更新年数（「◯年分」の◯） */
  yearCount?: number | string;
  /** お支払金額（円、数値） */
  amount?: number;
  /** 次回お預かり日（例: 2026年12月31日） */
  nextNoticeDate?: string;
  /** 季節の挨拶（例: 早春の候 / 盛夏の候 など） */
  seasonGreeting?: string;
  /** 印刷する紙。未指定は A4 */
  paperSize?: 'a4' | 'b5' | 'a5' | 'b4';

  // 旧請求書テンプレート互換フィールド（任意）
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  customerAddress?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
}

// ============================================================
// はがき（postcard）
// ============================================================

export interface PostcardTemplateData {
  recipientName: string;
  recipientAddress: string;
  recipientPostalCode: string;
  senderName: string;
  senderAddress: string;
  senderPostalCode: string;
  message: string;
  date: string;
}

// ============================================================
// 季節の挨拶（時候の挨拶）
// ============================================================

/**
 * 月（1-12）→ 既定の時候の挨拶。フロントのフォームのプレースホルダや、
 * バック側の未入力フォールバックに使う。値はバック・フロントで完全一致させる。
 */
export const SEASON_GREETING_BY_MONTH: Readonly<Record<number, string>> = {
  1: '厳寒の候',
  2: '晩冬の候',
  3: '早春の候',
  4: '春暖の候',
  5: '新緑の候',
  6: '初夏の候',
  7: '盛夏の候',
  8: '残暑の候',
  9: '初秋の候',
  10: '秋涼の候',
  11: '晩秋の候',
  12: '師走の候',
};

/** 月（1-12）から時候の挨拶を返す。範囲外なら ' 時下' を返す。 */
export function getSeasonGreetingByMonth(month: number): string {
  return SEASON_GREETING_BY_MONTH[month] ?? '時下';
}

/** Date から時候の挨拶を返す。 */
export function getDefaultSeasonGreeting(date: Date = new Date()): string {
  return getSeasonGreetingByMonth(date.getMonth() + 1);
}

// ============================================================
// お支払い方法のご案内（payment-guide）
// ============================================================

/**
 * お支払い方法のご案内テンプレートのデータ。
 * 用紙内容は概ね固定だが、銀行情報や代表者名など変わりうる部分は編集可能。
 */
export interface PaymentGuideTemplateData {
  // 支払い方法の本文（通常は固定）
  option1?: string;
  option2?: string;
  notice1?: string;
  notice2?: string;
  notice3?: string;

  // 金融機関 1（信用金庫など）
  bank1Name?: string;
  bank1AccountType?: string;
  bank1AccountNumber?: string;

  // 金融機関 2（ゆうちょ）
  bank2Name?: string;
  bank2Symbol?: string;
  bank2Number?: string;

  // 名義・組織
  orgName?: string;
  orgNameKana?: string;
  repName?: string;
  repNameKana?: string;

  // 署名ブロック
  cemeteryName?: string;
  tel?: string;
  fax?: string;
  /** 印刷する紙。未指定は A4 */
  paperSize?: 'a4' | 'b5' | 'a5' | 'b4';
}

/**
 * 未入力時に使う「お支払い方法のご案内」テンプレートの既定値。
 * 黒崎小嶺霊園の現状の案内内容を反映している。
 */
export const PAYMENT_GUIDE_DEFAULTS: Required<
  Pick<
    PaymentGuideTemplateData,
    | 'option1'
    | 'option2'
    | 'notice1'
    | 'notice2'
    | 'notice3'
    | 'bank1Name'
    | 'bank1AccountType'
    | 'bank1AccountNumber'
    | 'bank2Name'
    | 'bank2Symbol'
    | 'bank2Number'
    | 'orgName'
    | 'orgNameKana'
    | 'repName'
    | 'repNameKana'
    | 'cemeteryName'
    | 'tel'
    | 'fax'
  >
> = {
  option1: '当霊園事務所へご持参下さい。',
  option2: '又は、下記の銀行か郵便局へお振込み下さい。',
  notice1: 'お振込の場合の振込手数料はお客様の負担となりますので、ご了承下さいませ。',
  notice2:
    'お振込みの場合、当園からの領収書は発行されませんので、金融機関の受領書を大切に保管されて下さい。',
  notice3: 'お振込みの際、名義人様のお名前を必ず記載してください。',
  bank1Name: '福岡ひびき信用金庫 町上津役支店',
  bank1AccountType: '普通',
  bank1AccountNumber: '1165176',
  bank2Name: 'ゆうちょ銀行',
  bank2Symbol: '17470',
  bank2Number: '63945001',
  orgName: '長谷寺',
  orgNameKana: 'はせじ',
  repName: '渡辺 祐昭',
  repNameKana: 'わたなべ ゆうしょう',
  cemeteryName: '黒崎小嶺霊園',
  tel: '093-613-3868',
  fax: '093-613-3893',
};

// ============================================================
// 許可証（permit）
// ============================================================

/** mm → PDF points */
export const MM_TO_PT = 72 / 25.4;

/** 長形3号封筒（120mm × 235mm）の PDF サイズ (pt) */
export const ENVELOPE_CHOU3_WIDTH_PT = 120 * MM_TO_PT;
export const ENVELOPE_CHOU3_HEIGHT_PT = 235 * MM_TO_PT;

/** 長形3号・郵便番号枠（日本郵便定形郵便物仕様の目安） */
export const POSTAL_CODE_TOP_MM = 12;
export const POSTAL_CODE_RIGHT_MM = 8;
export const POSTAL_CODE_GROUP_WIDTH_MM = 47.7;
export const POSTAL_CODE_BOX_WIDTH_MM = 5.7;
export const POSTAL_CODE_BOX_HEIGHT_MM = 8;
export const POSTAL_CODE_GROUP_LEFT_MM =
  120 - POSTAL_CODE_RIGHT_MM - POSTAL_CODE_GROUP_WIDTH_MM;
/** 郵便番号枠左端を 0mm とした各桁ボックスの左位置 (mm) */
export const POSTAL_CODE_DIGIT_LEFT_MM: readonly number[] = [
  0, 7.0, 14.0, 21.6, 28.4, 35.2, 42.2,
];

/** 郵便番号文字列から7桁の数字配列を返す（ハイフンは除去） */
export function splitPostalCodeDigits(code: string): string[] {
  const digits = code.replace(/\D/g, '').slice(0, 7);
  return Array.from({ length: 7 }, (_, i) => digits[i] ?? '');
}

function buildEnvelopeChou3PostalDigitField(
  digitIndex: number,
  pageIndex: number
): PermitField {
  const leftMm =
    POSTAL_CODE_GROUP_LEFT_MM + POSTAL_CODE_DIGIT_LEFT_MM[digitIndex];
  const boxWidthPt = POSTAL_CODE_BOX_WIDTH_MM * MM_TO_PT;
  const boxHeightPt = POSTAL_CODE_BOX_HEIGHT_MM * MM_TO_PT;
  const topPt = POSTAL_CODE_TOP_MM * MM_TO_PT;
  const centerXPt = (leftMm + POSTAL_CODE_BOX_WIDTH_MM / 2) * MM_TO_PT;
  const baselineYPt =
    ENVELOPE_CHOU3_HEIGHT_PT - topPt - boxHeightPt * 0.62;

  return {
    id: `recipientPostalDigit${digitIndex + 1}`,
    label: `郵便番号 ${digitIndex + 1}桁目`,
    placeholder: '',
    pageIndex,
    x: centerXPt,
    y: baselineYPt,
    fontSize: 11,
    direction: 'horizontal',
    align: 'center',
    widthPt: boxWidthPt,
    heightPt: boxHeightPt,
    hint: '1',
  };
}

/**
 * 座標系:
 *   - x, y は PDF の points。原点は各ページの左下（pdf-lib と同じ）。
 *   - `direction`:
 *       'horizontal' : 通常の左→右の横書き
 *       'vertical'   : 1文字ずつ縦に積む縦書き（上から下）
 *       'rotated'    : 文字列を -90° 回転（横書きで書いたものを90度左回りに回転）
 *   - align は 'horizontal' / 'rotated' 用: 'left' | 'center' | 'right'
 *   - vertical では anchor は常に top (y から下方向に文字が並ぶ)
 *
 * フロントのプレビューは permit-page-{N}.png を背景にして、同じ座標系を用いて
 * 入力ボックスを重ねる。PDF を 120dpi で PNG 化しているので、ピクセル換算係数は
 * 120/72 = 5/3 ≒ 1.6667。
 */

export type PermitFieldDirection = 'horizontal' | 'vertical' | 'rotated';
export type PermitFieldAlign = 'left' | 'center' | 'right';

export interface PermitField {
  /** テンプレートデータのキー */
  id: string;
  /** UI 表示ラベル */
  label: string;
  /** プレースホルダー・サンプル値 */
  placeholder?: string;
  /** 0 始まりページインデックス（ベースPDF配列のどれに書くか） */
  pageIndex: number;
  /** x 座標 (pt, 左下原点) */
  x: number;
  /** y 座標 (pt, 左下原点)。direction=vertical の場合は 1 文字目の上端 y */
  y: number;
  /** フォントサイズ (pt) */
  fontSize: number;
  /** 太字にするか */
  bold?: boolean;
  direction: PermitFieldDirection;
  /** horizontal / rotated 時の揃え */
  align?: PermitFieldAlign;
  /** vertical 時の行間（文字送り）。未指定ならフォントサイズ * 1.3 */
  lineHeight?: number;
  /** プレビュー表示時の枠幅(pt)。入力欄の大きさ目安 */
  widthPt?: number;
  /** プレビュー表示時の枠高さ(pt)。vertical なら縦方向 */
  heightPt?: number;
  /** 任意：複数行にまたがる補助ライン数（UI表示用） */
  hint?: string;
}

export interface PermitPage {
  pageIndex: number;
  /** ベース PDF ファイル名 (templates/permit/ からの相対) */
  baseFile: string;
  /** プレビュー PNG のパス（/public 以下） */
  previewPng: string;
  /** PDF のページサイズ (pt) */
  widthPt: number;
  heightPt: number;
  /** プレビュー PNG のサイズ (px) */
  previewWidthPx: number;
  previewHeightPx: number;
  /** このページに書き込むフィールド */
  fields: PermitField[];
  /** UI 表示上の名称 */
  label: string;
  /** このページを生成に含めるか（false なら素通し） */
  enabled: boolean;
}

/**
 * 許可証テンプレートに格納するフィールド型。
 * バックの PDF 生成、フロントのフォーム双方で使う。
 */
export interface PermitTemplateData {
  permitNumber?: string;
  permitType?: string;
  plotNumber?: string;
  area?: string;
  /** 西暦年 */
  issueYear?: string;
  issueMonth?: string;
  issueDay?: string;
  applicantName?: string;
  registeredAddress?: string;
  /** 本籍の2列目（○丁目以降） */
  registeredAddress2?: string;
  currentAddress?: string;
  /** 現住所の2列目（○丁目以降） */
  currentAddress2?: string;
  /** 封筒の宛名・住所。許可証と同じ値を使う場合はフロントで自動同期 */
  recipientPostalCode?: string;
  /** 長形3号封筒：郵便番号7桁（各枠に1桁、ハイフンは印字しない） */
  recipientPostalDigit1?: string;
  recipientPostalDigit2?: string;
  recipientPostalDigit3?: string;
  recipientPostalDigit4?: string;
  recipientPostalDigit5?: string;
  recipientPostalDigit6?: string;
  recipientPostalDigit7?: string;
  recipientAddress?: string;
  recipientAddress2?: string;
  recipientName?: string;
  /** 任意：UI操作用の自由メモなど */
  notes?: string;
}

/**
 * 許可証の本籍・現住所を「○丁目」までを1列目、以降を2列目に分割する。
 * 丁目が無い場合は全体を1列目とし、2列目は空。
 */
export function splitPermitAddressAtChome(full: string): {
  line1: string;
  line2: string;
} {
  const trimmed = full.trim();
  if (!trimmed) return { line1: '', line2: '' };

  const match = trimmed.match(/^(.+?[0-9０-９]+丁目)(.*)$/u);
  if (match) {
    return {
      line1: match[1].trim(),
      line2: match[2].trim(),
    };
  }
  return { line1: trimmed, line2: '' };
}

// ====== 許可証ページ定義 ======
// ※ 座標は実機の手書き実物をもとに概ねの位置を仮置きしています。
//   微調整が必要な場合はこのファイルの値をチューニングしてください。

// ページ1: メインの許可証（横向き: 728.4 x 515.76 pt, 横書き）
const PAGE_1_FIELDS: PermitField[] = [
  {
    id: 'permitNumber',
    label: '許可番号（第○号）',
    placeholder: '12345',
    pageIndex: 0,
    x: 450,
    y: 340,
    fontSize: 14,
    bold: true,
    direction: 'horizontal',
    align: 'left',
    widthPt: 85,
    heightPt: 18,
  },
  {
    id: 'permitType',
    label: '種別',
    placeholder: '普通墓地',
    pageIndex: 0,
    x: 450,
    y: 295,
    fontSize: 13,
    direction: 'horizontal',
    align: 'left',
    widthPt: 95,
    heightPt: 18,
  },
  {
    id: 'plotNumber',
    label: '区画番号',
    placeholder: 'A-56、B-12',
    pageIndex: 0,
    x: 450,
    y: 255,
    fontSize: 13,
    direction: 'horizontal',
    align: 'left',
    widthPt: 180,
    heightPt: 18,
  },
  {
    id: 'area',
    label: '面積（㎡）',
    placeholder: '4.5',
    pageIndex: 0,
    x: 450,
    y: 210,
    fontSize: 13,
    direction: 'horizontal',
    align: 'left',
    widthPt: 95,
    heightPt: 18,
  },
  {
    id: 'issueYear',
    label: '発行 年',
    placeholder: '2026',
    pageIndex: 0,
    // 画面のプレビューで、元の位置より約21px右。月・日より年だけさらに5px右。1pt がほぼ1px。
    x: 411,
    y: 145,
    fontSize: 12,
    direction: 'horizontal',
    align: 'center',
    widthPt: 50,
    heightPt: 16,
  },
  {
    id: 'issueMonth',
    label: '発行 月',
    placeholder: '4',
    pageIndex: 0,
    x: 466,
    y: 145,
    fontSize: 12,
    direction: 'horizontal',
    align: 'center',
    widthPt: 30,
    heightPt: 16,
  },
  {
    id: 'issueDay',
    label: '発行 日',
    placeholder: '23',
    pageIndex: 0,
    x: 516,
    y: 145,
    fontSize: 12,
    direction: 'horizontal',
    align: 'center',
    widthPt: 30,
    heightPt: 16,
  },
  {
    id: 'applicantName',
    label: '使用者名（殿）',
    placeholder: '丸山 千代美',
    pageIndex: 0,
    x: 155,
    y: 325,
    fontSize: 16,
    bold: true,
    direction: 'horizontal',
    align: 'left',
    widthPt: 180,
    heightPt: 22,
  },
  {
    id: 'registeredAddress',
    label: '本籍（1列目）',
    placeholder: '福岡県北九州市八幡西区小峰1丁目',
    pageIndex: 0,
    x: 140,
    y: 298,
    fontSize: 12,
    direction: 'horizontal',
    align: 'left',
    widthPt: 150,
    heightPt: 18,
  },
  {
    id: 'registeredAddress2',
    label: '本籍（2列目）',
    placeholder: '2番3号',
    pageIndex: 0,
    x: 145,
    y: 270,
    fontSize: 12,
    direction: 'horizontal',
    align: 'left',
    widthPt: 120,
    heightPt: 18,
  },
  {
    id: 'currentAddress',
    label: '現住所（1列目）',
    placeholder: '福岡県北九州市八幡西区小峰1丁目',
    pageIndex: 0,
    x: 140,
    y: 235,
    fontSize: 12,
    direction: 'horizontal',
    align: 'left',
    widthPt: 150,
    heightPt: 18,
  },
  {
    id: 'currentAddress2',
    label: '現住所（2列目）',
    placeholder: '2番3号',
    pageIndex: 0,
    x: 145,
    y: 210,
    fontSize: 12,
    direction: 'horizontal',
    align: 'left',
    widthPt: 120,
    heightPt: 18,
  },
];

// ページ2: 封筒表（長形3号・郵便番号・宛先用）
const PAGE_2_POSTAL_DIGIT_FIELDS: PermitField[] = Array.from(
  { length: 7 },
  (_, i) => buildEnvelopeChou3PostalDigitField(i, 1)
);

const PAGE_2_FIELDS: PermitField[] = [
  ...PAGE_2_POSTAL_DIGIT_FIELDS,
  {
    id: 'recipientAddress',
    label: '宛先住所',
    placeholder: '見本県見本市見本区',
    pageIndex: 1,
    // 郵便番号枠の下、右側の縦書き。x は列の中心、y は1文字目の上端。
    x: 300,
    y: 590,
    fontSize: 14,
    direction: 'vertical',
    lineHeight: 20,
    widthPt: 24,
    heightPt: 340,
  },
  {
    id: 'recipientAddress2',
    label: '宛先住所（2列目）',
    placeholder: '見本1丁目2番3号',
    pageIndex: 1,
    x: 268,
    y: 570,
    fontSize: 14,
    direction: 'vertical',
    lineHeight: 20,
    widthPt: 24,
    heightPt: 320,
  },
  {
    id: 'recipientName',
    label: '宛名',
    placeholder: 'コミネ太郎 様',
    pageIndex: 1,
    x: 170,
    y: 500,
    fontSize: 22,
    bold: true,
    direction: 'vertical',
    lineHeight: 32,
    widthPt: 36,
    heightPt: 280,
  },
];

/**
 * 封筒大の郵便番号枠。台紙画像（1214×1720px）の黒い枠を測った位置。
 * 3桁、空き、4桁。各枠は約46×64px。
 */
const ENVELOPE_BASE_POSTAL_LEFT_PX = [729, 779, 829, 884, 934, 984, 1034] as const;
const ENVELOPE_BASE_POSTAL_TOP_PX = 57;
const ENVELOPE_BASE_POSTAL_BOX_W_PX = 46;
const ENVELOPE_BASE_POSTAL_BOX_H_PX = 64;
const ENVELOPE_BASE_PX_TO_X = 728.4 / 1214;
const ENVELOPE_BASE_PX_TO_Y = 1031.76 / 1720;

function buildEnvelopeBasePostalDigitField(digitIndex: number): PermitField {
  const leftPx = ENVELOPE_BASE_POSTAL_LEFT_PX[digitIndex] ?? 0;
  const widthPt = ENVELOPE_BASE_POSTAL_BOX_W_PX * ENVELOPE_BASE_PX_TO_X;
  const heightPt = ENVELOPE_BASE_POSTAL_BOX_H_PX * ENVELOPE_BASE_PX_TO_Y;
  const centerXPt = (leftPx + ENVELOPE_BASE_POSTAL_BOX_W_PX / 2) * ENVELOPE_BASE_PX_TO_X;
  const topPt = ENVELOPE_BASE_POSTAL_TOP_PX * ENVELOPE_BASE_PX_TO_Y;
  const boxCenterY = 1031.76 - topPt - heightPt / 2;

  return {
    id: `recipientPostalDigit${digitIndex + 1}`,
    label: `郵便番号 ${digitIndex + 1}桁目`,
    placeholder: '',
    pageIndex: 3,
    x: centerXPt,
    y: boxCenterY - 16 * 0.35,
    fontSize: 16,
    direction: 'horizontal',
    align: 'center',
    widthPt,
    heightPt,
    hint: '1',
  };
}

// ページ4: 大型封筒の表。郵便番号は枠の中、住所は右側の縦書き、名前は中央の縦書き。
const PAGE_4_FIELDS: PermitField[] = [
  ...Array.from({ length: 7 }, (_, i) => buildEnvelopeBasePostalDigitField(i)),
  {
    id: 'recipientAddress',
    label: '宛先住所',
    placeholder: '見本県見本市見本区',
    pageIndex: 3,
    x: 620,
    y: 930,
    fontSize: 16,
    direction: 'vertical',
    lineHeight: 24,
    widthPt: 28,
    heightPt: 420,
  },
  {
    id: 'recipientAddress2',
    label: '宛先住所（2列目）',
    placeholder: '見本1丁目2番3号',
    pageIndex: 3,
    x: 570,
    y: 900,
    fontSize: 16,
    direction: 'vertical',
    lineHeight: 24,
    widthPt: 28,
    heightPt: 400,
  },
  {
    id: 'recipientName',
    label: '宛名',
    placeholder: 'コミネ太郎 様',
    pageIndex: 3,
    x: 360,
    y: 820,
    fontSize: 28,
    bold: true,
    direction: 'vertical',
    lineHeight: 40,
    widthPt: 44,
    heightPt: 320,
  },
];

// --- ページ単位の定義（許可証 / 封筒書 / 封筒大 で再利用） ---

const CERTIFICATE_PAGE: PermitPage = {
  pageIndex: 0,
  label: '許可証書（横向き）',
  baseFile: 'permit-base-1.pdf',
  previewPng: '/permit-templates/permit-page-1.png',
  widthPt: 728.4,
  heightPt: 515.76,
  previewWidthPx: 1214,
  previewHeightPx: 860,
  fields: PAGE_1_FIELDS,
  enabled: true,
};

const ENVELOPE_LETTER_FRONT_PAGE: PermitPage = {
  pageIndex: 1,
  label: '封筒表（長形3号）',
  baseFile: 'permit-base-2.pdf',
  previewPng: '/permit-templates/envelope-chou3-front.png',
  widthPt: ENVELOPE_CHOU3_WIDTH_PT,
  heightPt: ENVELOPE_CHOU3_HEIGHT_PT,
  previewWidthPx: 480,
  previewHeightPx: 940,
  fields: PAGE_2_FIELDS,
  enabled: true,
};

const ENVELOPE_BASE_FRONT_PAGE: PermitPage = {
  pageIndex: 3,
  label: '大型封筒（表）',
  baseFile: 'permit-base-4.pdf',
  previewPng: '/permit-templates/permit-page-4.png',
  widthPt: 728.4,
  heightPt: 1031.76,
  previewWidthPx: 1214,
  previewHeightPx: 1720,
  fields: PAGE_4_FIELDS,
  enabled: true,
};

const ENVELOPE_BASE_BACK_PAGE: PermitPage = {
  pageIndex: 4,
  label: '大型封筒（裏）',
  baseFile: 'permit-base-5.pdf',
  previewPng: '/permit-templates/permit-page-5.png',
  widthPt: 1031.76,
  heightPt: 728.4,
  previewWidthPx: 1720,
  previewHeightPx: 1214,
  fields: [],
  enabled: true,
};

/** 許可証（永代使用許可証書・1枚） */
export const PERMIT_CERTIFICATE_PAGES: readonly PermitPage[] = [CERTIFICATE_PAGE];

/** 封筒書（送付用封筒・表面のみ） */
export const ENVELOPE_LETTER_PAGES: readonly PermitPage[] = [ENVELOPE_LETTER_FRONT_PAGE];

/** 封筒大（大型封筒・1枚） */
export const ENVELOPE_BASE_PAGES: readonly PermitPage[] = [ENVELOPE_BASE_FRONT_PAGE];

/**
 * 後方互換: 旧 5 ページ一括定義（許可証書 + 封筒書 + 封筒大）。
 * 新規コードは用途別に PERMIT_CERTIFICATE_PAGES / ENVELOPE_LETTER_PAGES /
 * ENVELOPE_BASE_PAGES を使うこと。
 */
export const PERMIT_PAGES: PermitPage[] = [
  CERTIFICATE_PAGE,
  ENVELOPE_LETTER_FRONT_PAGE,
  ENVELOPE_BASE_FRONT_PAGE,
  ENVELOPE_BASE_BACK_PAGE,
];

/** ページインデックスをキーにしたレイアウトの辞書（フロントの旧API互換用） */
export const PERMIT_PAGE_LAYOUTS: Readonly<Record<number, PermitPage>> = Object.freeze(
  PERMIT_PAGES.reduce<Record<number, PermitPage>>((acc, p) => {
    acc[p.pageIndex] = p;
    return acc;
  }, {})
);

// ============================================================
// PDF 生成 API リクエスト型
// ============================================================

/** 全テンプレートデータを束ねた union */
export type PdfTemplateData =
  | InvoiceTemplateData
  | PostcardTemplateData
  | PermitTemplateData
  | PaymentGuideTemplateData;

/** POST /api/v1/documents/generate-pdf のリクエストボディ */
export interface GeneratePdfRequest {
  templateType: DocumentTemplateType;
  templateData: PdfTemplateData;
  documentId?: string;
  name?: string;
  contractPlotId?: string;
  customerId?: string;
  /** 許可証を厚紙へ重ね刷りするとき、台紙の絵を省いて文字だけ出す */
  textOnly?: boolean;
}

// ============================================================
// 請求書（護持費のお知らせ）の一括印刷
// ============================================================

/** HTML テンプレートの書体プリセット（テンプレート側の `body.doc-preset-*` と対応） */
export type DocumentTextStylePreset = 'default' | 'mincho' | 'gothic_large' | 'compact';

export const DOCUMENT_TEXT_STYLE_PRESETS: readonly DocumentTextStylePreset[] = [
  'default',
  'mincho',
  'gothic_large',
  'compact',
];

/**
 * 一括印刷の既定対象となる請求年数。
 *
 * 年払い（1）と永代・請求なし（0）は対象外。議事録 7 章の
 * 「年払い以外の契約者（十年一回または五年一回払い）」に対応する。
 */
export const BULK_INVOICE_DEFAULT_BILLING_YEARS: readonly number[] = [5, 10];

/** 一括印刷の既定請求月（3月の繁忙期に一括送付する運用） */
export const BULK_INVOICE_DEFAULT_MONTH = 3;

/** 一括印刷の対象 1 件 */
export interface BulkInvoiceTarget {
  contractPlotId: string;
  customerId: string | null;
  customerName: string;
  customerNameKana: string | null;
  areaName: string | null;
  plotNumber: string | null;
  displayNumber: string | null;
  /** 請求年数（5 = 五年一回、10 = 十年一回） */
  billingYears: number;
  /** 請求月（1〜12）。不明なら null */
  billingMonth: number | null;
  /** 最終請求月 `"2021-03"`。未請求なら null */
  lastBillingMonth: string | null;
  /** 今回の請求対象年（= 最終請求月の年 + 請求年数） */
  targetYear: number;
  /** 請求金額（円） */
  amount: number;
  /** 次回のお預かり（例: `"2032年3月"`） */
  nextNoticeDate: string;
  /** 指定年より前に請求されるべきだった（請求漏れの疑い） */
  overdue: boolean;
}

/** GET /api/v1/documents/bulk-invoice/targets のクエリ */
export interface BulkInvoiceTargetsQuery {
  /** 請求対象年（例: 2027） */
  year: number;
  /** 請求月。既定は `BULK_INVOICE_DEFAULT_MONTH` */
  month?: number;
  /** 対象とする請求年数。既定は `BULK_INVOICE_DEFAULT_BILLING_YEARS` */
  billingYears?: number[];
  /** 指定年より前の請求漏れも含める（既定 true） */
  includeOverdue?: boolean;
}

export interface BulkInvoiceTargetsResponse {
  targets: BulkInvoiceTarget[];
  /** 対象件数 */
  total: number;
  /** 対象金額の合計（円） */
  totalAmount: number;
}

/** POST /api/v1/documents/bulk-invoice/generate のリクエストボディ */
export interface GenerateBulkInvoiceRequest extends BulkInvoiceTargetsQuery {
  /** 印刷する区画を絞り込む。未指定なら対象全件 */
  contractPlotIds?: string[];
  textStylePreset?: DocumentTextStylePreset;
}

export interface GenerateBulkInvoiceResponse {
  /** 全件を 1 ファイルに結合した PDF（base64） */
  pdf: string;
  mimeType: 'application/pdf';
  fileName: string;
  fileSize: number;
  /** 結合した請求書の枚数 */
  count: number;
}

/** ファイル名から OS 上で問題のある文字を除去する共通サニタイザ */
export function sanitizeDocumentFileName(rawName: string | null | undefined): string {
  const safe = (rawName ?? '').replace(/[/\\?%*:|"<>]/g, '_').trim();
  const baseName = safe || 'document';
  return baseName.toLowerCase().endsWith('.pdf') ? baseName : `${baseName}.pdf`;
}
