/**
 * @komine/types - Shared Enum Definitions
 *
 * These enums match the Prisma schema definitions in komine--cemetery-crm-backend
 * and should be used by both frontend and backend.
 */

// 物理区画のステータス
export enum PhysicalPlotStatus {
  Available = 'available',         // 利用可能
  PartiallySold = 'partially_sold', // 一部販売済み
  SoldOut = 'sold_out',            // 完売
}

// 支払いステータス
export enum PaymentStatus {
  Unpaid = 'unpaid',         // 未払い
  PartialPaid = 'partial_paid', // 一部入金
  Paid = 'paid',             // 全額入金済み
  Overdue = 'overdue',       // 延滞
  Refunded = 'refunded',     // 返金済み
}

// 契約ステータス（レガシー m_bochi.status NULL/1/0 に対応）
export enum ContractStatus {
  Vacant = 'vacant',         // 未契約（旧 NULL）
  Active = 'active',         // 契約中（旧 status=1）
  Terminated = 'terminated', // 解約済（旧 status=0）
}

// 性別
export enum Gender {
  Male = 'male',             // 男性
  Female = 'female',         // 女性
  NotAnswered = 'not_answered', // 未回答
}

// 契約における役割
export enum ContractRole {
  Applicant = 'applicant',   // 申込者
  Contractor = 'contractor', // 契約者
}

// 郵送先・連絡先タイプ
export enum AddressType {
  Home = 'home',   // 自宅
  Work = 'work',   // 勤務先
  Other = 'other', // その他
}

// DM送信設定
export enum DmSetting {
  Allow = 'allow',     // 送信許可
  Deny = 'deny',       // 送信拒否
  Limited = 'limited', // 制限付き
}

// 請求ステータス（合祀用）
export enum BillingStatus {
  Pending = 'pending', // 請求前
  Billed = 'billed',   // 請求済
  Paid = 'paid',       // 支払済
}

// 請求の料金区分（Billing.category）
export enum BillingCategory {
  UsageFee = 'usage_fee',           // 使用料
  ManagementFee = 'management_fee', // 管理料
  CollectiveFee = 'collective_fee', // 合祀料金
  ConstructionFee = 'construction_fee', // 工事料金
  GravestoneFee = 'gravestone_fee', // 墓石代
  Other = 'other',                  // その他
}

// 請求レコードのステータス（Billing.status）
export enum BillingRecordStatus {
  Pending = 'pending',         // 請求前
  Billed = 'billed',           // 請求済
  PartialPaid = 'partial_paid', // 一部入金
  Paid = 'paid',               // 全額入金済
  Overdue = 'overdue',         // 延滞
  Terminated = 'terminated',   // 解約済（使用料/管理料が止まった）
  WrittenOff = 'written_off',  // 貸倒処理
}

// 履歴アクションタイプ
export enum ActionType {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
}

// 書類タイプ
export enum DocumentType {
  Invoice = 'invoice',   // 請求書
  Postcard = 'postcard', // はがき
  Contract = 'contract', // 契約書
  Permit = 'permit',     // 許可証
  Other = 'other',       // その他
}

// 書類ステータス
export enum DocumentStatus {
  Draft = 'draft',         // 下書き
  Generated = 'generated', // 生成済み
  Sent = 'sent',           // 送付済み
  Archived = 'archived',   // アーカイブ
}

// スタッフ権限
export enum StaffRole {
  Viewer = 'viewer',     // 閲覧者
  Operator = 'operator', // オペレーター
  Manager = 'manager',   // マネージャー
  Admin = 'admin',       // 管理者
}
