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
} from '../enums';

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

  // Buried person names (for list display)
  buriedPersonNames: string[];

  // Agent/dealer name
  agentName: string | null;

  // Permit info
  permitNumber: string | null;

  // Billing info
  nextBillingDate: string | null;
  managementFee: string | null;
  uncollectedAmount: number;

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
  uncollectedAmount: number;
  contractNotes: string | null;
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
      registeredAddress: string | null;
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
    registeredAddress?: string | null;
    phoneNumber: string | null;
    faxNumber?: string | null;
    email?: string | null;
    notes?: string | null;
    staffId?: number | null;
    legacyDankaCd?: number | null;
    role?: ContractRole;
  };

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
    registeredAddress?: string | null;
    phoneNumber?: string | null;
    faxNumber?: string | null;
    email?: string | null;
    notes?: string | null;
    staffId?: number | null;
    legacyDankaCd?: number | null;
  };

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
 * 一括操作で失敗したアイテムの詳細
 * row: リクエスト内でのインデックス（0 始まり）
 * plotNumber: 該当行の区画番号（分かる場合のみ）
 * error: 失敗理由
 */
export interface BulkFailureItem {
  row: number;
  plotNumber?: string | null;
  error: {
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

/**
 * 一括登録の成功アイテム
 */
export interface BulkCreateResultItem {
  row: number;
  id: string;
  physicalPlotId: string;
  plotNumber: string | null;
}

/**
 * 一括登録レスポンス（POST /api/v1/plots/bulk）
 *
 * totalRequested: リクエストされた総件数
 * succeeded: 成功件数
 * failed: 失敗した行の詳細
 * results: 成功した行の詳細
 */
export interface BulkCreatePlotsResponse {
  totalRequested: number;
  succeeded: number;
  failed: BulkFailureItem[];
  results: BulkCreateResultItem[];
}

/**
 * 一括編集の成功アイテム
 */
export interface BulkUpdateResultItem {
  row: number;
  id: string;
  plotNumber: string;
}

/**
 * 一括編集レスポンス（PUT /api/v1/plots/bulk）
 */
export interface BulkUpdatePlotsResponse {
  totalRequested: number;
  succeeded: number;
  failed: BulkFailureItem[];
  results: BulkUpdateResultItem[];
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
