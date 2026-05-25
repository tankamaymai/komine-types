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
  currentAddress?: string;
  /** 封筒の宛名・住所。許可証と同じ値を使う場合はフロントで自動同期 */
  recipientPostalCode?: string;
  recipientAddress?: string;
  recipientAddress2?: string;
  recipientName?: string;
  /** 任意：UI操作用の自由メモなど */
  notes?: string;
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
    x: 530,
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
    x: 520,
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
    placeholder: 'A-56',
    pageIndex: 0,
    x: 530,
    y: 248,
    fontSize: 13,
    direction: 'horizontal',
    align: 'left',
    widthPt: 85,
    heightPt: 18,
  },
  {
    id: 'area',
    label: '面積（㎡）',
    placeholder: '4.5',
    pageIndex: 0,
    x: 525,
    y: 198,
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
    x: 450,
    y: 155,
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
    x: 530,
    y: 155,
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
    x: 590,
    y: 155,
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
    x: 180,
    y: 345,
    fontSize: 16,
    bold: true,
    direction: 'horizontal',
    align: 'left',
    widthPt: 180,
    heightPt: 22,
  },
  {
    id: 'registeredAddress',
    label: '本籍',
    placeholder: '福岡県北九州市八幡西区小嶺',
    pageIndex: 0,
    x: 140,
    y: 298,
    fontSize: 12,
    direction: 'horizontal',
    align: 'left',
    widthPt: 230,
    heightPt: 18,
  },
  {
    id: 'currentAddress',
    label: '現住所',
    placeholder: '福岡県北九州市八幡西区…',
    pageIndex: 0,
    x: 140,
    y: 248,
    fontSize: 12,
    direction: 'horizontal',
    align: 'left',
    widthPt: 230,
    heightPt: 18,
  },
];

// ページ2: 封筒表（郵便番号・宛先用）
const PAGE_2_FIELDS: PermitField[] = [
  {
    id: 'recipientPostalCode',
    label: '郵便番号',
    placeholder: '807-0081',
    pageIndex: 1,
    x: 230,
    y: 605,
    fontSize: 18,
    direction: 'horizontal',
    align: 'left',
    widthPt: 180,
    heightPt: 24,
  },
  {
    id: 'recipientAddress',
    label: '宛先住所',
    placeholder: '福岡県北九州市八幡西区…',
    pageIndex: 1,
    x: 130,
    y: 480,
    fontSize: 16,
    direction: 'horizontal',
    align: 'left',
    widthPt: 300,
    heightPt: 24,
  },
  {
    id: 'recipientAddress2',
    label: '宛先住所（2行目）',
    placeholder: '',
    pageIndex: 1,
    x: 150,
    y: 445,
    fontSize: 16,
    direction: 'horizontal',
    align: 'left',
    widthPt: 280,
    heightPt: 24,
  },
  {
    id: 'recipientName',
    label: '宛名',
    placeholder: '丸山 千代美 様',
    pageIndex: 1,
    x: 150,
    y: 380,
    fontSize: 22,
    bold: true,
    direction: 'horizontal',
    align: 'left',
    widthPt: 280,
    heightPt: 30,
  },
];

// ページ4: 大型封筒の表（郵便番号あり）
const PAGE_4_FIELDS: PermitField[] = [
  {
    id: 'recipientPostalCode',
    label: '郵便番号',
    placeholder: '807-0081',
    pageIndex: 3,
    x: 530,
    y: 950,
    fontSize: 20,
    direction: 'horizontal',
    align: 'left',
    widthPt: 180,
    heightPt: 26,
  },
  {
    id: 'recipientAddress',
    label: '宛先住所',
    placeholder: '福岡県北九州市八幡西区…',
    pageIndex: 3,
    x: 120,
    y: 820,
    fontSize: 18,
    direction: 'horizontal',
    align: 'left',
    widthPt: 500,
    heightPt: 28,
  },
  {
    id: 'recipientAddress2',
    label: '宛先住所（2行目）',
    placeholder: '',
    pageIndex: 3,
    x: 140,
    y: 780,
    fontSize: 18,
    direction: 'horizontal',
    align: 'left',
    widthPt: 480,
    heightPt: 28,
  },
  {
    id: 'recipientName',
    label: '宛名',
    placeholder: '丸山 千代美 様',
    pageIndex: 3,
    x: 180,
    y: 700,
    fontSize: 26,
    bold: true,
    direction: 'horizontal',
    align: 'left',
    widthPt: 460,
    heightPt: 36,
  },
];

// --- ページ単位の定義（許可証 / 封筒書 / 封筒台 で再利用） ---

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
  label: '封筒表',
  baseFile: 'permit-base-2.pdf',
  previewPng: '/permit-templates/permit-page-2.png',
  widthPt: 515.76,
  heightPt: 728.4,
  previewWidthPx: 860,
  previewHeightPx: 1214,
  fields: PAGE_2_FIELDS,
  enabled: true,
};

const ENVELOPE_LETTER_BACK_PAGE: PermitPage = {
  pageIndex: 2,
  label: '封筒裏',
  baseFile: 'permit-base-3.pdf',
  previewPng: '/permit-templates/permit-page-3.png',
  widthPt: 515.76,
  heightPt: 728.4,
  previewWidthPx: 860,
  previewHeightPx: 1214,
  fields: [],
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

/** 封筒書（送付用封筒・表面/裏面の2枚） */
export const ENVELOPE_LETTER_PAGES: readonly PermitPage[] = [
  ENVELOPE_LETTER_FRONT_PAGE,
  ENVELOPE_LETTER_BACK_PAGE,
];

/** 封筒台（大型封筒・1枚） */
export const ENVELOPE_BASE_PAGES: readonly PermitPage[] = [ENVELOPE_BASE_FRONT_PAGE];

/**
 * 後方互換: 旧 5 ページ一括定義（許可証書 + 封筒書 + 封筒台）。
 * 新規コードは用途別に PERMIT_CERTIFICATE_PAGES / ENVELOPE_LETTER_PAGES /
 * ENVELOPE_BASE_PAGES を使うこと。
 */
export const PERMIT_PAGES: PermitPage[] = [
  CERTIFICATE_PAGE,
  ENVELOPE_LETTER_FRONT_PAGE,
  ENVELOPE_LETTER_BACK_PAGE,
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
}

/** ファイル名から OS 上で問題のある文字を除去する共通サニタイザ */
export function sanitizeDocumentFileName(rawName: string | null | undefined): string {
  const safe = (rawName ?? '').replace(/[/\\?%*:|"<>]/g, '_').trim();
  const baseName = safe || 'document';
  return baseName.toLowerCase().endsWith('.pdf') ? baseName : `${baseName}.pdf`;
}
