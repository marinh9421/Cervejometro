export enum BeerContainerType {
  LATA_350 = 'LATA_350',
  LATA_269 = 'LATA_269',
  GARRAFA_600 = 'GARRAFA_600',
  GARRAFA_1L = 'GARRAFA_1L'
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  password?: string; // Only used locally for checks
}

export interface BeerOption {
  id: BeerContainerType;
  label: string;
  volumeLabel: string;
  conversionFactor: number;
  icon: string;
  gasKey: 'v269' | 'v350' | 'v600' | 'v1l'; // Key for Google Apps Script
}

export interface ConsumptionLog {
  id: string;
  timestamp: string;
  userName: string;
  containerType: BeerContainerType;
  quantity: number;
  equivalentUnits: number;
}

export interface UserStats {
  userName: string;
  totalEquivalent: number;
  rank: number;
  title: string;
  lastDrinkTime: string;
}

export interface DashboardStats {
  totalGroupUnits: number;
  averagePerPerson: number;
  individualRecord: { user: string; amount: number } | null;
  dailyRecord: { date: string; amount: number } | null;
}

export interface SheetConfig {
  isConnected: boolean;
  sheetUrl: string;
}

export type TimeFilter = 'TODAY' | 'WEEK' | 'MONTH' | 'ALL';