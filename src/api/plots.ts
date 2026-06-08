/**
 * Plot API types - Request/Response types for /api/v1/plots
 */

import { PaginationMeta, SearchParams } from './common';
import {
  PhysicalPlotStatus,
  PaymentStatus,
  ContractStatus,
  ContractRole,
  Gender,
  AddressType,
  DmSetting,
  BillingRecordStatus,
} from '../enums';

/**
 * 区画一覧の請求状況サマリ (B10)
 *
 * 旧画面01 の「受付済 / 09年 / 10年 …」の年度別請求 status を、一覧テーブルでは
 * 1 列に集約して表示するためのサマリ。集計対象は管理料 (BillingCategory.management_fee)
 * の Billing で、年度横断で「最新年度の status」と「未納年数」をまとめる。
 *
 * NOTE: 「未納」の定義 = 請求済だが完納していない status（billed / partial_paid / overdue）。
 * pending（請求前）と paid / terminated / written_off は未納に含めない。
 * 業務確認後に定義が変わる可能性あり（D カテゴリ）。
 */
export interface PlotBillingSummary {
  /** 集計対象の管理料 Billing が 1 件でも存在するか */
  hasBilling: boolean;
  /** 最新（最も新しい対象年度）の管理料 Billing の年度。無ければ null */
  latestYear: number | null;
  /** 最新年度 Billing の status。無ければ null */
  latestYearStatus: BillingRecordStatus | null;
  /** 未納（billed / partial_paid / overdue）の管理料 Billing 件数 */
  unpaidYearCount: number;
}

/**
 * Plot list item (GET /plots response item)
 * This is a flattened view for list display
 */
export interface PlotListItem {
  id: string;
  contractAreaSqm: number;
  locationDescription: string | null;

  // Physical plot info (flattened)
  plotNumber: string;
  areaName: string;
  physicalPlotAreaSqm: number;
  physicalPlotStatus: PhysicalPlotStatus;

  // Sale contract info
  contractDate: string | null;  // レガシー実態に合わせて nullable
  price: number | null;          // レガシー実態に合わせて nullable
  paymentStatus: PaymentStatus;

  // Primary customer (backward compatibility)
  customerName: string | null;
  customerNameKana: string | null;
  customerPhoneNumber: string | null;
  customerAddress: string | null;
  customerRole: ContractRole | null;

  // All roles (new approach)
  roles: Array<{
    role: ContractRole;
    customer: {
      id: string;
      name: string;
    };
  }>;

  // Notes
  contractNotes: string | null;
  customerNotes: string | null;

  // 碑文（注意書きの一言・一覧表示用）
  inscription: string | null;

  // Buried person names (for list display)
  buriedPersonNames: string[];

  // Agent/dealer name
  agentName: string | null;

  // Permit info
  permitNumber: string | null;

  // Billing info
  nextBillingDate: string | null;
  managementFee: string | null;
  /** サーバ導出値: active 請求の (請求額−入金額)。手入力不可・読み取り専用（#170）。 */
  uncollectedAmount: number;

  // 請求状況サマリ (B10: 年度別請求 status の集約列)
  billingSummary: PlotBillingSummary;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Plot list response
 */
export interface PlotListResponse {
  data: PlotListItem[];
  pagination: PaginationMeta;
}

/**
 * Plot list search parameters
 */
export interface PlotSearchParams extends SearchParams {
  areaName?: string;
  status?: PhysicalPlotStatus;
  paymentStatus?: PaymentStatus;
  // 区画区分（レガシー由来 tinyint、master 化されるまでは raw 値）
  graveKind?: number;
  graveKubun?: number;
  graveType?: number;
}

/**
 * Distinct grave classification values
 * (GET /plots/grave-classifications)
 */
export interface GraveClassificationsResponse {
  graveKinds: number[];
  graveKubuns: number[];
  graveTypes: number[];
}

/**
 * Plot detail response (GET /plots/:id)
 */
export interface PlotDetailResponse {
  id: string;
  contractAreaSqm: number;
  locationDescription: string | null;
  createdAt: string;
  updatedAt: string;

  // Physical plot
  physicalPlot: {
    id: string;
    plotNumber: string;
    areaName: string;
    areaSqm: number;
    status: PhysicalPlotStatus;
    mapId: number | null;
    notes: string | null;
  };

  // Sale contract info
  contractDate: string | null;
  price: number | null;
  contractStatus: ContractStatus;
  paymentStatus: PaymentStatus;
  reservationDate: string | null;
  requestDate: string | null;       // 申込日（レガシー request_date）
  acceptanceNumber: string | null;
  acceptanceDate: string | null;
  staffInCharge: string | null;
  permitDate: string | null;
  permitNumber: string | null;
  startDate: string | null;
  /** サーバ導出値: active 請求の (請求額−入金額)。手入力不可・読み取り専用（#170）。 */
  uncollectedAmount: number;
  contractNotes: string | null;
  /** 碑文（注意書きの一言）。墓誌(gravestoneInscription)とは別物。 */
  inscription: string | null;
  agentName: string | null;

  // レガシー由来の区分コード
  graveKind: number | null;
  graveKubun: number | null;
  graveType: number | null;
  legacyGraveCd: number | null;

  // Usage fee
  usageFee: {
    calculationType: string | null;
    taxType: string | null;
    billingType: string | null;
    billingYears: string | null;
    usageFee: string | null;
    area: string | null;
    unitPrice: string | null;
    paymentMethod: string | null;
  } | null;

  // Management fee
  managementFee: {
    calculationType: string | null;
    taxType: string | null;
    billingType: string | null;
    billingYears: string | null;
    area: string | null;
    billingMonth: string | null;
    managementFee: string | null;
    unitPrice: string | null;
    lastBillingMonth: string | null;
    paymentMethod: string | null;
  } | null;

  // Buried persons
  buriedPersons: Array<{
    id: string;
    name: string;
    nameKana: string | null;
    relationship: string | null;
    birthDate: string | null;
    deathDate: string | null;
    age: number | null;
    gender: Gender | null;
    burialDate: string | null;
    posthumousName: string | null;
    reportDate: string | null;
    religion: string | null;
    deathPlace: string | null;
    causeOfDeath: string | null;
    chiefMournerName: string | null;
    chiefMournerRelationship: string | null;
    notes: string | null;
  }>;

  // Family contacts
  familyContacts: Array<{
    id: string;
    name: string;
    nameKana: string | null;
    birthDate: string | null;
    relationship: string;
    postalCode: string | null;
    address: string | null;
    phoneNumber: string | null;
    phoneNumber2: string | null;
    faxNumber: string | null;
    email: string | null;
    registeredAddress: string | null;
    mailingType: AddressType | null;
    workCompanyName: string | null;
    workCompanyNameKana: string | null;
    workAddress: string | null;
    workPhoneNumber: string | null;
    contactMethod: string | null;
    notes: string | null;
  }>;

  // Gravestone info
  gravestoneInfo: {
    gravestoneBase: string | null;
    enclosurePosition: string | null;
    gravestoneDealer: string | null;
    gravestoneType: string | null;
    surroundingArea: string | null;
    gravestoneCost: number | null;
    establishmentDeadline: string | null;
    establishmentDate: string | null;
    gravestoneInscription: string | null;
    directionId: number | null;
    positionId: number | null;
  } | null;

  // Construction infos
  constructionInfos: Array<{
    id: string;
    constructionType: string | null;
    startDate: string | null;
    completionDate: string | null;
    contractor: string | null;
    supervisor: string | null;
    progress: string | null;
    workItem1: string | null;
    workDate1: string | null;
    workAmount1: number | null;
    workStatus1: string | null;
    workItem2: string | null;
    workDate2: string | null;
    workAmount2: number | null;
    workStatus2: string | null;
    permitNumber: string | null;
    applicationDate: string | null;
    permitDate: string | null;
    permitStatus: string | null;
    paymentType1: string | null;
    paymentAmount1: number | null;
    paymentDate1: string | null;
    paymentStatus1: string | null;
    paymentType2: string | null;
    paymentAmount2: number | null;
    paymentScheduledDate2: string | null;
    paymentStatus2: string | null;
    scheduledEndDate: string | null;
    constructionContent: string | null;
    notes: string | null;
  }>;

  // Collective burial
  collectiveBurial: {
    id: string;
    burialCapacity: number;
    currentBurialCount: number;
    capacityReachedDate: string | null;
    validityPeriodYears: number;
    billingScheduledDate: string | null;
    billingStatus: string;
    billingAmount: number | null;
    notes: string | null;
  } | null;

  // All roles and customers
  roles: Array<{
    id: string;
    role: ContractRole;
    roleStartDate: string | null;
    roleEndDate: string | null;
    notes: string | null;
    customer: {
      id: string;
      name: string;
      nameKana: string | null;
      gender: Gender | null;
      birthDate: string | null;
      phoneNumber: string | null;
      faxNumber: string | null;
      email: string | null;
      postalCode: string | null;
      address: string | null;
      addressLine2: string | null;
      registeredPostalCode: string | null;
      registeredAddress: string | null;
      // 振込先情報（ゆうちょ自動払込 CSV 出力用、レガシー t_danka.kikan_name 系から移行）
      bankName: string | null;
      branchName: string | null;
      accountType: string | null;
      accountNumber: string | null;
      accountHolder: string | null;
      notes: string | null;
      staffId: number | null;
      legacyDankaCd: number | null;
      workInfo: {
        companyName: string | null;
        companyNameKana: string | null;
        workPostalCode: string | null;
        workAddress: string | null;
        workPhoneNumber: string | null;
        dmSetting: DmSetting | null;
        addressType: AddressType | null;
        notes: string | null;
      } | null;
    };
  }>;

  // Optional: Histories
  histories?: Array<{
    id: string;
    actionType: string;
    changedFields: string[] | null;
    changedBy: string | null;
    changeReason: string | null;
    createdAt: string;
  }>;
}

/**
 * Create plot request body (POST /plots)
 */
export interface CreatePlotRequest {
  physicalPlot: {
    id?: string;
    plotNumber: string;
    areaName: string;
    areaSqm?: number;
    mapId?: number | null;
    notes?: string | null;
  };

  contractPlot: {
    contractAreaSqm: number;
    locationDescription?: string | null;
    inscription?: string | null;
  };

  saleContract: {
    contractDate?: string | null;
    price?: number | null;
    paymentStatus?: PaymentStatus;
    customerRole?: string;
    reservationDate?: string | null;
    requestDate?: string | null;
    acceptanceNumber?: string | null;
    acceptanceDate?: string | null;
    staffInCharge?: string | null;
    permitDate?: string | null;
    permitNumber?: string | null;
    startDate?: string | null;
    /** @deprecated 手入力廃止（#170）。送信しても無視され、サーバが請求実績から導出した値で上書きされる。 */
    uncollectedAmount?: number | null;
    agentName?: string | null;
    notes?: string | null;
    graveKind?: number | null;
    graveKubun?: number | null;
    graveType?: number | null;
    legacyGraveCd?: number | null;
    roles?: Array<{
      customerId?: string;
      role: ContractRole;
      roleStartDate?: string | null;
      roleEndDate?: string | null;
      notes?: string | null;
    }>;
  };

  customer: {
    name: string;
    nameKana: string;
    birthDate?: string | null;
    gender?: Gender | null;
    postalCode: string;
    address: string;
    addressLine2?: string | null;
    registeredPostalCode?: string | null;
    registeredAddress?: string | null;
    phoneNumber: string | null;
    faxNumber?: string | null;
    email?: string | null;
    bankName?: string | null;
    branchName?: string | null;
    accountType?: string | null;
    accountNumber?: string | null;
    accountHolder?: string | null;
    notes?: string | null;
    staffId?: number | null;
    legacyDankaCd?: number | null;
    role?: ContractRole;
  };

  // 申込者（任意）。指定時は別 Customer + SaleContractRole(role=applicant) として作成される
  applicant?: {
    name: string;
    nameKana: string;
    birthDate?: string | null;
    gender?: Gender | null;
    postalCode?: string | null;
    address?: string | null;
    addressLine2?: string | null;
    registeredPostalCode?: string | null;
    registeredAddress?: string | null;
    phoneNumber?: string | null;
    faxNumber?: string | null;
    email?: string | null;
    notes?: string | null;
    staffId?: number | null;
    legacyDankaCd?: number | null;
  } | null;

  workInfo?: {
    companyName: string;
    companyNameKana: string;
    workAddress: string;
    workPostalCode: string;
    workPhoneNumber: string;
    dmSetting?: DmSetting;
    addressType?: AddressType;
    notes?: string | null;
  };

  usageFee?: {
    calculationType?: string | null;
    taxType?: string | null;
    billingType?: string | null;
    billingYears?: string | null;
    usageFee?: string | null;
    area?: string | null;
    unitPrice?: string | null;
    paymentMethod?: string | null;
  };

  managementFee?: {
    calculationType?: string | null;
    taxType?: string | null;
    billingType?: string | null;
    billingYears?: string | null;
    area?: string | null;
    billingMonth?: string | null;
    managementFee?: string | null;
    unitPrice?: string | null;
    lastBillingMonth?: string | null;
    paymentMethod?: string | null;
  };

  gravestoneInfo?: {
    gravestoneBase?: string | null;
    enclosurePosition?: string | null;
    gravestoneDealer?: string | null;
    gravestoneType?: string | null;
    surroundingArea?: string | null;
    gravestoneCost?: number | null;
    establishmentDeadline?: string | null;
    establishmentDate?: string | null;
    gravestoneInscription?: string | null;
    directionId?: number | null;
    positionId?: number | null;
  };

  familyContacts?: Array<{
    emergencyContactFlag?: boolean;
    name: string;
    nameKana?: string | null;
    birthDate?: string | null;
    relationship: string;
    postalCode?: string | null;
    address?: string | null;
    phoneNumber?: string | null;
    phoneNumber2?: string | null;
    faxNumber?: string | null;
    email?: string | null;
    registeredAddress?: string | null;
    mailingType?: AddressType | null;
    workCompanyName?: string | null;
    workCompanyNameKana?: string | null;
    workAddress?: string | null;
    workPhoneNumber?: string | null;
    contactMethod?: string | null;
    notes?: string | null;
  }>;

  buriedPersons?: Array<{
    name: string;
    nameKana?: string | null;
    relationship?: string | null;
    birthDate?: string | null;
    deathDate?: string | null;
    age?: number | null;
    gender?: Gender | null;
    burialDate?: string | null;
    posthumousName?: string | null;
    reportDate?: string | null;
    religion?: string | null;
    deathPlace?: string | null;
    causeOfDeath?: string | null;
    chiefMournerName?: string | null;
    chiefMournerRelationship?: string | null;
    notes?: string | null;
  }>;

  constructionInfos?: Array<{
    constructionType?: string | null;
    startDate?: string | null;
    completionDate?: string | null;
    contractor?: string | null;
    supervisor?: string | null;
    progress?: string | null;
    workItem1?: string | null;
    workDate1?: string | null;
    workAmount1?: number | null;
    workStatus1?: string | null;
    workItem2?: string | null;
    workDate2?: string | null;
    workAmount2?: number | null;
    workStatus2?: string | null;
    permitNumber?: string | null;
    applicationDate?: string | null;
    permitDate?: string | null;
    permitStatus?: string | null;
    paymentType1?: string | null;
    paymentAmount1?: number | null;
    paymentDate1?: string | null;
    paymentStatus1?: string | null;
    paymentType2?: string | null;
    paymentAmount2?: number | null;
    paymentScheduledDate2?: string | null;
    paymentStatus2?: string | null;
    scheduledEndDate?: string | null;
    constructionContent?: string | null;
    notes?: string | null;
  }>;

  collectiveBurial?: {
    burialCapacity: number;
    validityPeriodYears: number;
    billingAmount?: number | null;
    notes?: string | null;
  };
}

/**
 * Update plot request body (PUT /plots/:id)
 * All fields are optional for partial updates
 */
export interface UpdatePlotRequest {
  physicalPlot?: {
    plotNumber?: string;
    areaName?: string;
    areaSqm?: number;
    status?: string;
    mapId?: number | null;
    notes?: string | null;
  };

  contractPlot?: {
    contractAreaSqm?: number;
    locationDescription?: string | null;
    inscription?: string | null;
  };

  saleContract?: {
    contractDate?: string | null;
    price?: number | null;
    contractStatus?: ContractStatus;
    paymentStatus?: PaymentStatus;
    customerRole?: string;
    reservationDate?: string | null;
    requestDate?: string | null;
    acceptanceNumber?: string | null;
    acceptanceDate?: string | null;
    staffInCharge?: string | null;
    permitDate?: string | null;
    permitNumber?: string | null;
    startDate?: string | null;
    /** @deprecated 手入力廃止（#170）。送信しても無視され、サーバが請求実績から導出した値で上書きされる。 */
    uncollectedAmount?: number | null;
    agentName?: string | null;
    notes?: string | null;
    graveKind?: number | null;
    graveKubun?: number | null;
    graveType?: number | null;
    legacyGraveCd?: number | null;
    roles?: Array<{
      customerId?: string;
      role: ContractRole;
      roleStartDate?: string | null;
      roleEndDate?: string | null;
      notes?: string | null;
    }>;
  };

  customer?: {
    name?: string;
    nameKana?: string;
    birthDate?: string | null;
    gender?: Gender | null;
    postalCode?: string;
    address?: string;
    addressLine2?: string | null;
    registeredPostalCode?: string | null;
    registeredAddress?: string | null;
    phoneNumber?: string | null;
    faxNumber?: string | null;
    email?: string | null;
    bankName?: string | null;
    branchName?: string | null;
    accountType?: string | null;
    accountNumber?: string | null;
    accountHolder?: string | null;
    notes?: string | null;
    staffId?: number | null;
    legacyDankaCd?: number | null;
  };

  // 申込者。指定時は upsert（既存なし→新規作成、既存あり→更新）。
  // 明示的に null を送ると申込者 role を解除（soft-delete）。undefined は変更なし。
  applicant?: {
    name?: string;
    nameKana?: string;
    birthDate?: string | null;
    gender?: Gender | null;
    postalCode?: string | null;
    address?: string | null;
    addressLine2?: string | null;
    registeredPostalCode?: string | null;
    registeredAddress?: string | null;
    phoneNumber?: string | null;
    faxNumber?: string | null;
    email?: string | null;
    notes?: string | null;
    staffId?: number | null;
    legacyDankaCd?: number | null;
  } | null;

  workInfo?: {
    companyName?: string;
    companyNameKana?: string;
    workAddress?: string;
    workPostalCode?: string;
    workPhoneNumber?: string;
    dmSetting?: DmSetting;
    addressType?: AddressType;
    notes?: string | null;
  } | null;

  usageFee?: {
    calculationType?: string | null;
    taxType?: string | null;
    billingType?: string | null;
    billingYears?: string | null;
    usageFee?: string | null;
    area?: string | null;
    unitPrice?: string | null;
    paymentMethod?: string | null;
  } | null;

  managementFee?: {
    calculationType?: string | null;
    taxType?: string | null;
    billingType?: string | null;
    billingYears?: string | null;
    area?: string | null;
    billingMonth?: string | null;
    managementFee?: string | null;
    unitPrice?: string | null;
    lastBillingMonth?: string | null;
    paymentMethod?: string | null;
  } | null;

  gravestoneInfo?: {
    gravestoneBase?: string | null;
    enclosurePosition?: string | null;
    gravestoneDealer?: string | null;
    gravestoneType?: string | null;
    surroundingArea?: string | null;
    gravestoneCost?: number | null;
    establishmentDeadline?: string | null;
    establishmentDate?: string | null;
    gravestoneInscription?: string | null;
    directionId?: number | null;
    positionId?: number | null;
  } | null;

  familyContacts?: Array<{
    id?: string;
    emergencyContactFlag?: boolean;
    name: string;
    nameKana?: string | null;
    birthDate?: string | null;
    relationship: string;
    postalCode?: string | null;
    address?: string | null;
    phoneNumber?: string | null;
    phoneNumber2?: string | null;
    faxNumber?: string | null;
    email?: string | null;
    registeredAddress?: string | null;
    mailingType?: AddressType | null;
    workCompanyName?: string | null;
    workCompanyNameKana?: string | null;
    workAddress?: string | null;
    workPhoneNumber?: string | null;
    contactMethod?: string | null;
    notes?: string | null;
  }>;

  buriedPersons?: Array<{
    id?: string;
    name: string;
    nameKana?: string | null;
    relationship?: string | null;
    birthDate?: string | null;
    deathDate?: string | null;
    age?: number | null;
    gender?: Gender | null;
    burialDate?: string | null;
    posthumousName?: string | null;
    reportDate?: string | null;
    religion?: string | null;
    deathPlace?: string | null;
    causeOfDeath?: string | null;
    chiefMournerName?: string | null;
    chiefMournerRelationship?: string | null;
    notes?: string | null;
  }>;

  constructionInfos?: Array<{
    id?: string;
    constructionType?: string | null;
    startDate?: string | null;
    completionDate?: string | null;
    contractor?: string | null;
    supervisor?: string | null;
    progress?: string | null;
    workItem1?: string | null;
    workDate1?: string | null;
    workAmount1?: number | null;
    workStatus1?: string | null;
    workItem2?: string | null;
    workDate2?: string | null;
    workAmount2?: number | null;
    workStatus2?: string | null;
    permitNumber?: string | null;
    applicationDate?: string | null;
    permitDate?: string | null;
    permitStatus?: string | null;
    paymentType1?: string | null;
    paymentAmount1?: number | null;
    paymentDate1?: string | null;
    paymentStatus1?: string | null;
    paymentType2?: string | null;
    paymentAmount2?: number | null;
    paymentScheduledDate2?: string | null;
    paymentStatus2?: string | null;
    scheduledEndDate?: string | null;
    constructionContent?: string | null;
    notes?: string | null;
  }>;

  collectiveBurial?: {
    burialCapacity?: number;
    validityPeriodYears?: number;
    billingStatus?: string;
    billingAmount?: number | null;
    notes?: string | null;
  } | null;

  /**
   * 変更理由（任意）。指定すると本更新で記録される履歴（History.change_reason, VarChar(200)）に反映される。
   * UI はプリセット（名義変更/住所変更/電話番号変更/解約/合祀/修理/字彫/備品購入 等）＋自由入力を提供する（frontend #261）。
   */
  changeReason?: string;
}

/**
 * Create plot response (POST /plots)
 */
export interface CreatePlotResponse {
  id: string;
  contractAreaSqm: number;
  locationDescription: string | null;
  contractDate: string | null;
  price: number | null;
  paymentStatus: PaymentStatus;
  reservationDate: string | null;
  acceptanceNumber: string | null;
  permitDate: string | null;
  startDate: string | null;
  agentName: string | null;
  notes: string | null;
  physicalPlot: {
    id: string;
    plotNumber: string;
    areaName: string;
    areaSqm: number;
    status: PhysicalPlotStatus;
  };
  primaryCustomer: {
    id: string;
    name: string;
    nameKana: string;
    phoneNumber: string | null;
    address: string;
    role: ContractRole;
  } | null;
  roles: Array<{
    id: string;
    role: ContractRole;
    roleStartDate: string | null;
    roleEndDate: string | null;
    notes: string | null;
    customer: {
      id: string;
      name: string;
      nameKana: string;
      phoneNumber: string | null;
      address: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * 契約復活リクエスト（POST /api/v1/plots/:id/restore）
 *
 * terminated 状態の ContractPlot を active に戻す（誤操作リカバリ用）。
 * reason は履歴に記録されるため必須（1〜200文字、空白のみは拒否）。
 */
export interface RestoreContractRequest {
  reason: string;
}

/**
 * 契約復活レスポンス（POST /api/v1/plots/:id/restore）
 */
export interface RestoreContractResponse {
  message: string;
  id: string;
  contractStatus: ContractStatus;
}
