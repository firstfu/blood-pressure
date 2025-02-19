import { create } from "zustand";
import { StateCreator } from "zustand";
import { BloodPressureRecord } from "../types/bloodPressure";

interface BloodPressureState {
  records: BloodPressureRecord[];
  addRecord: (record: BloodPressureRecord) => void;
  updateRecord: (id: string, record: Partial<BloodPressureRecord>) => void;
  deleteRecord: (id: string) => void;
  clearRecords: () => void;
}

type BloodPressureStore = StateCreator<BloodPressureState>;

export const useBloodPressureStore = create<BloodPressureState>((set: (fn: (state: BloodPressureState) => Partial<BloodPressureState>) => void) => ({
  records: [],
  addRecord: (record: BloodPressureRecord) =>
    set((state: BloodPressureState) => ({
      records: [...state.records, record],
    })),
  updateRecord: (id: string, updatedRecord: Partial<BloodPressureRecord>) =>
    set((state: BloodPressureState) => ({
      records: state.records.map((record: BloodPressureRecord) => (record.id === id ? { ...record, ...updatedRecord } : record)),
    })),
  deleteRecord: (id: string) =>
    set((state: BloodPressureState) => ({
      records: state.records.filter((record: BloodPressureRecord) => record.id !== id),
    })),
  clearRecords: () => set({ records: [] }),
}));
