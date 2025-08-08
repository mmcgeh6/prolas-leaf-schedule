import Dexie, { Table } from 'dexie';

export interface PunchQueueItem {
  id?: number;
  payload: any;
  createdAt: Date;
  synced: boolean;
}

export class ProlasDB extends Dexie {
  punchQueue!: Table<PunchQueueItem, number>;
  todaySchedules!: Table<{ id?: number; dateKey: string; data: any }, number>;

  constructor() {
    super('prolas_ops_demo');
    this.version(1).stores({
      punchQueue: '++id, synced, createdAt',
      todaySchedules: '++id, dateKey'
    });
  }
}

export const db = new ProlasDB();
