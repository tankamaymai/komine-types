/**
 * Plot-related type definitions (PhysicalPlot, ContractPlot, SaleContractRole)
 */

import {
  PhysicalPlotStatus,
  PaymentStatus,
  ContractStatus,
  ContractRole,
} from '../enums';
import { Customer, FamilyContact, BuriedPerson } from './customer';

/**
 * PhysicalPlot - 物理区画マスタ
 * Matches: Prisma PhysicalPlot model
 */
export interface PhysicalPlot {
  id: string;
  plotNumber: string;
  areaName: string;
  areaSqm: number;
  status: PhysicalPlotStatus;
  mapId: number | null;  // マップ位置ID（レガシー map_id）
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * ContractPlot - 契約区画
 * Matches: Prisma ContractPlot model
 */
export interface ContractPlot {
  id: string;
  physicalPlotId: string;
  contractAreaSqm: number;
  locationDescription: string | null;
  /** 碑文（注意書きの一言・一覧表示用）。墓誌(GravestoneInfo)とは別物。 */
  inscription: string | null;

  // Sale contract info (integrated)
  contractDate: string | null;  // ISO date string（レガシー 45%空のため nullable）
  price: number | null;          // レガシー 53%空のため nullable
  contractStatus: ContractStatus;
  paymentStatus: PaymentStatus;
  reservationDate: string | null;
  requestDate: string | null;    // 申込日（レガシー request_date）
  acceptanceNumber: string | null;
  acceptanceDate: string | null;  // 受付日
  staffInCharge: string | null;  // 担当者
  permitDate: string | null;
  permitNumber: string | null;
  startDate: string | null;
  notes: string | null;

  // レガシー由来の区分コード（sykbnn 未紐付け、整理せずそのまま保持）
  graveKind: number | null;   // 区画種別1（レガシー grave_kind）
  graveKubun: number | null;  // 区画種別2（レガシー grave_kubun）
  graveType: number | null;   // 区画種別3（レガシー grave_type）

  // 移行用（後で削除可能）
  legacyGraveCd: number | null;

  createdAt: string;
  updatedAt: string;

  // Optional related data (included in detail responses)
  physicalPlot?: PhysicalPlot;
  usageFee?: UsageFee | null;
  managementFee?: ManagementFee | null;
  gravestoneInfo?: GravestoneInfo | null;
  constructionInfos?: ConstructionInfo[];
  familyContacts?: FamilyContact[];
  buriedPersons?: BuriedPerson[];
  collectiveBurial?: CollectiveBurial | null;
  roles?: SaleContractRole[];
}

/**
 * SaleContractRole - 販売契約における顧客の役割
 * Matches: Prisma SaleContractRole model
 */
export interface SaleContractRole {
  id: string;
  contractPlotId: string;
  customerId: string;
  role: ContractRole;
  roleStartDate: string | null;
  roleEndDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;

  // Related customer (included in responses)
  customer?: Customer;
}

/**
 * UsageFee - 使用料
 * Matches: Prisma UsageFee model
 */
export interface UsageFee {
  id: string;
  contractPlotId: string;
  calculationType: string | null;
  taxType: string | null;
  billingType: string | null;
  billingYears: string | null;
  area: string | null;
  unitPrice: string | null;
  usageFee: string | null;
  paymentMethod: string | null;
}

/**
 * ManagementFee - 管理料
 * Matches: Prisma ManagementFee model
 */
export interface ManagementFee {
  id: string;
  contractPlotId: string;
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
}

/**
 * GravestoneInfo - 墓石情報
 * Matches: Prisma GravestoneInfo model
 */
export interface GravestoneInfo {
  id: string;
  contractPlotId: string;
  gravestoneBase: string | null;
  enclosurePosition: string | null;
  gravestoneDealer: string | null;
  gravestoneType: string | null;
  surroundingArea: string | null;
  gravestoneCost: number | null;  // 墓石代（円単位）
  establishmentDeadline: string | null;
  establishmentDate: string | null;
  gravestoneInscription: string | null;  // 墓誌（レガシー boshi）
  directionId: number | null;            // 方位ID（レガシー houi_id）
  positionId: number | null;             // 位置ID（レガシー ichi_id）
}

/**
 * ConstructionInfo - 工事情報
 * Matches: Prisma ConstructionInfo model
 */
export interface ConstructionInfo {
  id: string;
  contractPlotId: string;
  constructionType: string | null;
  startDate: string | null;
  completionDate: string | null;
  contractor: string | null;
  supervisor: string | null;
  progress: string | null;

  // Work details
  workItem1: string | null;
  workDate1: string | null;
  workAmount1: number | null;
  workStatus1: string | null;
  workItem2: string | null;
  workDate2: string | null;
  workAmount2: number | null;
  workStatus2: string | null;

  // Permit info
  permitNumber: string | null;
  applicationDate: string | null;
  permitDate: string | null;
  permitStatus: string | null;

  // Payment info
  paymentType1: string | null;
  paymentAmount1: number | null;
  paymentDate1: string | null;
  paymentStatus1: string | null;
  paymentType2: string | null;
  paymentAmount2: number | null;
  paymentScheduledDate2: string | null;
  paymentStatus2: string | null;

  // Additional fields
  scheduledEndDate: string | null;  // 終了予定日
  constructionContent: string | null;  // 工事内容

  notes: string | null;
}

/**
 * CollectiveBurial - 合祀情報
 * Matches: Prisma CollectiveBurial model
 */
export interface CollectiveBurial {
  id: string;
  contractPlotId: string;
  burialCapacity: number;
  currentBurialCount: number;
  capacityReachedDate: string | null;
  validityPeriodYears: number;
  billingScheduledDate: string | null;
  billingStatus: string;
  billingAmount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input types for creating/updating
 */
export interface PhysicalPlotInput {
  plotNumber: string;
  areaName: string;
  areaSqm?: number;
  status?: PhysicalPlotStatus;
  mapId?: number | null;
  notes?: string | null;
}

export interface ContractPlotInput {
  physicalPlotId?: string;
  contractAreaSqm: number;
  locationDescription?: string | null;
  inscription?: string | null;
  contractDate?: string | null;
  price?: number | null;
  contractStatus?: ContractStatus;
  paymentStatus?: PaymentStatus;
  reservationDate?: string | null;
  requestDate?: string | null;
  acceptanceNumber?: string | null;
  acceptanceDate?: string | null;
  staffInCharge?: string | null;
  permitDate?: string | null;
  permitNumber?: string | null;
  startDate?: string | null;
  notes?: string | null;
  graveKind?: number | null;
  graveKubun?: number | null;
  graveType?: number | null;
  legacyGraveCd?: number | null;
}

export interface UsageFeeInput {
  calculationType?: string | null;
  taxType?: string | null;
  billingType?: string | null;
  billingYears?: string | null;
  area?: string | null;
  unitPrice?: string | null;
  usageFee?: string | null;
  paymentMethod?: string | null;
}

export interface ManagementFeeInput {
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
}

export interface GravestoneInfoInput {
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
}

export interface CollectiveBurialInput {
  burialCapacity: number;
  validityPeriodYears: number;
  billingStatus?: string;
  billingAmount?: number | null;
  notes?: string | null;
}

export interface SaleContractRoleInput {
  customerId?: string;
  role: ContractRole;
  roleStartDate?: string | null;
  roleEndDate?: string | null;
  notes?: string | null;
}
