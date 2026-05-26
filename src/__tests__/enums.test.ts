/**
 * Enum 値の安定性テスト
 *
 * enum の文字列値は DB(Prisma) / API レスポンス / フロント表示の契約値であり、
 * 不用意な変更はランタイムバグ・データ不整合に直結する。値を固定して検知する。
 */
import {
  PhysicalPlotStatus,
  PaymentStatus,
  ContractStatus,
  Gender,
  ContractRole,
  AddressType,
  DmSetting,
  BillingStatus,
  BillingCategory,
  BillingRecordStatus,
  ActionType,
  DocumentType,
  DocumentStatus,
  StaffRole,
} from '../enums';

describe('enum value stability', () => {
  it('PhysicalPlotStatus', () => {
    expect({ ...PhysicalPlotStatus }).toEqual({
      Available: 'available',
      PartiallySold: 'partially_sold',
      SoldOut: 'sold_out',
    });
  });

  it('PaymentStatus', () => {
    expect({ ...PaymentStatus }).toEqual({
      Unpaid: 'unpaid',
      PartialPaid: 'partial_paid',
      Paid: 'paid',
      Overdue: 'overdue',
      Refunded: 'refunded',
    });
  });

  it('ContractStatus', () => {
    expect({ ...ContractStatus }).toEqual({
      Vacant: 'vacant',
      Active: 'active',
      Terminated: 'terminated',
    });
  });

  it('Gender', () => {
    expect({ ...Gender }).toEqual({
      Male: 'male',
      Female: 'female',
      NotAnswered: 'not_answered',
    });
  });

  it('ContractRole', () => {
    expect({ ...ContractRole }).toEqual({ Applicant: 'applicant', Contractor: 'contractor' });
  });

  it('AddressType', () => {
    expect({ ...AddressType }).toEqual({ Home: 'home', Work: 'work', Other: 'other' });
  });

  it('DmSetting', () => {
    expect({ ...DmSetting }).toEqual({ Allow: 'allow', Deny: 'deny', Limited: 'limited' });
  });

  it('BillingStatus', () => {
    expect({ ...BillingStatus }).toEqual({ Pending: 'pending', Billed: 'billed', Paid: 'paid' });
  });

  it('BillingCategory', () => {
    expect({ ...BillingCategory }).toEqual({
      UsageFee: 'usage_fee',
      ManagementFee: 'management_fee',
      CollectiveFee: 'collective_fee',
      ConstructionFee: 'construction_fee',
      GravestoneFee: 'gravestone_fee',
      Other: 'other',
    });
  });

  it('BillingRecordStatus', () => {
    expect({ ...BillingRecordStatus }).toEqual({
      Pending: 'pending',
      Billed: 'billed',
      PartialPaid: 'partial_paid',
      Paid: 'paid',
      Overdue: 'overdue',
      Terminated: 'terminated',
      WrittenOff: 'written_off',
    });
  });

  it('ActionType (uppercase)', () => {
    expect({ ...ActionType }).toEqual({ Create: 'CREATE', Update: 'UPDATE', Delete: 'DELETE' });
  });

  it('DocumentType', () => {
    expect({ ...DocumentType }).toEqual({
      Invoice: 'invoice',
      Postcard: 'postcard',
      Contract: 'contract',
      Permit: 'permit',
      Other: 'other',
    });
  });

  it('DocumentStatus', () => {
    expect({ ...DocumentStatus }).toEqual({
      Draft: 'draft',
      Generated: 'generated',
      Sent: 'sent',
      Archived: 'archived',
    });
  });

  it('StaffRole (hierarchy order)', () => {
    expect({ ...StaffRole }).toEqual({
      Viewer: 'viewer',
      Operator: 'operator',
      Manager: 'manager',
      Admin: 'admin',
    });
  });
});
