/**
 * バリデーションモジュール バレルエクスポート
 *
 * 共通バリデーション（common）、区画フォーム（plot）、書類（document）を
 * 再エクスポート。フロントエンド・バックエンド双方から参照する。
 *
 * Usage:
 *   import { customerSchema, requiredPhoneSchema } from '@komine/types/validations';
 */

export * from './common';
export * from './plot';
export * from './document';
export * from './billing';
export * from './payment';
